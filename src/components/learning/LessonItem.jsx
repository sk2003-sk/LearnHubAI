import { CheckCircle2, LockKeyhole, PlayCircle } from "lucide-react";

export default function LessonItem({ lesson, index = 0, active = false, completed = false, locked = false, onClick }) {
  const Icon = completed ? CheckCircle2 : locked ? LockKeyhole : PlayCircle;
  return <button type="button" onClick={onClick} disabled={locked} className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${active ? "bg-surface-secondary " : "hover:bg-background dark:hover:bg-surface-secondary"} disabled:cursor-not-allowed disabled:opacity-60`}><Icon size={18} className={`mt-0.5 shrink-0 ${completed ? "text-brand-secondary" : "text-foreground-secondary"}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-foreground ">{lesson?.title || lesson?.name || `Lesson ${index + 1}`}</span>{lesson?.videoLength != null && <span className="mt-1 block text-xs text-foreground-secondary">{lesson.videoLength} min</span>}</span></button>;
}
