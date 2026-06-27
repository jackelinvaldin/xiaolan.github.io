import Link from "next/link";
import { MegaphoneSimple } from "@phosphor-icons/react/dist/ssr";
import { announcementTypeLabels } from "@/lib/data/announcements";
import type { Announcement } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function AnnouncementCard({
  announcement,
  compact = false
}: {
  announcement: Announcement;
  compact?: boolean;
}) {
  const date = formatDate(announcement.publishedAt);

  return (
    <article
      className={cn(
        "surface-card hover-flip-card group rounded-[28px] p-5 transition duration-300 hover:-translate-y-1 hover:border-starlight-pink/45",
        announcement.pinned && "soft-glow"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-800">
          <MegaphoneSimple size={14} />
          {announcementTypeLabels[announcement.type]}
        </span>
        <time className="text-xs text-sky-900/50" dateTime={announcement.publishedAt}>
          {date}
        </time>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-tight text-sky-950">{announcement.title}</h3>
      <p className={cn("mt-3 text-sm leading-7 text-sky-900/68", compact && "line-clamp-2")}>
        {announcement.summary}
      </p>
      <Link
        href={`/announcements/${announcement.slug}`}
        className="mt-5 inline-flex rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-950 transition hover:border-sky-300 hover:bg-white"
      >
        查看详情
      </Link>
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
