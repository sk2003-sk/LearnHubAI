import { PlayCircle } from "lucide-react";

export default function VideoPlayer({ src, title, onTimeUpdate, onPause, onEnded, className = "" }) {
  if (!src) return <div className={`flex aspect-video items-center justify-center rounded-2xl bg-background text-white ${className}`}><div className="text-center"><PlayCircle size={42} className="mx-auto" /><p className="mt-3 text-sm">Video is not available for this lesson.</p></div></div>;
  return <video key={src} src={src} title={title} controls onTimeUpdate={onTimeUpdate} onPause={onPause} onEnded={onEnded} className={`aspect-video w-full rounded-2xl bg-black ${className}`} />;
}
