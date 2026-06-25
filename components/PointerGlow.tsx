"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export function PointerGlow() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);
  const x = useSpring(rawX, { stiffness: 110, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 110, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;

    function move(event: PointerEvent) {
      rawX.set(event.clientX - 190);
      rawY.set(event.clientY - 190);
    }

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [rawX, rawY, reduce]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-glow"
      style={{ x, y }}
    />
  );
}
