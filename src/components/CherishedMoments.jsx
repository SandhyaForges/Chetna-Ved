import { useState } from "react";
import img2 from "../assets/moments/879.webp";
import img7 from "../assets/moments/937.webp";
import img8 from "../assets/moments/1012.webp";
import SectionHead from "./SectionHead";
import useReveal from "../hooks/useReveal";

export default function CherishedMoments() {
  const [ref, isIn] = useReveal();
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="moments" className="px-[5vw] sm:px-[6vw] py-8">
      <SectionHead kicker="A Story in Frames" title="Our Cherished Moments" />

      <div
        ref={ref}
        className={`${isIn ? "in" : ""} max-w-[1100px] mx-auto`}
      >
        <div className="relative h-[390px] sm:h-auto sm:grid sm:grid-cols-3 gap-4 md:gap-5 items-end">
          <a
            className={`group absolute left-0 top-[25px] w-[49%] sm:static sm:w-auto sm:translate-y-5 sm:-rotate-3 sm:hover:rotate-0 transition-all duration-500 ${
              activeImage === "img7"
                ? "z-[50]"
                : "z-30"
            }`}
            onClick={() => setActiveImage("img7")}
          >
            <img
              src={img7}
              loading="lazy"
              decoding="async"
              alt=""
              className="w-full aspect-square object-cover rounded-[10px] shadow-photo transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>

          <a
            className={`group absolute right-0 top-0 w-[49%] sm:static sm:w-auto sm:-translate-y-4 transition-all duration-500 ${
              activeImage === "img2"
                ? "z-[50]"
                : "z-10"
            }`}
            onClick={() => setActiveImage("img2")}
          >
            <img
              src={img2}
              loading="lazy"
              decoding="async"
              alt=""
              className="w-full aspect-[3/4] object-cover rounded-[10px] shadow-photo transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>

          <a
            className={`group absolute left-[13%] bottom-0 w-[74%] sm:static sm:w-auto sm:translate-y-6 sm:rotate-3 sm:hover:rotate-0 transition-all duration-500 ${
              activeImage === "img8"
                ? "z-[50]"
                : "z-20"
            }`}
            onClick={() => setActiveImage("img8")}
          >
            <img
              src={img8}
              loading="lazy"
              decoding="async"
              alt=""
              className="w-full aspect-square object-cover rounded-[10px] shadow-photo transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>
        </div>
      </div>
    </section>
  );
}