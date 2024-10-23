import { LoginForm } from "@/components/custom/LoginForm";
import { useAuthStore } from "@/stores/SessionStore";

export const LoginScreen: React.FC = () => {
  const { login, loginLoading, error } = useAuthStore();

  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <LoginForm
      isSubmitting={loginLoading}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};
