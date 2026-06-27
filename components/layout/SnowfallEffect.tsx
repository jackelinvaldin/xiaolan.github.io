import type { CSSProperties } from "react";

type SnowStyle = CSSProperties & Record<`--${string}`, string>;

const flakes: Array<{ id: string; style: SnowStyle }> = Array.from({ length: 72 }, (_, index) => {
  const seeded = (salt: number) => {
    const value = Math.sin((index + 1) * (salt + 11.37)) * 10000;
    return value - Math.floor(value);
  };

  const size = 1.2 + seeded(1) * 3.6;
  const duration = 19 + seeded(2) * 24;
  const delay = -seeded(3) * duration;
  const drift = (seeded(4) - 0.5) * 132;
  const sway = 4.2 + seeded(5) * 6.8;
  const opacity = 0.22 + seeded(6) * 0.38;
  const swayStart = drift * -0.1;
  const swayEnd = drift * 0.15;

  return {
    id: `snow-${index}`,
    style: {
      "--snow-left": `${seeded(7) * 100}%`,
      "--snow-size": `${size}px`,
      "--snow-duration": `${duration}s`,
      "--snow-delay": `${delay}s`,
      "--snow-drift": `${drift}px`,
      "--snow-sway-start": `${swayStart}px`,
      "--snow-sway-end": `${swayEnd}px`,
      "--snow-sway-duration": `${sway}s`,
      "--snow-opacity": `${opacity}`
    } satisfies SnowStyle
  };
});

export function SnowfallEffect() {
  return (
    <div className="home-snowfall" aria-hidden="true">
      {flakes.map((flake) => (
        <span key={flake.id} className="snowflake" style={flake.style} />
      ))}
    </div>
  );
}
