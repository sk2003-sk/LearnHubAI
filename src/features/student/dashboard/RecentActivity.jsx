import ActivityTimeline from "../../../components/dashboard/ActivityTimeline";

export default function RecentActivity({ activities = [] }) {
  return <section className="rounded-2xl border border-border bg-surface p-5  "><h2 className="mb-4 font-semibold text-foreground ">Recent activity</h2><ActivityTimeline items={activities} emptyMessage="Your recent learning activity will appear here." /></section>;
}
