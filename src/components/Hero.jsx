import heroPhoto from "../assets/c22.webp";

export default function Hero() {
  return (
    <header
      id="home"
      className="hero-section relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#493932] min-h-[100svh]"
    >
      <img
        src={heroPhoto}
        alt="A wedding portrait of the couple"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 z-0 h-full w-full object-cover object-top"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-black/40"
      />

      <div className="relative z-10 w-full px-4 py-8 text-center text-white sm:py-10">
        <div className="mb-3 font-script text-[10px] uppercase tracking-[4px] text-pink-100 sm:text-xs sm:tracking-[6px]">
          Together with their families
        </div>

        <h1 className="lucy mx-auto max-w-[11ch] text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] tracking-[0.02em] text-white sm:max-w-none">
          Chetna weds Ved
        </h1>

        <div className="mt-3 font-body text-[clamp(0.8rem,2.8vw,1.15rem)] uppercase tracking-[3px] text-white sm:mt-4 sm:tracking-[5px]">
          April 20, 2026
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 sm:mt-8">
          <span className="font-script text-[11px] uppercase tracking-[3px] text-white">
            Explore Our Story
          </span>
          <div className="flex flex-col items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-8 w-px bg-gradient-to-b from-white to-transparent" />
          </div>
        </div>
      </div>
    </header>
  );
}