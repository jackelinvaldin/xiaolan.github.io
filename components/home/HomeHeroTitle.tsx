"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const titles = ["琢光绮梦，诗丽画境", "你好琢梦，你好小蓝"];

export function HomeHeroTitle() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % titles.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mt-5 grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(210px,320px)]">
      <h1 className="max-w-3xl text-5xl font-black leading-[1.05] text-sky-950 sm:text-6xl lg:text-7xl">
        <span key={titles[active]} className="hero-title-swap">
          {titles[active]}
        </span>
      </h1>
      <div className="relative aspect-[4/5] w-[72vw] max-w-[300px] justify-self-start overflow-hidden rounded-[28px] border border-white/85 bg-white/70 p-2 shadow-[0_22px_70px_rgba(57,113,180,0.22)] backdrop-blur-sm md:w-full md:max-w-[320px] md:justify-self-end">
        <div className="pointer-events-none absolute inset-2 z-10 rounded-[22px] border border-white/70 shadow-[inset_0_0_0_1px_rgba(92,155,202,0.14)]" />
        <div className="relative h-full overflow-hidden rounded-[22px]">
          <Image
            src="/images/ui/lan-profile-card.png"
            alt="蓝水梦尘主视觉画框"
            fill
            priority
            sizes="(max-width: 768px) 72vw, 320px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
