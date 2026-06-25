export function RainOverlay({ stars = false }: { stars?: boolean }) {
  return (
    <>
      {stars ? <div className="star-field" /> : null}
      <div className="rain-layer" />
    </>
  );
}
