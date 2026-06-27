import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { announcementTypeLabels } from "@/lib/data/announcements";
import { getAnnouncementById } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);
  return {
    title: announcement?.title ?? "公告详情"
  };
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);

  if (!announcement) {
    return (
      <main className="px-4 pb-24 pt-32">
        <section className="mx-auto max-w-3xl">
          <Link href="/announcements" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
            <ArrowLeft size={16} />
            返回公告列表
          </Link>
          <GlassPanel className="mt-8 p-8 text-center md:p-12">
            <p className="text-sm font-semibold tracking-[0.18em] text-starlight-pink/90">ANNOUNCEMENT</p>
            <h1 className="mt-4 text-4xl font-black text-sky-950">公告不存在或已被删除</h1>
            <p className="mt-4 text-base leading-8 text-sky-900/68">
              这条公告可能已经被删除，或者链接地址有误。可以返回公告列表查看最新内容。
            </p>
            <div className="mt-8">
              <Link
                href="/announcements"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky-200/70 bg-white/76 px-6 font-bold text-sky-950 shadow-[0_14px_34px_rgba(84,145,198,0.14)] transition hover:bg-white"
              >
                返回公告列表
              </Link>
            </div>
          </GlassPanel>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 pb-24 pt-32">
      <article className="mx-auto max-w-4xl">
        <Link href="/announcements" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
          <ArrowLeft size={16} />
          返回公告列表
        </Link>
        <GlassPanel className="mt-8 p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-sky-900/58">
            <span className="glass-chip rounded-full px-3 py-1 font-semibold">
              {announcementTypeLabels[announcement.type]}
            </span>
            <time dateTime={announcement.publishedAt}>{formatDate(announcement.publishedAt)}</time>
            <span>{announcement.authorName}</span>
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.02em] text-sky-950 md:text-6xl">
            {announcement.title}
          </h1>
          <p className="mt-6 text-lg leading-9 text-sky-900/70">{announcement.summary}</p>
          <div className="mt-10 rounded-[24px] border border-sky-200/60 bg-white/68 p-6 text-base leading-9 text-sky-950/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]">
            {announcement.content}
          </div>
        </GlassPanel>
      </article>
    </main>
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
