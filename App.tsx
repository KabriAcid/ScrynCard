import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Guest Routes
import Homepage from "@/features/guest/Homepage";
import Login from "@/features/guest/Login";

// Client Routes
import ClientDashboard from "@/features/client/ClientDashboard";
import RedemptionDetails from "@/features/client/RedemptionDetails";
import Redemption from "@/features/client/Redemption";

// Admin Routes
import AdminDashboard from "@/features/admin/Dashboard";
import Politicians from "@/features/admin/Politicians";
import Analytics from "@/features/admin/Analytics";
import Fraud from "@/features/admin/Fraud";

// Loading
import Loading from "@/components/loading";

function App() {
  const { user, isAuthenticated } = useAuth();

  // Check if user is still loading
  const isLoading = isAuthenticated && !user;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />

        {/* Client Routes */}
        {isAuthenticated && user?.role === "citizen" && (
          <>
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/redemption" element={<Redemption />} />
            <Route path="/redemption/:id" element={<RedemptionDetails />} />
          </>
        )}

        {/* Admin Routes */}
        {isAuthenticated && user?.role === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/politicians" element={<Politicians />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/fraud" element={<Fraud />} />
          </>
        )}

        {/* Politician Routes */}
        {isAuthenticated && user?.role === "politician" && (
          <>
            <Route path="/politician/dashboard" element={<ClientDashboard />} />
            <Route path="/politician/orders" element={<Analytics />} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
