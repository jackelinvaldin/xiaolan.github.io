"use client";

import Image, { type ImageProps } from "next/image";
import { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MobileLazyImageProps = ImageProps & {
  deferOnMobile?: boolean;
};

export function MobileLazyImage({
  deferOnMobile = true,
  loading,
  decoding = "async",
  onLoad,
  className,
  ...props
}: MobileLazyImageProps) {
  const shellRef = useRef<HTMLSpanElement>(null);
  const [shouldRender, setShouldRender] = useState(!deferOnMobile);
  const isFill = Boolean(props.fill);

  useEffect(() => {
    if (!deferOnMobile) {
      return;
    }

    let frame = 0;
    const reveal = () => {
      frame = window.requestAnimationFrame(() => setShouldRender(true));
    };

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) {
      reveal();
      return () => window.cancelAnimationFrame(frame);
    }

    const target = shellRef.current;
    if (!target || !("IntersectionObserver" in window)) {
      reveal();
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px 220px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [deferOnMobile]);

  function handleLoad(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    if (typeof image.decode === "function") {
      image.decode().catch(() => undefined);
    }
    onLoad?.(event);
  }

  return (
    <span
      ref={shellRef}
      className={cn(
        "mobile-lazy-image-shell",
        isFill ? "absolute inset-0 block" : "block"
      )}
      data-loaded={shouldRender ? "true" : "false"}
    >
      {shouldRender ? (
        <Image
          {...props}
          alt={props.alt}
          className={className}
          loading={props.priority ? undefined : loading ?? "lazy"}
          decoding={decoding}
          onLoad={handleLoad}
        />
      ) : (
        <span className="mobile-lazy-image-placeholder" aria-hidden="true" />
      )}
    </span>
  );
}
