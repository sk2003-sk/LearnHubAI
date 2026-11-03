import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function RevenueChart({ data = [], title = "Revenue by course", dataKey = "revenue" }) {
  return <section className="rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">{title}</h2>{data.length ? <div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#DCE3DA" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey={dataKey} fill="#B69D70" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="py-16 text-center text-sm text-foreground-secondary">No revenue data available.</p>}</section>;
}
