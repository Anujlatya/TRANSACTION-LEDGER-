export default function BackgroundEffects() {
  return (
    <>
      {/* Main Background */}

      <div className="absolute inset-0 -z-50 overflow-hidden bg-[#050816]">

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
            backgroundSize: "45px 45px",
          }}
        />

        {/* Aurora */}

        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-700 via-cyan-500 to-blue-600 opacity-20 blur-[180px] animate-pulse" />

        {/* Orb 1 */}

        <div className="absolute left-16 top-40 h-72 w-72 rounded-full bg-violet-600/30 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />

        {/* Orb 2 */}

        <div className="absolute right-20 top-24 h-80 w-80 rounded-full bg-cyan-500/30 blur-[120px] animate-[float_10s_ease-in-out_infinite]" />

        {/* Orb 3 */}

        <div className="absolute bottom-10 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[150px] animate-[float_12s_ease-in-out_infinite]" />

        {/* Small Lights */}

        <div className="absolute left-24 top-24 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_25px_10px_rgba(34,211,238,.8)]" />

        <div className="absolute right-32 top-72 h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_25px_10px_rgba(167,139,250,.8)]" />

        <div className="absolute bottom-24 left-40 h-2 w-2 rounded-full bg-white shadow-[0_0_20px_8px_white]" />

        <div className="absolute bottom-40 right-40 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_8px_cyan]" />
      </div>

      {/* Floating Animation */}

      <style>{`

        @keyframes float {

            0%{
                transform:translateY(0px);
            }

            50%{
                transform:translateY(-25px);
            }

            100%{
                transform:translateY(0px);
            }

        }

      `}</style>
    </>
  );
}