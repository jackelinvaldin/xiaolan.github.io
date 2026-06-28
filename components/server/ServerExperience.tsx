"use client";

import Image from "next/image";
import { ArrowUp, Crown, Gift, Play, Ranking, Question } from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { MapArchivePanel } from "@/components/server/MapArchivePanel";
import { RainOverlay } from "@/components/server/RainOverlay";
import { ServerCarousel } from "@/components/server/ServerCarousel";
import { ServerStatusPanel } from "@/components/server/ServerStatusPanel";
import { serverScenes } from "@/lib/data/server-gallery";
import { cn } from "@/lib/utils";

const quickActions = [
  { label: "福利中心", icon: Gift },
  { label: "排行榜", icon: Ranking },
  { label: "帮助中心", icon: Question },
  { label: "回到顶部", icon: ArrowUp }
];

const highlights = [
  "地图故事",
  "遗迹探索",
  "建筑设定"
];

export function ServerExperience() {
  return (
    <main className="h-[100dvh] overflow-y-auto scroll-smooth snap-y snap-mandatory bg-[#edf8ff]">
      {serverScenes.map((scene, index) => (
        <SceneSection key={scene.id} scene={scene} index={index} />
      ))}
    </main>
  );
}

function SceneSection({ scene, index }: { scene: (typeof serverScenes)[number]; index: number }) {
  const isHome = index === 0;
  const isFinal = index === 2;

  return (
    <section className="relative min-h-[100dvh] snap-start overflow-hidden px-4 pb-10 pt-28">
      <Image
        src={scene.imageUrl}
        alt={scene.title}
        fill
        priority={isHome}
        loading={isHome ? undefined : "lazy"}
        decoding="async"
        sizes="100vw"
        className={cn("object-cover", isHome ? "object-center" : "object-center")}
      />
      <div className="image-scrim absolute inset-0" />
      {!isHome ? <RainOverlay stars={!isFinal} /> : <div className="star-field" />}

      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-9rem)] max-w-7xl content-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="on-image reveal-on-scroll">
          <div className="inline-flex rounded-full border border-white/55 bg-white/22 px-4 py-2 text-xs font-semibold text-white/86 backdrop-blur-md">
            {scene.number} / {scene.label}
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
            {scene.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/76">{scene.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionButton href={isFinal ? "/server/maps" : "/server"}>{scene.primaryAction}</ActionButton>
            <ActionButton href={isHome ? "/server/maps" : "/server/gallery"} variant="ghost">
              {scene.secondaryAction}
            </ActionButton>
          </div>
        </div>

        <div className="reveal-on-scroll grid gap-5">
          {isHome ? (
            <ServerStatusPanel />
          ) : isFinal ? (
            <MapArchivePanel />
          ) : (
            <GlassPanel className="p-5">
              <div className="relative aspect-video overflow-hidden rounded-[22px] border border-white/70 bg-white/60">
                <Image
                  src="/images/server/purple-aurora-night.jpg"
                  alt="地图预告片"
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover opacity-82"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/68 to-transparent" />
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#0b1020] shadow-[0_0_42px_rgba(255,159,230,0.42)]"
                  aria-label="播放地图预告片"
                >
                  <Play size={24} weight="fill" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-7 text-sky-900/68">
                极光巡礼会串联服务器中的夜景、湖面和雪境坐标，适合截图与散步。
              </p>
            </GlassPanel>
          )}
        </div>
      </div>

      {isHome ? (
        <div className="relative z-10 mx-auto -mt-3 max-w-7xl">
          <ServerCarousel />
        </div>
      ) : (
        <div className="reveal-on-scroll relative z-10 mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <GlassPanel key={item} className="px-5 py-4">
              <div className="flex items-center gap-3">
                <Crown size={20} className="text-starlight-pink" />
                <span className="font-semibold">{item}</span>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 gap-3 lg:grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              aria-label={action.label}
              className="pointer-events-auto grid size-12 place-items-center rounded-full border border-white/75 bg-white/76 text-sky-950 shadow-[0_10px_34px_rgba(29,82,130,0.18)] backdrop-blur-xl transition hover:bg-white"
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
