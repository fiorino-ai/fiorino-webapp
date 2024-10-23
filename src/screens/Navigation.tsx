import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { CostUsageScreen } from "./CostUsageScreen";
import { ActivityUsageScreen } from "./ActivityUsageScreen";
import { AuthLayout } from "@/components/custom/AuthLayout";
import { LoginScreen } from "./LoginScreen";

const RedirectToMainPage: React.FC = () => {
  return <Navigate to={`/usage`} />;
};

const RedirectToLoginPage: React.FC = () => {
  return <Navigate to={`/auth/login`} />;
};

export const Navigation: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth" element={<RedirectToLoginPage />} />
          <Route path="/auth/login" element={<LoginScreen />} />
        </Route>
        <Route path="/realms" element={<MainLayout />}>
          <Route path="/realms" element={<RedirectToMainPage />} />
          <Route path="/realms/usage" element={<CostUsageScreen />} />
          <Route
            path="/realms/usage/activity"
            element={<ActivityUsageScreen />}
          />
        </Route>
      </Routes>
    </div>
  );
};
