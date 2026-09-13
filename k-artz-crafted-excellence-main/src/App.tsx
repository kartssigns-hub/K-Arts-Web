import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { initGA } from "./utils/analytics";
import ReactGA from "react-ga4";

// 1. Import Auth Context and Pages
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedAdminRoute from "../utils/ProtectedAdminRoute";

import ContactPage from "./pages/ContactPage";
import CatalogPage from "./pages/CatalogPage";
import CatalogEntryPage from "./pages/CatalogEntryPage";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { Suspense, lazy, useEffect } from "react";

/**
 * Signed-in and admin areas are code-split. They pull in socket.io and recharts,
 * which no public visitor needs — keeping them out of the initial bundle makes
 * the homepage and catalog noticeably lighter to load.
 */
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const queryClient = new QueryClient();

initGA();

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Send pageview with current path
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"
      role="status"
      aria-label="Loading"
    />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AnalyticsTracker />
        <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/contact" element={<ContactPage />} />

              {/*  CATALOG  */}
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:slug" element={<CatalogEntryPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/*  ALL CUSTOM ROUTES  */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <WhatsAppFloat />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
