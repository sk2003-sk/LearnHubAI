import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { setup2FA, verify2FA, disable2FA } from "../api/profile.api";
import { useAuth } from "../../auth/hooks/useAuth";

function AccountSecurity() {
  const { user, refetchUser } = useAuth();
  const [setupData, setSetupData] = useState(null);
  const [token, setToken] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const enabled = Boolean(user?.twoFactorEnabled ?? user?.twoFactor?.enabled ?? user?.isTwoFactorEnabled);

  const startSetup = async () => {
    setIsWorking(true);
    try {
      const response = await setup2FA();
      setSetupData(response?.data ?? response);
      toast.success("Two-factor setup started");
    } catch (error) {
      toast.error(error.message || "Unable to start two-factor setup");
    } finally {
      setIsWorking(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setIsWorking(true);
    try {
      await verify2FA(token.trim());
      setSetupData(null);
      setToken("");
      await refetchUser();
      toast.success("Two-factor authentication enabled");
    } catch (error) {
      toast.error(error.message || "Unable to verify the code");
    } finally {
      setIsWorking(false);
    }
  };

  const disable = async (event) => {
    event.preventDefault();
    setIsWorking(true);
    try {
      await disable2FA(token.trim());
      setToken("");
      await refetchUser();
      toast.success("Two-factor authentication disabled");
    } catch (error) {
      toast.error(error.message || "Unable to disable two-factor authentication");
    } finally {
      setIsWorking(false);
    }
  };

  const qrCode = setupData?.qrCode ?? setupData?.qrCodeUrl ?? setupData?.qr;
  const secret = setupData?.secret ?? setupData?.otpSecret;
  const otpauthUrl = setupData?.otpauthUrl ?? setupData?.otpauth_url;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent">{enabled ? <ShieldCheck size={20} /> : <ShieldOff size={20} />}</span><div><p className="font-semibold text-foreground ">Two-factor authentication</p><p className="text-sm text-foreground-secondary ">{enabled ? "Additional account verification is enabled." : "Add a second verification step to your account."}</p></div></div>
      {!enabled && !setupData && <Button variant="outline" onClick={startSetup} loading={isWorking}>Set up two-factor authentication</Button>}
      {setupData && !enabled && <form onSubmit={verify} className="space-y-4 rounded-xl bg-background p-4 "><p className="text-sm text-foreground-secondary ">Scan the QR code with your authenticator app, or enter the setup secret if one is supplied.</p>{typeof qrCode === "string" && <img src={qrCode} alt="Two-factor setup QR code" className="mx-auto max-h-48 rounded-lg bg-surface p-2" />}{secret && <p className="break-all rounded-lg bg-surface p-3 font-mono text-xs text-foreground">{secret}</p>}{otpauthUrl && <a href={otpauthUrl} className="break-all text-xs font-medium text-brand-secondary underline">Open authenticator setup link</a>}<Input label="Authenticator code" value={token} onChange={(event) => setToken(event.target.value)} inputMode="numeric" autoComplete="one-time-code" required /><div className="flex gap-2"><Button type="submit" loading={isWorking}>Verify and enable</Button><Button type="button" variant="outline" onClick={() => { setSetupData(null); setToken(""); }}>Cancel</Button></div></form>}
      {enabled && <form onSubmit={disable} className="flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1"><Input label="Authenticator code" value={token} onChange={(event) => setToken(event.target.value)} inputMode="numeric" required /></div><Button type="submit" variant="danger" loading={isWorking}>Disable 2FA</Button></form>}
      {setupData && !qrCode && !secret && !otpauthUrl && <p className="text-xs text-foreground-secondary">The setup response did not include a QR code, secret or authenticator URL. Check the backend response before continuing.</p>}
    </div>
  );
}

export default AccountSecurity;
