import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SessionState, useAuthStore } from "@/stores/SessionStore";
import Loading from "./Loading";
import { useShallow } from "zustand/react/shallow";
import SETTINGS from "@/config/config";

const sessionSelector = (state: SessionState) => ({
  user: state.user,
  verifyingToken: state.verifyingToken,
});

const ProtectedRoute: React.FC = () => {
  const { user, verifyingToken } = useAuthStore(useShallow(sessionSelector));

  if (verifyingToken) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={`${SETTINGS.BASE_URL}auth/login`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
