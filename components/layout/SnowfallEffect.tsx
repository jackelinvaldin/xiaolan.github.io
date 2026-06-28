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

const meteors: Array<{ id: string; style: SnowStyle }> = Array.from({ length: 10 }, (_, index) => {
  const seeded = (salt: number) => {
    const value = Math.sin((index + 1) * (salt + 23.71)) * 10000;
    return value - Math.floor(value);
  };

  const duration = 5.8 + seeded(1) * 5.5;
  const delay = -seeded(2) * 18;
  const left = 5 + seeded(4) * 90;
  const length = 88 + seeded(5) * 118;
  const opacity = 0.28 + seeded(6) * 0.42;
  const drift = (seeded(7) - 0.5) * 18;
  const hue = Math.round(190 + seeded(8) * 160);
  const tilt = -8 + seeded(9) * 16;

  return {
    id: `meteor-${index}`,
    style: {
      "--meteor-left": `${left}%`,
      "--meteor-length": `${length}px`,
      "--meteor-duration": `${duration}s`,
      "--meteor-delay": `${delay}s`,
      "--meteor-opacity": `${opacity}`,
      "--meteor-drift": `${drift}vw`,
      "--meteor-hue": `${hue}`,
      "--meteor-tilt": `${tilt}deg`
    } satisfies SnowStyle
  };
});

export function SnowfallEffect() {
  return (
    <div className="home-snowfall" aria-hidden="true">
      {flakes.map((flake) => (
        <span key={flake.id} className="snowflake" style={flake.style} />
      ))}
      {meteors.map((meteor) => (
        <span key={meteor.id} className="meteor" style={meteor.style} />
      ))}
    </div>
  );
}
