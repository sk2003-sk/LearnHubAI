import SearchBar from "../../../components/common/SearchBar";

export default function CourseSearch({ value, onChange, placeholder }) {
  return <SearchBar value={value} onChange={onChange} placeholder={placeholder || "Search courses"} />;
}
