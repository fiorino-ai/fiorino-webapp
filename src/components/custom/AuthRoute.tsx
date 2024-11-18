import { Navigate, Outlet } from "react-router-dom";
import { SessionState, useAuthStore } from "@/stores/SessionStore";
import Loading from "@/components/custom/Loading";
import { useShallow } from "zustand/react/shallow";

const sessionSelector = (state: SessionState) => ({
  user: state.user,
  verifyingToken: state.verifyingToken,
});

const AuthRoute: React.FC = () => {
  const { user, verifyingToken } = useAuthStore(useShallow(sessionSelector));

  if (verifyingToken) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/realms" />;
  }

  return <Outlet />;
};

export default AuthRoute;
