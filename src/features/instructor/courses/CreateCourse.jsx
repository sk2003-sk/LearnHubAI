import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import InstructorCourseForm from "../component/InstructorCourseForm";
import { useCreateInstructorCourse } from "../hook/useInstructior";

function CreateCourse() {
  const navigate = useNavigate();
  const createMutation = useCreateInstructorCourse();

  const handleCreate = async (courseData) => {
    try {
      await createMutation.mutateAsync(courseData);
      toast.success("Course draft created successfully.");
      navigate("/instructor/courses");
    } catch (error) {
      toast.error(error?.message || "Unable to create course.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Course"
        description="Add the basic information and learning details for your new course."
      />

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7  ">
        <InstructorCourseForm
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
          submitLabel="Create course draft"
        />
      </div>
    </div>
  );
}

export default CreateCourse;
