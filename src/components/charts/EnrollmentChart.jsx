import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function EnrollmentChart({ data = [], title = "Enrollment trends" }) {
  return <section className="rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">{title}</h2>{data.length ? <div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#DCE3DA" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="count" stroke="#6D9181" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div> : <p className="py-16 text-center text-sm text-foreground-secondary">No enrollment data available.</p>}</section>;
}
