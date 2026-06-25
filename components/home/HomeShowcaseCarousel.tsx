"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ServerGalleryItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function HomeShowcaseCarousel({ items }: { items: ServerGalleryItem[] }) {
  const reduce = useReducedMotion();
  const slides = useMemo(() => items.slice(0, 5), [items]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduce, slides.length]);

  const current = slides[active];
  if (!current) return null;

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/14 bg-white/[0.06] shadow-[0_24px_80px_rgba(255,159,230,0.12)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={current.imageUrl}
            alt={current.title}
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/86 via-[#07101f]/18 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-sm font-semibold text-dream-blue">{current.categoryName}</p>
        <h3 className="mt-2 text-3xl font-black">{current.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">{current.description}</p>
        <div className="mt-5 flex gap-2">
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
        </div>
      </div>
    </div>
  );
}
