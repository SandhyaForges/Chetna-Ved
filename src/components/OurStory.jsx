import couple from "/6-optimized.jpg";
import useReveal from "../hooks/useReveal";

export default function OurStory() {
  const [ref, isIn] = useReveal();

  return (
    <section
      ref={ref}
      className={`reveal ${isIn ? "in" : ""} grid gap-8 items-center px-[5vw] py-12 md:grid-cols-2 md:gap-14 md:px-[6vw]`}
    >

      <div className="mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl bg-white p-1 shadow-xl">
        <img
          src={couple}
          alt="Chetna and Ved"
          loading="lazy"
          decoding="async"
          className="aspect-square w-full rounded-xl object-cover brightness-75 transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div className="text-center md:text-left">
        <div className="tracking-[4px] uppercase text-rose-deep text-xs mb-3.5">
          Our Story
        </div>
        <h2 className="font-script italic font-semibold text-[clamp(1.9rem,4vw,2.6rem)] mb-5 leading-tight">
          It all began with a simple hello...
        </h2>
        <p className="text-brown-soft leading-[1.9] text-base max-w-[440px] mx-auto mb-2.5 md:mx-0">
          What started as a moment became a lifetime of memories. And now,
          we're here to begin our forever.
        </p>
        <div className="mt-6 font-script italic text-xl text-rose-deep">
          Chetna &amp; Ved
        </div>
      </div>
    </section>
  );
}
