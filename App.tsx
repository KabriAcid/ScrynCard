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
import RedeemPage from "@/features/citizen/pages/RedeemPage";
import RedeemDetails from "@/features/citizen/pages/RedeemDetails";
import OrderCards from "@/features/citizen/pages/OrderCards";

// Admin Pages
import AdminDashboard from "@/features/admin/pages/Dashboard";
import AdminPoliticians from "@/features/admin/pages/Politicians";
import AdminAnalytics from "@/features/admin/pages/Analytics";
import AdminFraud from "@/features/admin/pages/Fraud";
import AdminCards from "@/features/admin/pages/Cards";
import AdminRedemptions from "@/features/admin/pages/Redemptions";
import AdminCitizens from "@/features/admin/pages/Citizens";
import AdminCampaigns from "@/features/admin/pages/Campaigns";

// Politician Pages
import PoliticianDashboard from "@/features/politician/pages/Dashboard";

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: "admin" | "politician";
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
                  <Route path="/analytics" element={<AdminAnalytics />} />
                  <Route path="/fraud" element={<AdminFraud />} />
                  <Route path="/cards" element={<AdminCards />} />
                  <Route path="/redemptions" element={<AdminRedemptions />} />
                  <Route path="/citizens" element={<AdminCitizens />} />
                  <Route path="/campaigns" element={<AdminCampaigns />} />
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
