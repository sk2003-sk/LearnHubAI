import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schemas/auth.schema";
import { resetPassword } from "../api/auth.api";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: data.password,
      });
      setIsSuccess(true);
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Invalid reset link
            </h3>
            <p className="text-foreground-secondary">
              The password reset link is invalid or has expired.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Password reset successful
            </h3>
            <p className="text-foreground-secondary">
              Your password has been reset successfully. You can now sign in with
              your new password.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/login")}
          className="w-full"
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Set new password
        </h3>
        <p className="text-sm text-foreground-secondary">
          Please enter your new password below.
        </p>
      </div>

      <Input
        label="New password"
        type="password"
        placeholder="Enter your new password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm new password"
        type="password"
        placeholder="Confirm your new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
