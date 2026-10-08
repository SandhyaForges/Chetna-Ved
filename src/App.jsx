import Petals from "./components/Petals";
import Hero from "./components/Hero";
import Countdown from "./components/Countdown";
import OurStory from "./components/OurStory";
import CherishedMoments from "./components/CherishedMoments";
import LoveQuote from "./components/LoveQuote";
import RitualsTimeline from "./components/RitualsTimeline";
import Gallery from "./components/Gallery";
import Forever from "./components/Forever";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative">
      {/* soft ambient background texture, sits behind all sections */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 10%, rgba(233,185,182,0.25), transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(201,161,90,0.15), transparent 45%)
          `,
        }}
      />

      <Petals />

      <Hero />
      <Countdown weddingDate="2026-04-20T00:00:00" />
      <OurStory />
      <CherishedMoments />
      <LoveQuote />
      <RitualsTimeline />
      <Gallery />
      <Forever />
      <Footer />
    </div>
  );
}
