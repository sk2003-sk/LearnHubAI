import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

function AccountRecoveryUnavailable() {
  return (
    <div className="space-y-5 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">Account support</p>
        <h2 className="text-3xl font-bold text-foreground">Password recovery is not connected</h2>
        <p className="text-foreground-secondary">The current backend contract available to this project does not provide a verified password-reset request flow. Sign in with your existing password or contact the platform administrator.</p>
      </div>
      <Link to={ROUTES.LOGIN} className="inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">Return to sign in</Link>
    </div>
  );
}

export default AccountRecoveryUnavailable;
