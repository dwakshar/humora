import { AuthProvider } from "@context/AuthContext";
import { ProtectedRoute, PublicRoute } from "@routes/ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Pages
import OAuthCallbackPage from "@pages/OAuthCallbackPage";
import DemoPage from "@pages/DemoPage";
import DocsPage from "@pages/DocsPage";
import QuickStartPage from "@pages/QuickStartPage";
import ForgotPassword from "@pages/ForgotPasswordPage";
import LandingPage from "@pages/LandingPage";
import LoginPage from "@pages/LoginPage";
import NotFoundPage from "@pages/NotFoundPage";
import OnboardingFlow from "@pages/OnboardingFlow";
import PricingPage from "@pages/PricingPage";
import SignupPage from "@pages/SignupPage";

// Dashboard
import DashboardLayout from "@components/layout/DashboardLayout";
import AnalyticsPage from "@pages/dashboard/AnalyticsPage";
import ApiKeysPage from "@pages/dashboard/ApiKeysPage";
import BillingPage from "@pages/dashboard/BillingPage";
import BillingHistoryPage from "@pages/dashboard/BillingHistoryPage";
import DashboardHome from "@pages/dashboard/DashboardHome";
import MySitesPage from "@pages/dashboard/MySitesPage";
import SettingsPage from "@pages/dashboard/SettingsPage";
import SupportPage from "@pages/dashboard/SupportPage";

const PAGE_TITLES = {
  "/": "Humora — Verify humanity. Not patience.",
  "/pricing": "Pricing — Humora",
  "/demo": "Live Demo — Humora",
  "/docs": "Documentation — Humora",
  "/quickstart": "Quick Start — Humora",
  "/login": "Sign In — Humora",
  "/signup": "Get Started — Humora",
  "/forgot-password": "Reset Password — Humora",
  "/onboarding": "Get Started — Humora",
  "/dashboard": "Dashboard — Humora",
  "/dashboard/analytics": "Analytics — Humora",
  "/dashboard/sites": "My Sites — Humora",
  "/dashboard/billing": "Billing — Humora",
  "/dashboard/settings": "Settings — Humora",
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = PAGE_TITLES[pathname] || "Humora";
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit">
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route
          path="/"
          element={
            <AnimatedPage>
              <LandingPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/pricing"
          element={
            <AnimatedPage>
              <PricingPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/demo"
          element={
            <AnimatedPage>
              <DemoPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/docs"
          element={
            <AnimatedPage>
              <DocsPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/docs/:slug"
          element={
            <AnimatedPage>
              <DocsPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/quickstart"
          element={
            <AnimatedPage>
              <QuickStartPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AnimatedPage>
                <LoginPage />
              </AnimatedPage>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute redirectTo="/onboarding">
              <AnimatedPage>
                <SignupPage />
              </AnimatedPage>
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AnimatedPage>
              <ForgotPassword />
            </AnimatedPage>
          }
        />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        {/* Protected */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <OnboardingFlow />
              </AnimatedPage>
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="sites" element={<MySitesPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="billing-history" element={<BillingHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <AnimatedPage>
              <NotFoundPage />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
