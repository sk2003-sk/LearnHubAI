import { Send } from "lucide-react";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import { useSubmitInstructorCourse } from "../hook/useInstructior";

export default function CourseSubmission({ courseId, onSubmitted }) {
  const mutation = useSubmitInstructorCourse();
  const submit = async () => {
    if (!courseId) return;
    try {
      await mutation.mutateAsync(courseId);
      toast.success("Course submitted for review");
      onSubmitted?.();
    } catch (error) {
      toast.error(error.message || "Unable to submit course");
    }
  };
  return <Button onClick={submit} loading={mutation.isPending} disabled={!courseId || mutation.isPending}><Send size={15} /> Submit for review</Button>;
}
