import SearchBar from "../common/SearchBar";

export default function CourseFilters({ search, onSearchChange, level, onLevelChange, levels = ["All"], className = "" }) {
  return <div className={`grid gap-3 md:grid-cols-[1fr_220px] ${className}`}><SearchBar value={search} onChange={onSearchChange} placeholder="Search courses, topics or levels" /><select value={level} onChange={(event) => onLevelChange?.(event.target.value)} className="rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none  dark:bg-background ">{levels.map((item) => <option key={item} value={item}>{item === "All" ? "All levels" : item}</option>)}</select></div>;
}
