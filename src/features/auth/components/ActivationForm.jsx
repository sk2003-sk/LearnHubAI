import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activationSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { ROUTES } from "../../../constants/routes";

function ActivationForm() {
  const navigate = useNavigate();
  const { activate, login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [activationCode] = useState(
    () => sessionStorage.getItem("learnhub-activation-code") || "",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(activationSchema.omit({ activation_token: true })),
    defaultValues: {
      activation_code: activationCode,
    },
  });

  const onSubmit = async (formData) => {
    setServerError("");

    const activationToken = sessionStorage.getItem("learnhub-activation-token");

    if (!activationToken) {
      setServerError("Activation session not found. Please register again.");
      return;
    }

    try {
      await activate({
        activation_token: activationToken,
        activation_code: formData.activation_code,
      });

      const pendingRaw = sessionStorage.getItem("learnhub-pending-login");
      sessionStorage.removeItem("learnhub-activation-token");
      sessionStorage.removeItem("learnhub-activation-code");
      sessionStorage.removeItem("learnhub-pending-login");

      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending?.email && pending?.password) {
            await login({ email: pending.email, password: pending.password });
            navigate(ROUTES.DASHBOARD, { replace: true });
            return;
          }
        } catch {
          // fall through to manual sign-in
        }
      }

      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setServerError(
        error.message || "Account activation failed. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {serverError}
        </div>
      )}

      {activationCode && (
        <div className="rounded-xl border border-brand-secondary/40 bg-brand-secondary/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-secondary">
            Your activation code
          </p>
          <p className="mt-1 text-2xl font-bold tracking-[0.3em] text-brand">
            {activationCode}
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Email delivery is unavailable in this demo, so the code is shown
            here and filled in below.
          </p>
        </div>
      )}

      <Input
        label="Activation code"
        type="text"
        placeholder="Enter your activation code"
        autoComplete="one-time-code"
        inputMode="numeric"
        error={errors.activation_code?.message}
        {...register("activation_code")}
      />

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Activating..." : "Activate account"}
      </Button>
    </form>
  );
}

export default ActivationForm;
