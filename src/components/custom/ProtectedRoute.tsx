import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User } from "@/types";
import { useAuthStore } from "@/stores/SessionStore";

interface Props {
  user: User | null;
}

const ProtectedRoute: React.FC<Props> = (user) => {
  // const { user: authUser } = useAuthStore();
  console.log("protected route", user);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
