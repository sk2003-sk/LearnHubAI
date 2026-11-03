import { LoaderCircle } from "lucide-react";

function PageLoader({ className = "" }) {
  return (
    <div className={`flex min-h-[50vh] w-full items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle size={32} className="animate-spin text-brand" />
        <p className="text-sm text-foreground-secondary">
          Loading LearnHub...
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
