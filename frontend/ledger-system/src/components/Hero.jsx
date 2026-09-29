import BackgroundEffects from "./BackgroundEffects";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">

      <BackgroundEffects />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <HeroContent />


        </div>

      </div>

    </section>
  );
}