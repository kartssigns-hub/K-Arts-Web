import React, { createContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db, setAuthPersistence } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, pass: string, remember: boolean) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to sync user to Firestore
  const syncUserToFirestore = async (currentUser: User, providerName: string) => {
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email?.split("@")[0],
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        provider: providerName,
        createdAt: serverTimestamp(),
      });
    } else {
      // Optional: Update last login time here
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(result.user, "google");
    } catch (error) {
      console.error("Google Auth Error", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
    // Force reload to update local auth state with display name
    await result.user.reload();
    await syncUserToFirestore(auth.currentUser!, "password");
  };

  const login = async (email: string, pass: string, remember: boolean) => {
    await setAuthPersistence(remember);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, login, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};