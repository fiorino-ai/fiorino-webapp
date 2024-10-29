import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { CostUsageScreen } from "./CostUsageScreen";
import { ActivityUsageScreen } from "./ActivityUsageScreen";
import { AuthLayout } from "@/components/custom/AuthLayout";
import { LoginScreen } from "./LoginScreen";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import { SessionState, useAuthStore } from "@/stores/SessionStore";
import { useEffect } from "react";
import Loading from "@/components/custom/Loading";
import AuthRoute from "@/components/custom/AuthRoute";
import { ApiKeysScreen } from "./ApiKeysScreen";
import { SettingsScreen } from "./SettingsScreen";
import { useShallow } from "zustand/react/shallow";
import { AccountsScreen } from "./AccountsScreen";

const RedirectToMainPage: React.FC = () => {
  return <Navigate to={`/realms/usage`} />;
};

const RedirectToLoginPage: React.FC = () => {
  return <Navigate to={`/auth/login`} />;
};

const sessionSelector = (state: SessionState) => ({
  verifyToken: state.verifyToken,
  verifyingToken: state.verifyingToken,
});

export const Navigation: React.FC = () => {
  const { verifyToken, verifyingToken } = useAuthStore(
    useShallow(sessionSelector)
  );

  useEffect(() => {
    verifyToken();
  }, []);

  if (verifyingToken) {
    return <Loading />;
  }

  return (
    <div>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<RedirectToLoginPage />} />
            <Route path="/auth/login" element={<LoginScreen />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/realms" element={<MainLayout />}>
            <Route index element={<RedirectToMainPage />} />
            <Route path="usage" element={<CostUsageScreen />} />
            <Route path="usage/activity" element={<ActivityUsageScreen />} />
            <Route path="accounts" element={<AccountsScreen />} />
            <Route path="api-keys" element={<ApiKeysScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
          </Route>
        </Route>
        {/* <Route path="*" element={<Navigate to="/realms" />} /> */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </div>
  );
};
