import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import AppNavbar from "../components/navigation/AppNavbar";
import DashboardSidebar from "../components/navigation/DashboardSidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <AppNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 overflow-hidden">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:block lg:w-72">
          <DashboardSidebar />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-[#0B1512]/50 backdrop-blur-sm"
            />
            <div className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-surface shadow-2xl">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-4 z-10 rounded-lg p-2 text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground"
              >
                <X size={18} />
              </button>
              <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain scroll-smooth">
          <div className="mx-auto w-full max-w-[1240px] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
