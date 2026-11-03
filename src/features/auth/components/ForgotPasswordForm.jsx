import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/auth.schema";
import { forgotPassword } from "../api/auth.api";
import { toast } from "sonner";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Password reset email sent successfully");
    } catch (error) {
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Check your email
            </h3>
            <p className="text-foreground-secondary">
              We've sent a password reset link to{" "}
              <span className="font-medium">{submittedEmail}</span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-foreground-secondary mb-4">
            Didn't receive the email? Check your spam folder or
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-sm font-medium text-brand-secondary hover:text-brand"
          >
            Try again
          </button>
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Reset your password
        </h3>
        <p className="text-sm text-foreground-secondary">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
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

export default ForgotPasswordForm;
