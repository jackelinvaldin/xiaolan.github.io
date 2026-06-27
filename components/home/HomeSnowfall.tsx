import type { CSSProperties } from "react";

type SnowStyle = CSSProperties & Record<`--${string}`, string>;

const flakes: Array<{ id: string; style: SnowStyle }> = Array.from({ length: 72 }, (_, index) => {
  const seeded = (salt: number) => {
    const value = Math.sin((index + 1) * (salt + 11.37)) * 10000;
    return value - Math.floor(value);
  };

  const size = 1.4 + seeded(1) * 3.8;
  const duration = 18 + seeded(2) * 22;
  const delay = -seeded(3) * duration;
  const drift = (seeded(4) - 0.5) * 120;
  const sway = 3.8 + seeded(5) * 5.6;
  const opacity = 0.28 + seeded(6) * 0.52;
  const swayStart = drift * -0.12;
  const swayEnd = drift * 0.16;

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

export function HomeSnowfall() {
  return (
    <div className="home-snowfall" aria-hidden="true">
      {flakes.map((flake) => (
        <span key={flake.id} className="snowflake" style={flake.style} />
      ))}
    </div>
  );
}
