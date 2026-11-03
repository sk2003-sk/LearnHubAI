import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ title = "Something went wrong", message = "We could not load this information.", onRetry, className = "" }) {
  return <div role="alert" className={`rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30 ${className}`}><div className="flex items-start gap-3"><AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" /><div className="min-w-0"><h2 className="font-semibold text-red-800 dark:text-red-200">{title}</h2><p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-700 underline dark:text-red-300"><RefreshCw size={14} /> Try again</button>}</div></div></div>;
}
