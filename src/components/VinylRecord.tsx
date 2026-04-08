"use client";

// Framer Motion 없음 — 순수 CSS transform/opacity (GPU 전용)
export default function VinylRecord({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* 글로우 — opacity만 전환 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "0 0 40px rgba(79,70,229,0.5), 0 0 70px rgba(79,70,229,0.2)",
          opacity: isPlaying ? 1 : 0.25,
          transition: "opacity 0.8s ease",
          willChange: "opacity",
        }}
      />

      {/* 바이닐 디스크 — CSS spin */}
      <div
        className="vinyl-record w-full h-full relative overflow-hidden"
        style={{
          animation: isPlaying ? "vinylSpin 4s linear infinite" : "none",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-black text-lg tracking-widest">MBC</span>
          </div>
        </div>
        {[85, 95, 105, 115, 125].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid ${i % 2 === 0 ? "rgba(79,70,229,0.15)" : "rgba(6,182,212,0.15)"}`,
            }}
          />
        ))}
      </div>

      {/* 톤암 — CSS transition */}
      <div
        className="absolute"
        style={{
          top: "10%", right: "5%",
          transformOrigin: "top right",
          transform: `rotate(${isPlaying ? 25 : 15}deg)`,
          transition: "transform 0.8s ease",
        }}
      >
        <div className="w-1 h-20 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400" />
        </div>
      </div>

      {/* 음파 링 — CSS, 재생 중에만 */}
      {isPlaying && (
        <>
          <div className="absolute inset-0 rounded-full border border-indigo-400 wave-ring" />
          <div className="absolute inset-0 rounded-full border border-indigo-400 wave-ring" style={{ animationDelay: "0.7s" }} />
        </>
      )}
    </div>
  );
}
