"use client";

import { useEffect, useState } from "react";
import { HeroFlipFrame } from "@/components/home/HeroFlipFrame";

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
      <HeroFlipFrame />
    </div>
  );
}
