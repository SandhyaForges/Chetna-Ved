import useReveal from "../hooks/useReveal";

export default function LoveQuote() {
  const [ref, isIn] = useReveal();

  return (
    <section
      ref={ref}
      className={`reveal ${isIn ? "in" : ""} text-center py-10 px-5 bg-blush`}
    >
      <p className="font-script italic font-medium text-[clamp(1.3rem,3vw,2rem)] text-rose-deep max-w-[640px] mx-auto leading-relaxed">
        "Two souls, one heart, a lifetime of love."
      </p>
      <div className="mt-4 font-script italic text-lg text-brown-soft">
        Chetna &amp; Ved
      </div>
    </section>
  );
}
