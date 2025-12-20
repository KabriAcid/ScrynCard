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
import CitizenLayout from "@/features/citizen/layout/CitizenLayout";

// Public Pages
import HomePage from "@/features/citizen/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";

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
// import PoliticianAnalytics from "@/features/politician/pages/Analytics";
// import PoliticianRedemption from "@/features/politician/pages/Redemption";
// import PoliticianRedemptionDetails from "@/features/politician/pages/RedemptionDetails";

// Citizen Pages
import CitizenHome from "@/features/citizen/pages/HomePage";
// import CitizenRedeem from "@/features/citizen/pages/RedeemPage";
// import CitizenRedeemDetails from "@/features/citizen/pages/RedeemDetails";
// import CitizenOrderCards from "@/features/citizen/pages/OrderCards";

// Loading Component
import { DashboardSkeleton } from "@/features/admin/components";

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: "admin" | "politician" | "citizen";
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
      citizen: "/redeem",
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
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
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

        {/* Politician Routes */}
        <Route
          path="/politician/*"
          element={
            <ProtectedRoute requiredRole="politician">
              <PoliticianLayout>
                <Routes>
                  <Route path="/" element={<PoliticianDashboard />} />
                  {/* <Route path="/analytics" element={<PoliticianAnalytics />} /> */}
                  {/* <Route path="/redemption" element={<PoliticianRedemption />} /> */}
                  {/* <Route path="/redemption/:id" element={<PoliticianRedemptionDetails />} /> */}
                </Routes>
              </PoliticianLayout>
            </ProtectedRoute>
          }
        />

        {/* Citizen Routes */}
        <Route
          path="/redeem/*"
          element={
            <ProtectedRoute requiredRole="citizen">
              <CitizenLayout>
                <Routes>
                  <Route path="/" element={<CitizenHome />} />
                  {/* <Route path="/card" element={<CitizenRedeem />} /> */}
                  {/* <Route path="/card/:id" element={<CitizenRedeemDetails />} /> */}
                  {/* <Route path="/order" element={<CitizenOrderCards />} /> */}
                </Routes>
              </CitizenLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback - Redirect to home or appropriate dashboard */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "politician"
                  ? "/politician"
                  : user?.role === "citizen"
                  ? "/redeem"
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
