import heroPhoto from "../assets/c2-optimized.jpg";

export default function Hero() {
  return (
    <header
      id="home"
      className="hero-section relative isolate top-0 m-0 h-screen min-h-screen flex flex-col items-center justify-end text-center p-0 overflow-hidden bg-[#493932]"
    >
      <img
        src={heroPhoto}
        alt="A wedding portrait of the couple"
        fetchPriority="high"
        decoding="async"
        className="absolute top-0 left-0 z-10 w-full h-full object-cover object-top"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.08) 58%, rgba(0,0,0,0.58) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.18), transparent 24%, transparent 76%, rgba(0,0,0,0.18))
          `,
        }}
      />

      <div className="relative z-30 w-full px-4 pb-8 sm:pb-10 animate-[fadeUp_1.1s_ease_0.2s_both]">
        <div className="font-script tracking-[4px] uppercase text-pink-100 text-[10px] mb-3 sm:tracking-[6px] sm:text-xs [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          Together with their families
        </div>

        <h1 className="lucy mx-auto text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] tracking-[0.02em] text-white max-w-[11ch] sm:max-w-none [text-shadow:0_4px_30px_rgba(74,47,40,0.45)]">
          Chetna weds Ved
        </h1>

        <div className="mt-3 font-body text-[clamp(0.8rem,2.8vw,1.15rem)] tracking-[3px] uppercase text-white sm:mt-4 sm:tracking-[5px] [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          April 20, 2026
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 sm:mt-8">
          <span className="font-script tracking-[3px] uppercase text-[11px] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.35)]">
            Explore Our Story
          </span>
          <div className="relative w-px h-8 bg-gradient-to-b from-white to-transparent">
            <span className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full bg-white animate-cueMove" />
          </div>
        </div>
      </div>
    </header>
  );
}