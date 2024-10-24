import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/SessionStore";
import Loading from "./Loading";

const ProtectedRoute: React.FC = () => {
  const { user, verifyingToken } = useAuthStore();

  if (verifyingToken) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
