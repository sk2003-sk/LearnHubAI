import { useState } from "react";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import { useCreateInstructorLecture } from "../hook/useInstructior";

const initialValues = {
  title: "",
  description: "",
  videoUrl: "",
  videoSection: "",
  videoLength: "",
  isPreview: false,
};

function CreateLecture({ courseId, sections = [] }) {
  const [form, setForm] = useState(initialValues);
  const createLecture = useCreateInstructorLecture();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!courseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      await createLecture.mutateAsync({
        courseId,
        lectureData: {
          title: form.title.trim(),
          description: form.description.trim(),
          videoUrl: form.videoUrl.trim(),
          videoSection: form.videoSection.trim(),
          videoLength: Number(form.videoLength),
          isPreview: form.isPreview,
        },
      });

      toast.success("Lecture created successfully");
      setForm(initialValues);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create lecture");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-ring/20   ";

  const labelClass =
    "mb-2 block text-sm font-medium text-foreground ";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Lecture title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Enter lecture title"
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className={inputClass}
          placeholder="Describe this lecture"
        />
      </div>

      <div>
        <label className={labelClass}>Video URL</label>
        <input
          name="videoUrl"
          type="url"
          value={form.videoUrl}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className={labelClass}>Section</label>
        <input
          name="videoSection"
          value={form.videoSection}
          onChange={handleChange}
          required
          list="instructor-course-sections"
          className={inputClass}
          placeholder="Enter or select a section"
        />

        <datalist id="instructor-course-sections">
          {sections.map((section, index) => (
            <option
              key={section._id || section.id || index}
              value={
                section.title || section.name || section.videoSection || ""
              }
            />
          ))}
        </datalist>
      </div>

      <div>
        <label className={labelClass}>Video length</label>
        <input
          name="videoLength"
          type="number"
          min="0"
          step="any"
          value={form.videoLength}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Enter video length"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-foreground ">
        <input
          type="checkbox"
          name="isPreview"
          checked={form.isPreview}
          onChange={handleChange}
          className="h-4 w-4 accent-brand-secondary"
        />
        Allow students to preview this lecture
      </label>

      <Button
        type="submit"
        loading={createLecture.isPending}
        disabled={createLecture.isPending}
        className="w-full sm:w-auto"
      >
        Create Lecture
      </Button>
    </form>
  );
}

export default CreateLecture;
