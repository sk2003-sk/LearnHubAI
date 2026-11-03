import ForgotPasswordForm from "../components/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">
          Password Recovery
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Forgot your password?
        </h2>
        <p className="text-foreground-secondary">
          No worries, we'll help you reset it.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPassword;
