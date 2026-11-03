import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CourseAnalyticsChart({ data = [], dataKey = "count", xKey = "month", title = "Course analytics", color = "#6D9181" }) {
  return <section className="rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">{title}</h2>{data.length ? <div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#DCE3DA" /><XAxis dataKey={xKey} tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey={dataKey} fill={color} radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="py-16 text-center text-sm text-foreground-secondary">No chart data available.</p>}</section>;
}
