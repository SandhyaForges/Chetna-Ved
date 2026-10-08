import useReveal from "../hooks/useReveal";

export default function TimelineItem({ number, title, description, image, reverse = false }) {
  const [ref, isIn] = useReveal();

  const photo = (
    <div className="rounded-xl overflow-hidden shadow-photo aspect-[1/1]">
      <img src={image} alt={title} className="w-full h-full object-cover object-top block" />
    </div>
  );

  const node = (
    <div className="flex items-center justify-center">
      <div className="w-[38px] h-[38px] rounded-full bg-white border-[1.5px] border-gold flex items-center justify-center font-script font-semibold text-rose-deep text-sm shadow-[0_6px_16px_rgba(74,47,40,0.12)] relative z-[2] md:w-[46px] md:h-[46px]">
        {number}
      </div>
    </div>
  );

  const text = (
    <div className={`px-2 md:px-5 ${reverse ? "md:text-right" : ""}`}>
      <h3 className="font-script italic font-semibold text-xl mb-2 md:text-2xl">{title}</h3>
      <p className="text-brown-soft text-[13.5px] leading-relaxed md:text-[14.5px]">{description}</p>
    </div>
  );

  const photoPos = reverse
    ? "col-start-2 row-start-2 md:row-start-1 md:col-start-3"
    : "col-start-2 row-start-2 md:row-start-1 md:col-start-1";

  const nodePos = "col-start-1 row-start-1 md:row-start-1 md:col-start-2";

  const textPos = reverse
    ? "col-start-2 row-start-3 md:row-start-1 md:col-start-1"
    : "col-start-2 row-start-3 md:row-start-1 md:col-start-3";

  return (
    <div
      ref={ref}
      className={`reveal ${isIn ? "in" : ""} grid grid-cols-[42px_1fr] items-center gap-2 mb-16 last:mb-0 md:grid-cols-[1fr_60px_1fr] md:gap-0`}
    >
      <div className={photoPos}>{photo}</div>
      <div className={nodePos}>{node}</div>
      <div className={`${textPos} mt-3 md:mt-0`}>{text}</div>
    </div>
  );
}