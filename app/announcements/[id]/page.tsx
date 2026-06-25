import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { announcementTypeLabels, announcements } from "@/lib/data/announcements";

export function generateStaticParams() {
  return announcements.map((announcement) => ({ id: announcement.slug }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const announcement = announcements.find((item) => item.slug === params.id || item.id === params.id);
  return {
    title: announcement?.title ?? "公告详情"
  };
}

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const announcement = announcements.find((item) => item.slug === params.id || item.id === params.id);
  if (!announcement) notFound();

  return (
    <main className="px-4 pb-24 pt-32">
      <article className="mx-auto max-w-4xl">
        <Link href="/announcements" className="inline-flex items-center gap-2 text-sm font-semibold text-dream-blue">
          <ArrowLeft size={16} />
          返回公告列表
        </Link>
        <GlassPanel className="mt-8 p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/58">
            <span className="rounded-full bg-white/10 px-3 py-1">{announcementTypeLabels[announcement.type]}</span>
            <span>{announcement.publishedAt}</span>
            <span>{announcement.authorName}</span>
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">
            {announcement.title}
          </h1>
          <p className="mt-6 text-lg leading-9 text-white/70">{announcement.summary}</p>
          <div className="mt-10 rounded-[24px] border border-white/10 bg-white/[0.06] p-6 text-base leading-9 text-white/72">
            {announcement.content}
          </div>
        </GlassPanel>
      </article>
    </main>
  );
}
