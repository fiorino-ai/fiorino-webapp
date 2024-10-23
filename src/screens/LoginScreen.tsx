import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/custom/LoginForm";
import { useAuthStore } from "@/stores/SessionStore";

export const LoginScreen: React.FC = () => {
  const { login, loginLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
    const { user } = useAuthStore.getState();
    if (user) {
      navigate("/realms");
    }
  };

  return (
    <LoginForm
      isSubmitting={loginLoading}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};
