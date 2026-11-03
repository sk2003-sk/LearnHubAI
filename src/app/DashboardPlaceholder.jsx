import { useAuth } from "../features/auth/hooks/useAuth";
import { ROLE_LABELS } from "../constants/roles";
import Button from "../components/ui/Button";

function DashboardPlaceholder({ title }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.assign("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="surface-card w-full max-w-lg space-y-5 p-8 text-center">
        <h1 className="text-3xl font-bold text-brand">LearnHub</h1>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-foreground-secondary">
            Welcome, {user?.name || user?.email}.
          </p>
          <p className="text-sm text-foreground-secondary">
            Account type: {ROLE_LABELS[user?.role] || user?.role}
          </p>
        </div>

        <p className="text-sm text-foreground-secondary">
          Your dashboard modules will be implemented in the upcoming feature
          batches.
        </p>

        <Button variant="outline" onClick={handleLogout} className="w-full">
          Sign out
        </Button>
      </div>
    </main>
  );
}

export default DashboardPlaceholder;
