"use client";

import { useEffect, useRef } from "react";

export function PointerGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const tapGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glowRef.current) return;
    const element = glowRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let currentX = -460;
    let currentY = -460;
    let targetX = -460;
    let targetY = -460;

    function animate() {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    }

    function move(event: PointerEvent) {
      targetX = event.clientX - 210;
      targetY = event.clientY - 210;
      if (!frame) frame = window.requestAnimationFrame(animate);
    }

    function tap(event: PointerEvent) {
      const tapElement = tapGlowRef.current;
      if (!tapElement) return;
      tapElement.style.left = `${event.clientX}px`;
      tapElement.style.top = `${event.clientY}px`;
      tapElement.classList.remove("is-active");
      window.requestAnimationFrame(() => tapElement.classList.add("is-active"));
      move(event);
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", tap, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", tap);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} aria-hidden="true" className="pointer-glow" />
      <div ref={tapGlowRef} aria-hidden="true" className="tap-glow" />
    </>
  );
}
