import ProgressBar from "../../../components/learning/ProgressBar";

export default function LessonProgress({ lesson, progress = 0 }) {
  return <div className="rounded-xl border border-border bg-surface p-4  "><p className="mb-3 text-sm font-medium text-foreground ">{lesson?.title || lesson?.name || "Lesson progress"}</p><ProgressBar value={progress} /></div>;
}
