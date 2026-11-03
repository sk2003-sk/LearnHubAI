import { CalendarDays, ShieldCheck, Lock, User } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROLE_LABELS } from "../../../constants/roles";
import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/passwordForm";
import ProfileAvatar from "../components/ProfileAvatar";
import AccountSecurity from "../components/AccountSecurity";

function Profile() {
  const { user } = useAuth();

  const details = [
    { label: "Account role", value: ROLE_LABELS[user?.role] || user?.role || "—", icon: ShieldCheck },
    { label: "Member since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—", icon: CalendarDays },
  ];

  return (
    <div className="space-y-7">
      <PageHeader title="My Profile" description="View and manage your LearnHub account information." />
      
      <section className="rounded-2xl border border-border bg-surface p-6  ">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ProfileAvatar />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-foreground ">{user?.name || "LearnHub member"}</h2>
            <p className="mt-1 text-sm text-foreground-secondary ">{user?.email}</p>
            <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user?.isVerified ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}>
              {user?.isVerified ? "Verified account" : "Account not verified"}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6  ">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-semibold text-foreground ">Personal Information</h3>
        </div>
        <ProfileForm />
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6  ">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-semibold text-foreground ">Security</h3>
        </div>
        <PasswordForm />
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6  ">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-secondary" />
          <h3 className="text-lg font-semibold text-foreground ">Two-factor authentication</h3>
        </div>
        <AccountSecurity />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {details.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-5  ">
            <div className="flex items-center gap-2 text-sm text-foreground-secondary "><Icon size={17} /><span>{label}</span></div>
            <p className="mt-3 break-words font-semibold text-foreground ">{value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Profile;
