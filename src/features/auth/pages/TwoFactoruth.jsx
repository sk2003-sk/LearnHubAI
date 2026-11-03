import PageHeader from "../../../components/common/PageHeader";
import AccountSecurity from "../../profile/components/AccountSecurity";

export default function TwoFactorAuth() {
  return <div className="space-y-6"><PageHeader title="Two-factor authentication" description="Secure your LearnHub account with an authenticator app." /><section className="rounded-2xl border border-border bg-surface p-6  "><AccountSecurity /></section></div>;
}
