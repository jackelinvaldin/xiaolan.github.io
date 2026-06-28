"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { MobileLazyImage } from "@/components/media/MobileLazyImage";
import { serverGallery } from "@/lib/data/server-gallery";

const cards = serverGallery.slice(0, 5);

export function ServerCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const visibleCards = useMemo(() => cards, []);

  function move(direction: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth * 0.36;
    track.scrollBy({ left: direction === "next" ? width : -width, behavior: "smooth" });
    setActive((value) =>
      direction === "next"
        ? Math.min(value + 1, visibleCards.length - 1)
        : Math.max(value - 1, 0)
    );
  }

  return (
    <div className="relative">
      <p className="mb-1 px-12 text-xs font-semibold text-sky-950/64">
        横向滑动查看更多服务器画面
      </p>
      <div
        ref={trackRef}
        className="no-scrollbar grid auto-cols-[76%] grid-flow-col gap-4 overflow-x-auto scroll-smooth px-12 py-4 [scroll-snap-type:x_mandatory] sm:auto-cols-[42%] lg:auto-cols-[29%]"
        onScroll={(event) => {
          const target = event.currentTarget;
          const approx = Math.round(target.scrollLeft / Math.max(1, target.clientWidth * 0.32));
          setActive(Math.min(Math.max(approx, 0), visibleCards.length - 1));
        }}
      >
        {visibleCards.map((item) => (
          <article
            key={item.id}
            className="surface-card hover-flip-card group overflow-hidden rounded-[28px] [scroll-snap-align:center] active:scale-[0.99]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <MobileLazyImage
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 76vw, 29vw"
                className="object-cover transition duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/76 to-transparent" />
            </div>
            <div className="p-4">
              <p className="text-xs text-starlight-pink/82">{item.categoryName}</p>
              <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-sky-900/64">{item.description}</p>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="上一张"
        className="absolute left-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/78 text-sky-950 shadow-[0_10px_34px_rgba(29,82,130,0.18)] backdrop-blur-xl transition hover:bg-white"
        onClick={() => move("prev")}
      >
        <CaretLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="下一张"
        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/78 text-sky-950 shadow-[0_10px_34px_rgba(29,82,130,0.18)] backdrop-blur-xl transition hover:bg-white"
        onClick={() => move("next")}
      >
        <CaretRight size={20} />
      </button>

      <div className="mt-2 flex justify-center gap-2">
        {visibleCards.map((item, index) => (
          <button
            key={item.id}
            aria-label={`切换到 ${item.title}`}
            className={`size-2.5 rounded-full transition ${
              active === index ? "w-8 bg-starlight-pink" : "bg-sky-300/56"
            }`}
            onClick={() => {
              const track = trackRef.current;
              if (!track) return;
              const card = track.children.item(index) as HTMLElement | null;
              card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
              setActive(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
