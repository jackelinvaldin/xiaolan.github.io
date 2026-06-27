import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChatsCircle, Compass, Sparkle, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { ActionButton } from "@/components/ActionButton";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { HomeShowcaseCarousel } from "@/components/home/HomeShowcaseCarousel";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { MotionSection } from "@/components/MotionSection";
import { getAnnouncements, getCommunityPosts, getGalleryItems } from "@/lib/repository";
import { siteNameEn } from "@/lib/data/site";
import { teamMembers } from "@/lib/data/team";

const serverMessage = [
  "尽然时光于何流转消散数十年",
  "它仍然一如既往散发着顽强的生命力",
  "无论不为人知的自己在现实中遭遇着何等压迫",
  "他们仍然带着初心与热爱为它奉献着自我",
  "它曾被众生冠为最伟大的作品",
  "它于曦月流转间守望着最伟大的玩家",
  "而显然他们已经不应该被称作玩家",
  "他们是这伟大传说的缔造者"
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [announcements, communityPosts, serverGallery] = await Promise.all([
    getAnnouncements(),
    getCommunityPosts(),
    getGalleryItems()
  ]);

  return (
    <main>
      <section className="relative min-h-[100dvh] overflow-hidden px-4 pt-28">
        <Image
          src="/images/server/server-home-reading.jpg"
          alt="琢光绮梦服务器玩家日常"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="image-scrim absolute inset-0" />
        <div className="star-field" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-7rem)] max-w-7xl content-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="on-image">
            <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">{siteNameEn}</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              琢光绮梦，诗丽画境
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
              蓝水警尘梦，夜吟开草堂。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionButton href="/server">进入服务器</ActionButton>
              <ActionButton href="/community" variant="ghost">
                浏览社区
              </ActionButton>
            </div>
          </div>

          <GlassPanel className="relative overflow-hidden p-4">
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[360px] overflow-hidden rounded-[24px]">
                <Image
                  src="/images/server/server-home-reading.jpg"
                  alt="星环之境"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/82 to-transparent" />
                <div className="on-image absolute bottom-5 left-5 right-5">
                  <p className="text-sm text-dream-blue">最新地图</p>
                  <h2 className="mt-2 text-3xl font-black text-white">星环之境</h2>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  ["在线状态", "稳定运行"],
                  ["地图档案", "雨幕遗构"],
                  ["社区活动", "周末共建"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-sky-200/60 bg-white/68 p-5 shadow-[0_12px_28px_rgba(82,145,198,0.1)]">
                    <p className="text-sm text-sky-800/70">{label}</p>
                    <p className="mt-2 text-2xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <MotionSection className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-starlight-pink/86">SERVER MESSAGE</p>
              <h2 className="mt-4 text-4xl font-black text-sky-950 md:text-5xl">服务器寄语</h2>
            </div>
            <GlassPanel className="relative overflow-hidden p-7 md:p-9">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-starlight-pink/70 to-transparent" />
              <div className="grid gap-3 text-base leading-8 text-sky-950/78 md:text-lg">
                {serverMessage.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </GlassPanel>
          </div>

          <div className="no-scrollbar mt-10 grid auto-cols-[74%] grid-flow-col items-stretch gap-4 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory] sm:auto-cols-[46%] lg:auto-cols-[24%]">
            {teamMembers.map((member) => (
              <GlassPanel key={member.id} className="flex min-h-[210px] flex-col justify-end p-5 [scroll-snap-align:start]">
                {member.avatarUrl ? (
                  <div className="relative mb-4 size-14 overflow-hidden rounded-[18px] border border-white/70 shadow-[0_14px_36px_rgba(255,159,230,0.18)]">
                    <Image
                      src={member.avatarUrl}
                      alt={`${member.displayName}头像`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="mb-4 grid size-11 place-items-center rounded-2xl text-[#07101f]"
                    style={{ background: member.accent }}
                  >
                    <UsersThree size={22} weight="fill" />
                  </div>
                )}
                <h3 className="text-xl font-bold">{member.displayName}</h3>
                <p className="mt-1 text-sm text-dream-blue">{member.role}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-sky-900/68">{member.description}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <Compass size={34} className="text-starlight-pink" />
            <h2 className="mt-5 text-4xl font-black md:text-5xl">服务器展示</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-sky-900/68">
              从玩家日常到雨幕遗构，服务器专区用真实截图串起每个场景。
            </p>
            <div className="mt-7">
              <ActionButton href="/server">打开沉浸页</ActionButton>
            </div>
          </div>
          <HomeShowcaseCarousel items={serverGallery} />
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black md:text-5xl">最新公告</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-sky-900/68">
                维护、活动、版本更新和地图预览会集中发布在公告区。
              </p>
            </div>
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 text-sm font-semibold text-dream-blue"
            >
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {announcements.slice(0, 3).map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} compact />
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3">
              <ChatsCircle size={26} className="text-starlight-pink" />
              <h2 className="text-3xl font-black">社区留言</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {communityPosts.slice(0, 3).map((post) => (
                <article key={post.id} className="surface-card hover-flip-card rounded-[22px] p-5">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-sky-900/58">
                    <span>{post.authorName}</span>
                    <time dateTime={post.createdAt}>{formatDateTime(post.createdAt)}</time>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-sky-900/68">{post.content}</p>
                </article>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel className="overflow-hidden">
            <div className="relative min-h-[520px]">
              <Image
                src="/images/server/group-red-lantern.jpg"
                alt="玩家合照"
                fill
                sizes="(max-width: 1024px) 100vw, 36vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/88 to-transparent" />
              <div className="on-image absolute bottom-6 left-6 right-6">
                <Sparkle size={28} className="text-dream-blue" />
                <p className="mt-4 text-2xl font-black">把玩家故事留在这里。</p>
                <p className="mt-3 text-sm leading-7 text-white/66">
                  注册后可以发言、点赞，也可以进入个人空间发布公开或私密动态。
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </MotionSection>
    </main>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
