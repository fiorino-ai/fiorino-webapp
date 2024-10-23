import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { CostUsageScreen } from "./CostUsageScreen";
import { ActivityUsageScreen } from "./ActivityUsageScreen";
import { AuthLayout } from "@/components/custom/AuthLayout";
import { LoginScreen } from "./LoginScreen";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import { useAuthStore } from "@/stores/SessionStore";
import { useEffect } from "react";

const RedirectToMainPage: React.FC = () => {
  return <Navigate to={`/realms/usage`} />;
};

const RedirectToLoginPage: React.FC = () => {
  return <Navigate to={`/auth/login`} />;
};

export const Navigation: React.FC = () => {
  const { verifyToken, verifyingToken, user } = useAuthStore();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  if (verifyingToken) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth" element={<RedirectToLoginPage />} />
          <Route path="/auth/login" element={<LoginScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/realms" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/realms" element={<MainLayout />}>
            <Route path="/realms" element={<RedirectToMainPage />} />
            <Route path="/realms/usage" element={<CostUsageScreen />} />
            <Route
              path="/realms/usage/activity"
              element={<ActivityUsageScreen />}
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};
