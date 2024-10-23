import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { CostUsageScreen } from "./CostUsageScreen";
import { ActivityUsageScreen } from "./ActivityUsageScreen";
import { AuthLayout } from "@/components/custom/AuthLayout";
import { LoginScreen } from "./LoginScreen";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import { useAuthStore } from "@/stores/SessionStore";
import { useEffect } from "react";
import Loading from "@/components/custom/Loading";

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

  console.log(verifyingToken, user);

  if (verifyingToken) {
    return <Loading />;
  }

  // if (!user) {
  //   return (
  //     <Routes>

  //       <Route path="*" element={<Navigate to="/auth/login" />} />
  //     </Routes>
  //   );
  // }

  return (
    <div>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth" element={<RedirectToLoginPage />} />
          <Route path="/auth/login" element={<LoginScreen />} />
        </Route>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/realms" element={<MainLayout />}>
            <Route path="usage" element={<CostUsageScreen />} />
            <Route path="usage/activity" element={<ActivityUsageScreen />} />
          </Route>
        </Route>
        {/* <Route path="*" element={<Navigate to="/realms" />} /> */}
      </Routes>
    </div>
  );
};
