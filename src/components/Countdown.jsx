import useCountdown from "../hooks/useCountdown";
import useReveal from "../hooks/useReveal";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];
export default function Countdown({ weddingDate = "2026-04-20T00:00:00" }) {
  const counts = useCountdown(weddingDate);
  const [ref, isIn] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${isIn ? "in" : ""} flex justify-center px-5 relative z-10`}
    >
      <div className="bg-red-200 h-[0.5px] w-full absolute top-0"></div>

      <div className="w-full rounded-2xl px-8 pt-9 pb-8 text-center ">
        <div className="tracking-[4px] uppercase  text-rose-deep mb-7">
          The love Countdown
        </div>

        <div className="grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:gap-10 sm:flex-wrap">
          {UNITS.map((u) => (
            <div key={u.key} className="flex flex-col items-center">
              <div
                className="ring-inner relative w-[72px] h-[72px] rounded-full border-[1.5px] border-gold flex items-center justify-center sm:w-[88px] sm:h-[88px]"
                style={{
                  backgroundImage: "url('/flower.svg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <span className="font-script font-semibold text-2xl text-brown z-10 sm:text-3xl">
                  {counts[u.key]}
                </span>
              </div>

              <div className="mt-3 text-[9.5px] tracking-[2.5px] uppercase text-brown-soft sm:text-[10.5px]">
                {u.label}
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className="bg-red-200 h-[0.5px] w-full absolute bottom-0"></div>

    </div>
  );
}
