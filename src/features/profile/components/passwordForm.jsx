import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateUserPassword } from "../api/profile.api";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must contain at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function PasswordForm() {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateUserPassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully");
      reset();
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        onClick={() => setIsEditing(true)}
        variant="outline"
      >
        Change Password
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Current password"
        type="password"
        placeholder="Enter your current password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />

      <Input
        label="New password"
        type="password"
        placeholder="Enter your new password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Input
        label="Confirm new password"
        type="password"
        placeholder="Confirm your new password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default PasswordForm;
