import { useState } from "react";
import Button from "../../../components/ui/Button";

const initialValues = {
  name: "",
  description: "",
  price: "",
  estimatedPrice: "",
  tags: "",
  level: "Beginner",
  demoUrl: "",
  thumbnail: "",
  benefits: "",
  prerequisites: "",
};

function InstructorCourseForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}) {
  const [form, setForm] = useState(() => ({
    ...initialValues,
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ?? "",
    estimatedPrice: initialData?.estimatedPrice ?? "",
    tags: initialData?.tags || "",
    level: initialData?.level || "Beginner",
    demoUrl: initialData?.demoUrl || "",
    thumbnail:
      typeof initialData?.thumbnail === "string"
        ? initialData.thumbnail
        : initialData?.thumbnail?.url || "",
    benefits: (initialData?.benefits || [])
      .map((item) => item.title)
      .join("\n"),
    prerequisites: (initialData?.prerequisites || [])
      .map((item) => item.title)
      .join("\n"),
  }));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const courseData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      estimatedPrice: Number(form.estimatedPrice),
      tags: form.tags.trim(),
      level: form.level,
      demoUrl: form.demoUrl.trim(),
      benefits: form.benefits
        .split("\n")
        .map((title) => title.trim())
        .filter(Boolean)
        .map((title) => ({ title })),
      prerequisites: form.prerequisites
        .split("\n")
        .map((title) => title.trim())
        .filter(Boolean)
        .map((title) => ({ title })),
    };

    if (form.thumbnail.trim()) {
      courseData.thumbnail = {
        url: form.thumbnail.trim(),
      };
    }

    onSubmit(courseData);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-ring/20   ";

  const labelClass =
    "mb-2 block text-sm font-medium text-foreground ";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Course name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={150}
          className={inputClass}
          placeholder="Enter course name"
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={5}
          className={inputClass}
          placeholder="Describe what students will learn"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Price</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Original price</label>
          <input
            name="estimatedPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.estimatedPrice}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="React, JavaScript, Web Development"
          />
        </div>

        <div>
          <label className={labelClass}>Difficulty level</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Demo video URL</label>
        <input
          name="demoUrl"
          type="url"
          value={form.demoUrl}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className={labelClass}>Course thumbnail URL</label>
        <input
          name="thumbnail"
          type="url"
          value={form.thumbnail}
          onChange={handleChange}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className={labelClass}>Course benefits (one per line)</label>
        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          rows={4}
          required
          className={inputClass}
          placeholder={"Build real-world projects\nLearn practical skills"}
        />
      </div>

      <div>
        <label className={labelClass}>Prerequisites (one per line)</label>
        <textarea
          name="prerequisites"
          value={form.prerequisites}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          placeholder={"Basic computer knowledge\nBasic programming knowledge"}
        />
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {submitLabel}
      </Button>
    </form>
  );
}

export default InstructorCourseForm;
