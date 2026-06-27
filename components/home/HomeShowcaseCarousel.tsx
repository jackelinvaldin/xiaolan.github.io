"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ServerGalleryItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function HomeShowcaseCarousel({ items }: { items: ServerGalleryItem[] }) {
  const slides = useMemo(() => items.slice(0, 5), [items]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const current = slides[active];
  if (!current) return null;

  function move(direction: "prev" | "next") {
    setActive((value) => {
      if (!slides.length) return value;
      return direction === "next"
        ? (value + 1) % slides.length
        : (value - 1 + slides.length) % slides.length;
    });
  }

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/80 bg-white/70 shadow-[0_24px_80px_rgba(104,166,214,0.18)]">
      <div key={current.id} className="home-showcase-image absolute inset-0">
        <Image
          src={current.imageUrl}
          alt={current.title}
          fill
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/76 via-[#07101f]/16 to-transparent" />
      </div>

      <button
        type="button"
        aria-label="上一张展示图"
        className="absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/65 bg-white/72 text-sky-950 shadow-[0_10px_30px_rgba(35,86,132,0.18)] backdrop-blur-xl transition hover:bg-white"
        onClick={() => move("prev")}
      >
        <CaretLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="下一张展示图"
        className="absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/65 bg-white/72 text-sky-950 shadow-[0_10px_30px_rgba(35,86,132,0.18)] backdrop-blur-xl transition hover:bg-white"
        onClick={() => move("next")}
      >
        <CaretRight size={20} />
      </button>

      <div className="on-image absolute bottom-0 left-0 right-0 p-6">
        <p className="text-sm font-semibold text-dream-blue">{current.categoryName}</p>
        <h3 className="mt-2 text-3xl font-black">{current.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">{current.description}</p>
        <div className="mt-5 flex items-center gap-2">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`切换到${item.title}`}
              onClick={() => setActive(index)}
              className={cn(
                "h-2 rounded-full border border-white/20 transition-all",
                index === active ? "w-10 bg-starlight-pink" : "w-2 bg-white/34 hover:bg-white/60"
              )}
            />
          ))}
          <span className="ml-2 text-xs text-white/64">可点击箭头切换</span>
        </div>
      </div>
    </div>
  );
}
