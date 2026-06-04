import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Sparkles, Zap, Palette, Flame, Layers } from "lucide-react";

export default function LavaLampBackground() {
  const [isOpenDeck, setIsOpenDeck] = useState(false);

  // Locked to active pace multiplier
  const currentMultiplier = 0.8;

  // Track the window's live width to map percentage boundaries
  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth : 1200;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute base droplets dynamically categorized into:
  // - Left first 25% (6 nodes, size 50-150)
  // - Middle 25% - 75% (10 nodes, size 50-150)
  // - Right 25% (6 nodes, size 50-150)
  const droplets = useMemo(() => {
    const leftEnd = windowWidth * 0.25;
    const middleStart = windowWidth * 0.25;
    const middleEnd = windowWidth * 0.75;
    const rightStart = windowWidth * 0.75;
    const rightEnd = windowWidth;

    return [
      // --- LEFT ZONE (0% to 25%) ---
      { id: "L1", size: 110, xStart: leftEnd * 0.05, xEnd: leftEnd * 0.75, yStart: "120vh", yEnd: "-120vh", baseDuration: 24, delay: 0, gradient: "linear-gradient(135deg, #ff0055, #ff5000, #ff00aa)" },
      { id: "L2", size: 135, xStart: leftEnd * 0.4, xEnd: leftEnd * 0.95, yStart: "125vh", yEnd: "-125vh", baseDuration: 29, delay: 1.5, gradient: "linear-gradient(135deg, #e11d48, #c084fc, #db2777)" },
      { id: "L3", size: 85, xStart: leftEnd * 0.75, xEnd: leftEnd * 0.15, yStart: "115vh", yEnd: "-115vh", baseDuration: 21, delay: 3.5, gradient: "linear-gradient(135deg, #ec4899, #f43f5e, #d946ef)" },
      { id: "L4", size: 125, xStart: leftEnd * 0.25, xEnd: leftEnd * 0.85, yStart: "65vh", yEnd: "-115vh", baseDuration: 18, delay: 0.8, gradient: "linear-gradient(135deg, #f43f5e, #fda4af, #e11d48)" },
      { id: "L5", size: 60, xStart: leftEnd * 0.12, xEnd: leftEnd * 0.55, yStart: "110vh", yEnd: "-110vh", baseDuration: 22, delay: 4.5, gradient: "linear-gradient(135deg, #ff3366, #ff6633, #ff33aa)" },
      { id: "L6", size: 145, xStart: leftEnd * 0.6, xEnd: leftEnd * 0.3, yStart: "130vh", yEnd: "-130vh", baseDuration: 32, delay: 5.8, gradient: "linear-gradient(135deg, #dc2626, #f43f5e, #db2777)" },

      // --- MIDDLE ZONE (25% to 75%) ---
      { id: "M1", size: 140, xStart: middleStart + (middleEnd - middleStart) * 0.08, xEnd: middleStart + (middleEnd - middleStart) * 0.42, yStart: "115vh", yEnd: "-115vh", baseDuration: 30, delay: 0.3, gradient: "linear-gradient(135deg, #8b5cf6, #ec4899, #10b981)" },
      { id: "M2", size: 95, xStart: middleStart + (middleEnd - middleStart) * 0.25, xEnd: middleStart + (middleEnd - middleStart) * 0.05, yStart: "50vh", yEnd: "-115vh", baseDuration: 19, delay: 4.2, gradient: "linear-gradient(135deg, #3b82f6, #06b6d4, #a855f7)" },
      { id: "M3", size: 150, xStart: middleStart + (middleEnd - middleStart) * 0.48, xEnd: middleStart + (middleEnd - middleStart) * 0.88, yStart: "125vh", yEnd: "-125vh", baseDuration: 34, delay: 1.1, gradient: "linear-gradient(135deg, #ff00aa, #8b5cf6, #06b6d4, #ff5500)" },
      { id: "M4", size: 115, xStart: middleStart + (middleEnd - middleStart) * 0.68, xEnd: middleStart + (middleEnd - middleStart) * 0.22, yStart: "70vh", yEnd: "-115vh", baseDuration: 23, delay: 2.8, gradient: "linear-gradient(135deg, #06b6d4, #10b981, #a855f7)" },
      { id: "M5", size: 75, xStart: middleStart + (middleEnd - middleStart) * 0.85, xEnd: middleStart + (middleEnd - middleStart) * 0.52, yStart: "115vh", yEnd: "-115vh", baseDuration: 20, delay: 5.5, gradient: "linear-gradient(135deg, #10b981, #f59e0b, #06b6d4)" },
      { id: "M6", size: 130, xStart: middleStart + (middleEnd - middleStart) * 0.18, xEnd: middleStart + (middleEnd - middleStart) * 0.78, yStart: "120vh", yEnd: "-120vh", baseDuration: 26, delay: 7.2, gradient: "linear-gradient(135deg, #f43f5e, #a855f7, #ec4899)" },
      { id: "M7", size: 110, xStart: middleStart + (middleEnd - middleStart) * 0.62, xEnd: middleStart + (middleEnd - middleStart) * 0.15, yStart: "115vh", yEnd: "-115vh", baseDuration: 22, delay: 10.1, gradient: "linear-gradient(135deg, #db2777, #4f46e5, #0ea5e9)" },
      { id: "M8", size: 85, xStart: middleStart + (middleEnd - middleStart) * 0.35, xEnd: middleStart + (middleEnd - middleStart) * 0.65, yStart: "130vh", yEnd: "-130vh", baseDuration: 28, delay: 8.5, gradient: "linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)" },
      { id: "M9", size: 145, xStart: middleStart + (middleEnd - middleStart) * 0.55, xEnd: middleStart + (middleEnd - middleStart) * 0.95, yStart: "122vh", yEnd: "-122vh", baseDuration: 32, delay: 11.8, gradient: "linear-gradient(135deg, #e11d48, #f43f5e, #f59e0b)" },
      { id: "M10", size: 65, xStart: middleStart + (middleEnd - middleStart) * 0.72, xEnd: middleStart + (middleEnd - middleStart) * 0.38, yStart: "110vh", yEnd: "-110vh", baseDuration: 21, delay: 6.2, gradient: "linear-gradient(135deg, #10b981, #14b8a6, #06b6d4)" },

      // --- RIGHT ZONE (75% to 100%) ---
      { id: "R1", size: 130, xStart: rightStart + (rightEnd - rightStart) * 0.12, xEnd: rightStart + (rightEnd - rightStart) * 0.78, yStart: "120vh", yEnd: "-120vh", baseDuration: 28, delay: 1.2, gradient: "linear-gradient(135deg, #ec4899, #f43f5e, #f59e0b)" },
      { id: "R2", size: 115, xStart: rightStart + (rightEnd - rightStart) * 0.48, xEnd: rightStart + (rightEnd - rightStart) * 0.08, yStart: "48vh", yEnd: "-115vh", baseDuration: 18, delay: 4.8, gradient: "linear-gradient(135deg, #10b981, #3b82f6, #06b6d4)" },
      { id: "R3", size: 145, xStart: rightStart + (rightEnd - rightStart) * 0.82, xEnd: rightStart + (rightEnd - rightStart) * 0.22, yStart: "115vh", yEnd: "-115vh", baseDuration: 25, delay: 6.8, gradient: "linear-gradient(135deg, #f43f5e, #a855f7, #6366f1)" },
      { id: "R4", size: 95, xStart: rightStart + (rightEnd - rightStart) * 0.08, xEnd: rightStart + (rightEnd - rightStart) * 0.72, yStart: "65vh", yEnd: "-115vh", baseDuration: 21, delay: 9.5, gradient: "linear-gradient(135deg, #6366f1, #d946ef, #ff0055)" },
      { id: "R5", size: 70, xStart: rightStart + (rightEnd - rightStart) * 0.35, xEnd: rightStart + (rightEnd - rightStart) * 0.95, yStart: "110vh", yEnd: "-110vh", baseDuration: 20, delay: 11.2, gradient: "linear-gradient(135deg, #ec4899, #db2777, #7c3aed)" },
      { id: "R6", size: 135, xStart: rightStart + (rightEnd - rightStart) * 0.65, xEnd: rightStart + (rightEnd - rightStart) * 0.18, yStart: "125vh", yEnd: "-125vh", baseDuration: 30, delay: 13.0, gradient: "linear-gradient(135deg, #ff5500, #ff00aa, #ec4899)" },
    ];
  }, [windowWidth]);

  return (
    <>
      {/* Dynamic Simulation Control Deck Panel */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsOpenDeck(!isOpenDeck)}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase font-extrabold tracking-wider font-mono text-white bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/50 rounded-full transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
            title="Configure ADHD Simulation Variables"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>ADHD Flow Controls</span>
          </button>
        </div>

        {isOpenDeck && (
          <div className="w-60 bg-[#121420]/95 border border-indigo-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md space-y-3.5 text-left">
            <h4 className="text-[10px] font-mono font-bold tracking-widest text-indigo-300 uppercase border-b border-indigo-500/20 pb-1.5 flex items-center justify-between">
              <span>Stimulation Matrix</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded uppercase">Active</span>
            </h4>

            {/* COLOR MATRIX STATUS */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <Palette className="w-3 h-3 text-sky-400" />
                <span>Chromotherapy Mode</span>
              </span>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-indigo-500/10 text-[9.5px]/relaxed font-mono text-zinc-300 space-y-1">
                <div className="text-center font-bold uppercase bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
                  Rainbow Active Spectrum
                </div>
                <div className="text-[8px] text-zinc-400 text-center">
                  Live width: {windowWidth}px
                </div>
              </div>
            </div>

            {/* DURATION SPEED STATUS */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Simulation Pace</span>
              </span>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-indigo-500/10">
                <span className="text-[9.5px] font-bold text-zinc-200 block text-center uppercase tracking-wider">
                  ⚡ High-Intensity (Locked)
                </span>
              </div>
            </div>

            {/* COVERAGE RANGE STATUS */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1 flex-row">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>Space distribution</span>
              </span>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-indigo-500/10 space-y-1 text-[8.5px] text-zinc-300 font-mono">
                <div className="flex justify-between">
                  <span>Left (0-25%):</span>
                  <span className="text-pink-400 font-bold">6 nodes</span>
                </div>
                <div className="flex justify-between">
                  <span>Middle (25-75%):</span>
                  <span className="text-purple-400 font-bold">10 nodes</span>
                </div>
                <div className="flex justify-between">
                  <span>Right (75-100%):</span>
                  <span className="text-cyan-400 font-bold">6 nodes</span>
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-zinc-500 leading-normal border-t border-zinc-800 pt-2 text-center flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
              <span>Goo filter dynamically compiled</span>
            </div>
          </div>
        )}
      </div>

      {/* Lava Lamp Stage Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-90 dark:opacity-85">
        
        {/* SVG Liquid Goo Filter - sharp and highly cohesive values for ultra intense merge behavior */}
        <svg className="absolute w-0 h-0 invisible">
          <defs>
            <filter id="lava-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 32 -11"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        {/* Ambient tint overlay mapping */}
        <div className="absolute inset-0 bg-slate-950/10 dark:bg-[#07090e]/30 pointer-events-none" />

        {/* Liquid stage applying the gooey SVG filter */}
        <div className="absolute inset-0 h-full w-full" style={{ filter: "url(#lava-goo)" }}>
          
          {/* Static bottom and top goo bounds - elevated colors */}
          <div className="absolute bottom-[-110px] left-0 right-0 h-[220px] bg-gradient-to-t from-indigo-950/40 via-purple-950/20 to-transparent blur-[25px] rounded-[50%]" />
          <div className="absolute top-[-100px] left-0 right-0 h-[180px] bg-gradient-to-b from-purple-950/30 via-indigo-950/15 to-transparent blur-[20px] rounded-[50%]" />

          {/* Morphing rising droplets */}
          {droplets.map((drop, index) => {
            const calculatedDuration = drop.baseDuration * currentMultiplier;

            return (
              <motion.div
                key={drop.id}
                initial={{ y: drop.yStart, x: drop.xStart, scale: 0, opacity: 0 }}
                animate={{
                  y: drop.yEnd,
                  x: [drop.xStart, drop.xEnd, drop.xStart],
                  scale: [0, 1.4, 1.25, 0.9, 0],
                  opacity: [0, 1, 1, 0.9, 0],
                }}
                transition={{
                  duration: calculatedDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: drop.delay * currentMultiplier,
                }}
                className="absolute rounded-full pointer-events-none shadow-[0_0_35px_rgba(244,63,94,0.15)]"
                style={{
                  width: `${drop.size}px`,
                  height: `${drop.size}px`,
                  background: drop.gradient || "linear-gradient(135deg, #f43f5e, #a855f7, #06b6d4, #10b981, #f59e0b, #f43f5e)",
                  backgroundSize: "400% 400%",
                  animation: `lava-morph ${calculatedDuration * 0.35}s ease-in-out infinite alternate, rainbow-gradient ${12 + (index * 2)}s ease infinite`,
                }}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes lava-morph {
          0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          50% { border-radius: 68% 32% 52% 48% / 60% 41% 60% 40%; }
          100% { border-radius: 41% 59% 41% 59% / 41% 41% 59% 59%; }
        }
        @keyframes rainbow-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
