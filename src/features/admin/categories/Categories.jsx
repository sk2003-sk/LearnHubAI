import { useMemo, useState } from "react";
import { Edit2, FolderOpen, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../api/admin.api";
import { createCategory } from "../../marketplace/api/marketplace.api";
import { getAdminCategoriesFromResponse, getEntityId } from "../utils/adminData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const initialForm = { name: "", description: "" };

function Categories() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAllCategories,
  });

  const categories = useMemo(
    () => getAdminCategoriesFromResponse(categoriesQuery.data),
    [categoriesQuery.data],
  );

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingId
        ? updateCategory({ categoryId: editingId, categoryData: payload })
        : createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success(editingId ? "Category updated" : "Category created");
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (error) => toast.error(error.message || "Unable to save category"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category deleted");
    },
    onError: (error) => toast.error(error.message || "Unable to delete category"),
  });

  const startEdit = (category) => {
    setEditingId(getEntityId(category));
    setForm({ name: category.name ?? category.title ?? "", description: category.description ?? "" });
    setShowForm(true);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    saveMutation.mutate({ name: form.name.trim(), description: form.description.trim() });
  };

  if (categoriesQuery.isLoading) return <PageLoader />;

  const inputClass = "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background ";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Categories"
        description="Create and maintain the categories used to organize courses."
        actions={<Button onClick={() => { setEditingId(null); setForm(initialForm); setShowForm((value) => !value); }}><Plus size={16} /> Add category</Button>}
      />

      {categoriesQuery.isError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <span>{categoriesQuery.error?.message || "Unable to load categories."}</span>
          <Button size="sm" variant="outline" onClick={() => categoriesQuery.refetch()}><RefreshCw size={15} /> Retry</Button>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface p-5  ">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground ">{editingId ? "Edit category" : "Create category"}</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm); }} className="rounded-lg p-2 text-foreground-secondary hover:bg-surface-secondary " aria-label="Close form"><X size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-foreground-secondary ">Category name<input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={80} placeholder="Web Development" /></label>
            <label className="space-y-2 text-sm font-medium text-foreground-secondary ">Description<textarea className={inputClass} rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe this category" /></label>
          </div>
          <div className="flex gap-3"><Button type="submit" loading={saveMutation.isPending}>{editingId ? "Save changes" : "Create category"}</Button><Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm); }}>Cancel</Button></div>
        </form>
      )}

      {!categoriesQuery.isError && categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center  "><FolderOpen size={38} className="mx-auto text-brand-secondary" /><h2 className="mt-3 font-semibold text-foreground ">No categories yet</h2><p className="mt-1 text-sm text-foreground-secondary">Create a category to organize the course catalogue.</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => {
            const id = getEntityId(category);
            return <article key={id || index} className="rounded-2xl border border-border bg-surface p-5  ">
              <div className="flex items-start justify-between gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent"><FolderOpen size={21} /></div><div className="flex gap-2"><button type="button" onClick={() => startEdit(category)} className="rounded-lg p-2 text-brand-secondary hover:bg-surface-secondary " aria-label="Edit category"><Edit2 size={17} /></button><button type="button" onClick={() => { if (window.confirm(`Delete ${category.name ?? category.title ?? "this category"}?`)) deleteMutation.mutate(id); }} disabled={!id || deleteMutation.isPending} className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30" aria-label="Delete category"><Trash2 size={17} /></button></div></div>
              <h3 className="mt-4 font-semibold text-foreground ">{category.name ?? category.title ?? "Unnamed category"}</h3>
              <p className="mt-2 min-h-10 text-sm text-foreground-secondary ">{category.description || "No description provided."}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-foreground-secondary  "><span>{category.courseCount ?? category.coursesCount ?? 0} courses</span><span>{category.isActive === false ? "Inactive" : "Active"}</span></div>
            </article>;
          })}
        </div>
      )}
    </div>
  );
}

export default Categories;
