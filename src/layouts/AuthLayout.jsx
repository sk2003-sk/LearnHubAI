import { Link, Outlet } from "react-router-dom";
import { GraduationCap, Sparkles } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-brand-strong p-12 text-brand-strong-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <GraduationCap size={27} />
          </div>
          <span className="text-xl font-bold">LearnHub</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles size={25} className="text-accent" />
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Learn today.
            <br />
            Build tomorrow.
            <br />
            Grow forever.
          </h1>
          <p className="mt-6 text-base leading-7 text-white/70">
            Discover new skills, learn from expert instructors, and build your
            future with LearnHub.
          </p>
        </div>

        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </p>

        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full border border-white/10" />
      </section>

      <section className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-5 lg:justify-end lg:p-8">
          <Link to="/" className="font-bold text-brand lg:hidden">
            LearnHub
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-12">
          <div className="w-full max-w-md animate-fade-in">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
