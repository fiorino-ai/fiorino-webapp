import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/SessionStore";
import Loading from "@/components/custom/Loading";

const AuthRoute: React.FC = () => {
  const { user, verifyingToken } = useAuthStore();

  if (verifyingToken) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/realms" />;
  }

  return <Outlet />;
};

export default AuthRoute;
