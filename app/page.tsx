import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChatsCircle, Compass, Sparkle, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { ActionButton } from "@/components/ActionButton";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { MotionSection } from "@/components/MotionSection";
import { ServerGalleryCard } from "@/components/server/ServerGalleryCard";
import { announcements } from "@/lib/data/announcements";
import { communityPosts } from "@/lib/data/community";
import { serverGallery } from "@/lib/data/server-gallery";
import { siteNameEn } from "@/lib/data/site";
import { teamMembers } from "@/lib/data/team";

export default function HomePage() {
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
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">{siteNameEn}</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
              琢一束光，织一场梦。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
              这里是琢光绮梦，一个属于创造者与玩家的方块梦境。
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
                  src="/images/server/storm-ring-relic.jpg"
                  alt="星环之境"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/82 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-sm text-dream-blue">最新地图</p>
                  <h2 className="mt-2 text-3xl font-black">星环之境</h2>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  ["在线状态", "稳定运行"],
                  ["地图档案", "雨幕遗构"],
                  ["社区活动", "周末共建"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5">
                    <p className="text-sm text-white/52">{label}</p>
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
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black tracking-[-0.02em] text-white md:text-5xl">
              一个小队，四种光源。
            </h2>
            <p className="mt-5 text-base leading-8 text-white/64">
              琢光绮梦围绕策划、维护、活动和地图创作协作，让服务器既稳定，也有可被记住的风景。
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4 md:auto-rows-[220px]">
            {teamMembers.map((member, index) => (
              <GlassPanel
                key={member.id}
                className={`p-6 ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div
                  className="grid size-12 place-items-center rounded-2xl text-[#07101f]"
                  style={{ background: member.accent }}
                >
                  <UsersThree size={22} weight="fill" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{member.displayName}</h3>
                <p className="mt-1 text-sm text-dream-blue">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-white/62">{member.description}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Compass size={34} className="text-starlight-pink" />
            <h2 className="mt-5 text-4xl font-black tracking-[-0.02em] md:text-5xl">服务器展示</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/64">
              从玩家日常到雨幕遗构，服务器专区用真实截图串起每个场景。
            </p>
            <div className="mt-7">
              <ActionButton href="/server">打开沉浸页</ActionButton>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {serverGallery.slice(0, 4).map((item) => (
              <ServerGalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.02em] md:text-5xl">最新公告</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/64">
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
            {announcements.map((announcement) => (
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
              <h2 className="text-3xl font-black">社区留言预览</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {communityPosts.map((post) => (
                <article key={post.id} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/52">
                    <span>{post.authorName}</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{post.content}</p>
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
              <div className="absolute bottom-6 left-6 right-6">
                <Sparkle size={28} className="text-dream-blue" />
                <p className="mt-4 text-2xl font-black">把玩家故事留在这里。</p>
                <p className="mt-3 text-sm leading-7 text-white/66">
                  登录后可以发言、回复、点赞，也可以进入个人空间发布公开或私密动态。
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </MotionSection>
    </main>
  );
}
