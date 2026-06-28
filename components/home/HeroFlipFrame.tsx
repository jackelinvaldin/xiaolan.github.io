"use client";

import { getImageProps } from "next/image";
import { type SyntheticEvent, useMemo, useState } from "react";

type FramePictureProps = {
  alt: string;
  desktopSrc: string;
  mobileSrc: string;
  eager?: boolean;
};

function decodeOnLoad(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (typeof image.decode === "function") {
    image.decode().catch(() => undefined);
  }
}

function FramePicture({ alt, desktopSrc, mobileSrc, eager = false }: FramePictureProps) {
  const desktop = useMemo(
    () =>
      getImageProps({
        src: desktopSrc,
        alt,
        width: 3072,
        height: 3840,
        sizes: "(max-width: 768px) 72vw, 320px",
        unoptimized: true
      }).props,
    [alt, desktopSrc]
  );

  const mobile = useMemo(
    () =>
      getImageProps({
        src: mobileSrc,
        alt,
        width: 720,
        height: 900,
        sizes: "72vw",
        unoptimized: true
      }).props,
    [alt, mobileSrc]
  );

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet} />
      <img
        {...desktop}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="hero-flip-image"
        onLoad={decodeOnLoad}
      />
    </picture>
  );
}

export function HeroFlipFrame() {
  const [flipped, setFlipped] = useState(false);
  const [hasBackImage, setHasBackImage] = useState(false);

  function toggleFrame() {
    setHasBackImage(true);
    setFlipped((value) => !value);
  }

  return (
    <button
      type="button"
      className={`hero-flip-frame ${flipped ? "is-flipped" : ""}`}
      aria-label="翻转蓝水梦尘画框"
      aria-pressed={flipped}
      onClick={toggleFrame}
    >
      <span className="pointer-events-none absolute inset-2 z-10 rounded-[22px] border border-white/70 shadow-[inset_0_0_0_1px_rgba(92,155,202,0.14)]" />
      <span className="hero-flip-frame-inner">
        <span className="hero-flip-face hero-flip-front">
          <FramePicture
            alt="蓝水梦尘主视觉画框"
            desktopSrc="/images/ui/lan-profile-card.png"
            mobileSrc="/images/ui/lan-profile-card-mobile.webp"
            eager
          />
        </span>
        <span className="hero-flip-face hero-flip-back">
          {hasBackImage ? (
            <FramePicture
              alt="腐竹主视觉画框"
              desktopSrc="/images/ui/lan-profile-card-flip.webp"
              mobileSrc="/images/ui/lan-profile-card-flip-mobile.webp"
            />
          ) : (
            <span className="hero-flip-empty" aria-hidden="true" />
          )}
        </span>
      </span>
    </button>
  );
}
