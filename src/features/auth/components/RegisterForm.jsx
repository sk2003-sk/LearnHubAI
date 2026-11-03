import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    setServerError("");

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await registerAccount(userData);

      const activationToken = response?.activationToken ?? response?.data?.activationToken;
      if (!activationToken) {
        throw new Error("Registration response did not contain an activation token.");
      }

      const activationCode = response?.activationCode ?? response?.data?.activationCode ?? "";

      sessionStorage.setItem("learnhub-activation-token", activationToken);
      sessionStorage.setItem("learnhub-activation-code", activationCode);
      sessionStorage.setItem(
        "learnhub-pending-login",
        JSON.stringify({ email: userData.email, password: userData.password }),
      );

      navigate("/activate", {
        state: { email: userData.email },
      });
    } catch (error) {
      setServerError(
        error.message || "Unable to create your account. Please try again.",
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

      <Input
        label="Full name"
        type="text"
        placeholder="Enter your full name"
        autoComplete="name"
        error={errors.name?.message}
        {...registerField("name")}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="Enter your email address"
        autoComplete="email"
        error={errors.email?.message}
        {...registerField("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...registerField("password")}
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...registerField("confirmPassword")}
      />

      <Button
        type="submit"
        block
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-foreground-secondary">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
