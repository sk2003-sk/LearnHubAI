import { Outlet } from "react-router-dom";
import MarketplaceNavbar from "../components/navigation/MarketplaceNavbar";

export default function PublicLayout() {
  return <div className="min-h-screen bg-background "><MarketplaceNavbar /><Outlet /><footer className="border-t border-border px-4 py-6 text-center text-xs text-foreground-secondary  ">LearnHub · Learn. Build. Grow.</footer></div>;
}
