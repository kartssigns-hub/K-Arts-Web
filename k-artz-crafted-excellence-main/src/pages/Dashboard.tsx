import React from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar"; // Assuming you have this

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />
      <div className="container mx-auto p-8 pt-24">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-amber-500 overflow-hidden flex items-center justify-center text-3xl font-bold text-amber-500">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Hello, {user?.displayName || "User"}!
              </h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="bg-slate-950/50 rounded-xl p-6 mb-8 border border-slate-800">
            <h3 className="text-amber-500 font-semibold mb-2">Account Details</h3>
            <p className="text-sm text-slate-400">UID: {user?.uid}</p>
            <p className="text-sm text-slate-400">Provider: {user?.providerData[0]?.providerId}</p>
          </div>

          <button
            onClick={() => logout()}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}