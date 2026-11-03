import { useState } from "react";
import { Image as ImageIcon, Layout, MessageSquare, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLayout, useCreateLayout, useUpdateLayout } from "../hook/useLayout";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";

const getLayoutData = (response) => response?.layout ?? response?.data?.layout ?? response?.data ?? response ?? {};

function HomepageSettingsEditor({ bannerResponse, faqResponse, categoryResponse }) {
  const bannerData = getLayoutData(bannerResponse);
  const faqData = getLayoutData(faqResponse);
  const categoryData = getLayoutData(categoryResponse);
  const createMutation = useCreateLayout();
  const updateMutation = useUpdateLayout();
  const [banner, setBanner] = useState(() => ({ title: bannerData.title ?? "", subTitle: bannerData.subTitle ?? bannerData.subtitle ?? "", image: bannerData.image ?? "" }));
  const [faqs, setFaqs] = useState(() => Array.isArray(faqData.faq) ? faqData.faq : Array.isArray(faqData.faqs) ? faqData.faqs : []);
  const [categories, setCategories] = useState(() => Array.isArray(categoryData.categories) ? categoryData.categories : []);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [newCategory, setNewCategory] = useState("");

  const exists = {
    banner: Boolean(bannerData._id || bannerData.title || bannerData.image || bannerData.subTitle),
    faq: Boolean(faqData._id || Array.isArray(faqData.faq) || Array.isArray(faqData.faqs)),
    categories: Boolean(categoryData._id || Array.isArray(categoryData.categories)),
  };

  const saveSection = async (type, data) => {
    const payload = { type, ...data };
    try {
      if (exists[type]) await updateMutation.mutateAsync(payload);
      else await createMutation.mutateAsync(payload);
      toast.success(`${type[0].toUpperCase()}${type.slice(1)} settings saved`);
    } catch (error) {
      toast.error(error.message || `Unable to save ${type} settings`);
    }
  };

  const inputClass = "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background ";
  const panelClass = "space-y-4 rounded-2xl border border-border bg-surface p-5  ";

  return (
    <div className="space-y-6">
      <PageHeader title="Homepage Settings" description="Manage the homepage banner, frequently asked questions and category highlights." />
      <section className={panelClass}>
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent"><Layout size={20} /></span><div><h2 className="font-semibold text-foreground ">Hero banner</h2><p className="text-xs text-foreground-secondary">Layout type: banner</p></div></div>
        <div className="grid gap-4 md:grid-cols-2"><label className="space-y-2 text-sm text-foreground-secondary ">Title<input className={inputClass} value={banner.title} onChange={(e) => setBanner({ ...banner, title: e.target.value })} /></label><label className="space-y-2 text-sm text-foreground-secondary ">Subtitle<input className={inputClass} value={banner.subTitle} onChange={(e) => setBanner({ ...banner, subTitle: e.target.value })} /></label><label className="space-y-2 text-sm text-foreground-secondary  md:col-span-2">Image URL or base64 image data<div className="relative"><ImageIcon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary" /><input className={`${inputClass} pl-11`} value={banner.image} onChange={(e) => setBanner({ ...banner, image: e.target.value })} /></div></label></div>
        {banner.image && <img src={banner.image} alt="Homepage banner preview" className="max-h-48 w-full rounded-xl object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
        <div className="flex flex-wrap gap-3"><Button onClick={() => saveSection("banner", banner)} loading={createMutation.isPending || updateMutation.isPending}><Save size={16} /> Save banner</Button></div>
      </section>
      <section className={panelClass}>
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent"><MessageSquare size={20} /></span><div><h2 className="font-semibold text-foreground ">Frequently asked questions</h2><p className="text-xs text-foreground-secondary">Layout type: faq</p></div></div>
        <div className="space-y-3">{faqs.map((faq, index) => <div key={`${faq.question}-${index}`} className="grid gap-3 rounded-xl bg-background p-4  md:grid-cols-[1fr_1fr_auto]"><input className={inputClass} value={faq.question ?? ""} onChange={(e) => setFaqs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, question: e.target.value } : item))} placeholder="Question" /><textarea className={inputClass} rows={2} value={faq.answer ?? ""} onChange={(e) => setFaqs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, answer: e.target.value } : item))} placeholder="Answer" /><button type="button" onClick={() => setFaqs((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label="Remove FAQ"><Trash2 size={17} /></button></div>)}</div>
        <div className="grid gap-3 md:grid-cols-2"><input className={inputClass} value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} placeholder="New question" /><textarea className={inputClass} rows={2} value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} placeholder="New answer" /></div>
        <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => { if (!newFaq.question.trim() || !newFaq.answer.trim()) return; setFaqs((current) => [...current, { question: newFaq.question.trim(), answer: newFaq.answer.trim() }]); setNewFaq({ question: "", answer: "" }); }}><Plus size={16} /> Add FAQ</Button><Button onClick={() => saveSection("faq", { faq: faqs })} loading={createMutation.isPending || updateMutation.isPending}><Save size={16} /> Save FAQs</Button></div>
      </section>
      <section className={panelClass}>
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent"><Layout size={20} /></span><div><h2 className="font-semibold text-foreground ">Homepage categories</h2><p className="text-xs text-foreground-secondary">Layout type: categories</p></div></div>
        <div className="flex flex-wrap gap-2">{categories.map((category, index) => <span key={`${category.title}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-surface-secondary px-3 py-2 text-sm text-foreground  ">{category.title}<button type="button" onClick={() => setCategories((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-red-500" aria-label="Remove category"><Trash2 size={13} /></button></span>)}</div>
        <div className="flex flex-col gap-3 sm:flex-row"><input className={inputClass} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category title" /><Button variant="outline" onClick={() => { if (!newCategory.trim()) return; setCategories((current) => [...current, { title: newCategory.trim() }]); setNewCategory(""); }}><Plus size={16} /> Add</Button></div>
        <Button onClick={() => saveSection("categories", { categories })} loading={createMutation.isPending || updateMutation.isPending}><Save size={16} /> Save categories</Button>
      </section>
    </div>
  );
}

function HomepageSettings() {
  const bannerQuery = useLayout("banner");
  const faqQuery = useLayout("faq");
  const categoriesQuery = useLayout("categories");

  if (bannerQuery.isLoading || faqQuery.isLoading || categoriesQuery.isLoading) return <PageLoader />;

  return <HomepageSettingsEditor key={`${Boolean(bannerQuery.data)}-${Boolean(faqQuery.data)}-${Boolean(categoriesQuery.data)}`} bannerResponse={bannerQuery.data} faqResponse={faqQuery.data} categoryResponse={categoriesQuery.data} />;
}

export default HomepageSettings;
