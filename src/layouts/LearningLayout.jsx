import { Outlet } from "react-router-dom";

export default function LearningLayout() {
  return <main className="min-h-screen bg-background px-4 py-6  sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><Outlet /></div></main>;
}
