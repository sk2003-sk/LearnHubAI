import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">
          Welcome back
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Sign in to LearnHub
        </h2>
        <p className="text-foreground-secondary">
          Enter your account details to continue learning.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}

export default Login;
