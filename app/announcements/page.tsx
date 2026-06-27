import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { announcementTypeLabels } from "@/lib/data/announcements";
import { getAnnouncements } from "@/lib/repository";

export const metadata = {
  title: "公告列表"
};

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">ANNOUNCEMENTS</p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.02em] md:text-7xl">公告列表</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-900/68">
          维护、活动、版本更新、社区规则、招募和重要通知都会在这里集中展示。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {Object.values(announcementTypeLabels).map((label) => (
            <span key={label} className="rounded-full border border-sky-200 bg-white/72 px-4 py-2 text-sm text-sky-900/72">
              {label}
            </span>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </main>
  );
}
