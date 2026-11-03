import ResetPasswordForm from "../components/ResetPasswordForm";

function ResetPassword() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">
          Password Recovery
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Reset your password
        </h2>
        <p className="text-foreground-secondary">
          Create a new secure password for your account.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}

export default ResetPassword;
