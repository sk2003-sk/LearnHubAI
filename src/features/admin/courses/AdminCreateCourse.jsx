import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import InstructorCourseForm from "../../instructor/component/InstructorCourseForm";
import { useCreateAdminCourse } from "../hook/useAdmin";

function AdminCreateCourse() {
  const navigate = useNavigate();
  const mutation = useCreateAdminCourse();

  const handleCreate = async (courseData) => {
    try {
      await mutation.mutateAsync(courseData);
      toast.success("Course created successfully");
      navigate("/admin/courses");
    } catch (error) {
      toast.error(error.message || "Unable to create course");
    }
  };

  return <div className="space-y-6"><PageHeader title="Create Course" description="Add a new course to the platform catalogue." /><div className="rounded-2xl border border-border bg-surface p-5 sm:p-7  "><InstructorCourseForm onSubmit={handleCreate} isSubmitting={mutation.isPending} submitLabel="Create course" /></div></div>;
}

export default AdminCreateCourse;
