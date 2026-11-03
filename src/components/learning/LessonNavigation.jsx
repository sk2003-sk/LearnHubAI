import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

export default function LessonNavigation({ index = 0, total = 0, onPrevious, onNext }) {
  return <div className="flex items-center justify-between gap-3"><Button variant="outline" onClick={onPrevious} disabled={index <= 0}><ChevronLeft size={16} /> Previous</Button><span className="text-xs text-foreground-secondary">Lesson {total ? index + 1 : 0} of {total}</span><Button onClick={onNext} disabled={index >= total - 1 || total === 0}>Next <ChevronRight size={16} /></Button></div>;
}
