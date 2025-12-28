import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";

// Layouts
import AdminLayout from "@/features/admin/layout/AdminLayout";
import PoliticianLayout from "@/features/politician/layout/PoliticianLayout";

// Public Pages
import HomePage from "@/features/citizen/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";
import RedeemPage from "@/features/citizen/pages/RedeemPage";
import RedeemDetails from "@/features/citizen/pages/RedeemDetails";
import OrderCards from "@/features/citizen/pages/OrderCards";

// Admin Pages
import AdminDashboard from "@/features/admin/pages/Dashboard";
import AdminPoliticians from "@/features/admin/pages/Politicians";
import AdminAnalytics from "@/features/admin/pages/Analytics";
import AdminFraud from "@/features/admin/pages/Fraud";
import AdminCards from "@/features/admin/pages/Cards";
import AdminCardDetails from "@/features/admin/pages/CardDetails";
import AdminRedemptions from "@/features/admin/pages/Redemptions";
import AdminCitizens from "@/features/admin/pages/Citizens";
import AdminCampaigns from "@/features/admin/pages/Campaigns";
import AdminCampaignDetails from "@/features/admin/pages/CampaignDetails";
import AdminProfile from "@/features/admin/pages/Profile";
import AdminAccountSettings from "@/features/admin/pages/AccountSettings";
import AdminPoliticianDetails from "@/features/admin/pages/PoliticianDetails";

// Politician Pages
import PoliticianDashboard from "@/features/politician/pages/Dashboard";
import PoliticianRedemption from "@/features/politician/pages/Redemption";
import PoliticianRedemptionDetails from "@/features/politician/pages/RedemptionDetails";
import PoliticianAnalytics from "@/features/politician/pages/Analytics";
import PoliticianOrders from "@/features/politician/pages/Orders";
import PoliticianOrderDetails from "@/features/politician/pages/OrderDetails";
import PoliticianNewOrder from "@/features/politician/pages/NewOrder";
import PoliticianProfile from "@/features/politician/pages/Profile";
import PoliticianSettings from "@/features/politician/pages/Settings";

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: "admin" | "politician";
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  // DEV MODE: Bypass auth for seamless development
  const isDev = import.meta.env.DEV;

  if (isDev) {
    // In dev mode, allow access without authentication
    return <>{children}</>;
  }

  // PRODUCTION: Enforce authentication
  if (!user) {
    const loginPath = requiredRole === "admin" ? "/admin/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const dashboardMap: Record<string, string> = {
      admin: "/admin",
      politician: "/politician",
    };
    return <Navigate to={dashboardMap[user.role] || "/"} replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes - Guest (no auth required) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/redeem/details" element={<RedeemDetails />} />
        <Route path="/order" element={<OrderCards />} />

        {/* Admin Routes - Super Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/politicians" element={<AdminPoliticians />} />
                  <Route
                    path="/politicians/:id"
                    element={<AdminPoliticianDetails />}
                  />
                  <Route path="/analytics" element={<AdminAnalytics />} />
                  <Route path="/fraud" element={<AdminFraud />} />
                  <Route path="/cards" element={<AdminCards />} />
                  <Route path="/cards/:id" element={<AdminCardDetails />} />
                  <Route path="/redemptions" element={<AdminRedemptions />} />
                  <Route path="/citizens" element={<AdminCitizens />} />
                  <Route path="/campaigns" element={<AdminCampaigns />} />
                  <Route
                    path="/campaigns/:id"
                    element={<AdminCampaignDetails />}
                  />
                  <Route path="/profile" element={<AdminProfile />} />
                  <Route path="/settings" element={<AdminAccountSettings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Politician Routes - Authenticated Politician */}
        <Route
          path="/politician/*"
          element={
            <ProtectedRoute requiredRole="politician">
              <PoliticianLayout>
                <Routes>
                  <Route path="/" element={<PoliticianDashboard />} />
                  <Route
                    path="/redemption"
                    element={<PoliticianRedemption />}
                  />
                  <Route
                    path="/redemption/:id"
                    element={<PoliticianRedemptionDetails />}
                  />
                  <Route path="/analytics" element={<PoliticianAnalytics />} />
                  <Route path="/orders" element={<PoliticianOrders />} />
                  <Route path="/orders/new" element={<PoliticianNewOrder />} />
                  <Route
                    path="/orders/:id"
                    element={<PoliticianOrderDetails />}
                  />
                  <Route path="/profile" element={<PoliticianProfile />} />
                  <Route path="/settings" element={<PoliticianSettings />} />
                </Routes>
              </PoliticianLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback - Redirect based on auth state */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "politician"
                  ? "/politician"
                  : "/"
              }
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
