import { BookOpen } from "lucide-react";
import LessonItem from "./LessonItem";

export default function CourseSidebar({ course, lessons = [], activeIndex = 0, onSelect, completedIds = [], lockedIds = [] }) {
  return <aside className="overflow-hidden rounded-2xl border border-border bg-surface  "><div className="border-b border-border p-5 "><div className="flex items-center gap-2"><BookOpen size={18} className="text-brand-secondary" /><h2 className="font-semibold text-foreground ">{course?.name || "Course content"}</h2></div><p className="mt-1 text-xs text-foreground-secondary">{lessons.length} lessons</p></div><div className="max-h-[70vh] space-y-1 overflow-y-auto p-3">{lessons.map((lesson, index) => <LessonItem key={lesson._id ?? lesson.id ?? index} lesson={lesson} index={index} active={index === activeIndex} completed={completedIds.includes(lesson._id ?? lesson.id)} locked={lockedIds.includes(lesson._id ?? lesson.id)} onClick={() => onSelect?.(index)} />)}</div></aside>;
}
