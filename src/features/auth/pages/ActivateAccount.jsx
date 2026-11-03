import { Link } from "react-router-dom";
import ActivationForm from "../components/ActivationForm";
import { ROUTES } from "../../../constants/routes";

function ActivateAccount() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">
          One more step
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Activate your account
        </h2>
        <p className="text-foreground-secondary">
          Enter the activation code sent to your email address.
        </p>
      </div>

      <ActivationForm />

      <p className="text-center text-sm text-foreground-secondary">
        Already activated?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-semibold text-brand hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default ActivateAccount;
