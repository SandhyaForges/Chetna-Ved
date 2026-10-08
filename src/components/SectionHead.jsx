export default function SectionHead({ kicker, title, className = "" }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className="font-script tracking-[5px] uppercase text-rose-deep text-xs mb-2.5">
        {kicker}
      </div>
      <h2 className="font-script italic font-semibold text-[clamp(1.9rem,4.6vw,2.8rem)] text-brown">
        {title}
      </h2>
      <div className="relative w-[60px] h-px bg-gold mx-auto mt-4.5">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream px-2.5 text-gold text-[10px]">
          ✦
        </span>
      </div>
    </div>
  );
}
