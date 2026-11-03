import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateUserInfo } from "../api/profile.api";
import { useAuth } from "../../auth/hooks/useAuth";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
});

function ProfileForm() {
  const { user, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    reset({ name: user?.name || "", email: user?.email || "" });
  }, [user?.name, user?.email, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUserInfo(data);
      await refetchUser();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground-secondary ">
            Full name
          </label>
          <p className="text-foreground ">{user?.name || "Not provided"}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground-secondary ">
            Email address
          </label>
          <p className="text-foreground ">{user?.email || "Not provided"}</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="mt-4"
        >
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Full name"
        type="text"
        placeholder="Enter your full name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
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

export default ProfileForm;
