// Main App — full route configuration with auth boot, layouts, and guards
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentUser } from "./app/features/authSlice.js";
import { fetchMySubscription } from "./app/features/subscriptionSlice.js";

// Layouts
import UserLayout from "./layout/UserLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

// Route guards
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute.jsx";

// ─── User-facing pages ───
import HomePage from "./pages/user/HomePage.jsx";
import MagazinesPage from "./pages/user/MagazinesPage.jsx";
import MagazineDetailPage from "./pages/user/MagazineDetailPage.jsx";
import IssueDetailPage from "./pages/user/IssueDetailPage.jsx";
import ArticlePage from "./pages/user/ArticlePage.jsx";
import SearchResultsPage from "./pages/user/SearchResultsPage.jsx";
import SubscriptionPlansPage from "./pages/user/SubscriptionPlansPage.jsx";
import PaymentSuccessPage from "./pages/user/PaymentSuccessPage.jsx";
import PaymentCancelPage from "./pages/user/PaymentCancelPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import RegisterPage from "./pages/user/RegisterPage.jsx";
import AboutPage from "./pages/user/AboutPage.jsx";
import ContactPage from "./pages/user/ContactPage.jsx";
import PrivacyPolicyPage from "./pages/user/PrivacyPolicyPage.jsx";
import ProfilePage from "./pages/user/ProfilePage.jsx";
import MySubscriptionsPage from "./pages/user/MySubscriptionsPage.jsx";
import MyPurchasesPage from "./pages/user/MyPurchasesPage.jsx";
import BookmarksPage from "./pages/user/BookmarksPage.jsx";
import ReadingHistoryPage from "./pages/user/ReadingHistoryPage.jsx";
import PaymentHistoryPage from "./pages/user/PaymentHistoryPage.jsx";
import NotFoundPage from "./pages/user/NotFoundPage.jsx";

// ─── Admin pages ───
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import AdminMagazinesPage from "./pages/admin/MagazinesPage.jsx";
import AdminIssuesPage from "./pages/admin/IssuesPage.jsx";
import AdminArticlesPage from "./pages/admin/ArticlesPage.jsx";
import ArticleEditorPage from "./pages/admin/ArticleEditorPage.jsx";
import AdminCategoriesPage from "./pages/admin/CategoriesPage.jsx";
import AdminSubscriptionPlansPage from "./pages/admin/SubscriptionPlansPage.jsx";
import AdminUsersPage from "./pages/admin/UsersPage.jsx";
import AdminUserDetailPage from "./pages/admin/UserDetailPage.jsx";
import AdminSubscriptionsPage from "./pages/admin/SubscriptionsPage.jsx";
import AdminPurchasesPage from "./pages/admin/PurchasesPage.jsx";
import AdminPaymentsPage from "./pages/admin/PaymentsPage.jsx";
import AdminAnalyticsPage from "./pages/admin/AnalyticsPage.jsx";
import AdminSettingsPage from "./pages/admin/SettingsPage.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin } = useSelector((s) => s.auth);

  // ─── On app boot — probe /auth/me to hydrate the session ───
  // The HTTP-only auth cookie is sent automatically; if valid, the user is restored to Redux state, so they stay logged in across page reloads.
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Whenever a non-admin reader becomes authenticated, also hydrate their active subscription so the article paywall logic works correctly.
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      dispatch(fetchMySubscription());
    }
  }, [dispatch, isAuthenticated, isAdmin]);

  return (
    <Routes>
      {/* ══════════════════════════════════════════════════════════════════════════════════════
          USER-FACING ROUTES — wrapped in UserLayout (Navbar + page outlet + Footer + BackToTop)
          ══════════════════════════════════════════════════════════════════════════════════════ */}
      <Route element={<UserLayout />}>
        {/* ── Public pages ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/magazines" element={<MagazinesPage />} />
        <Route path="/magazines/:id" element={<MagazineDetailPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/plans" element={<SubscriptionPlansPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        {/* ── Auth pages ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Payment redirect endpoints (Stripe success/cancel URLs) ── */}
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-cancel" element={<PaymentCancelPage />} />

        {/* ── Authenticated reader dashboard ── */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-subscriptions"
          element={
            <ProtectedRoute>
              <MySubscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute>
              <MyPurchasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading-history"
          element={
            <ProtectedRoute>
              <ReadingHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-history"
          element={
            <ProtectedRoute>
              <PaymentHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* ── 404 inside user layout (catches everything that doesn't match above) ── */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ═════════════════════════════════════════════════════
          ADMIN AUTH ROUTE — standalone, NOT inside AdminLayout
          ═════════════════════════════════════════════════════ */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
          ADMIN PANEL ROUTES — wrapped in AdminLayout + Guarded by AdminProtectedRoute (must be authenticated + admin role)
          ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Content management */}
        <Route path="magazines" element={<AdminMagazinesPage />} />
        <Route path="issues" element={<AdminIssuesPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="articles/new" element={<ArticleEditorPage />} />
        <Route path="articles/edit/:id" element={<ArticleEditorPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />

        {/* Monetization */}
        <Route path="plans" element={<AdminSubscriptionPlansPage />} />
        <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
        <Route path="purchases" element={<AdminPurchasesPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />

        {/* Community */}
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminUserDetailPage />} />

        {/* Insights & config */}
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
