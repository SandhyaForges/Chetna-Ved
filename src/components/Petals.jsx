export default function Petals({ count = 20 }) {
  const petals = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 14;
    const delay = Math.random() * 14;
    const opacity = 0.4 + Math.random() * 0.4;
    const scale = 0.6 + Math.random() * 0.8;

    return (
      <div
        key={i}
        className="petal animate-fall"
        style={{
          left: `${left}vw`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity,
          transform: `scale(${scale})`,
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals}
    </div>
  );
}
