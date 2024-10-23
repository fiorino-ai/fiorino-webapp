import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Outlet />
    </div>
  );
};
