/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Eye, EyeOff, Zap, Palette, Flame } from "lucide-react";

type PaletteId = "neon" | "aurora" | "magma";
type SpeedId = "slow" | "medium" | "fast";

export default function LavaLampBackground() {
  const [isActive, setIsActive] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState<PaletteId>("neon");
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedId>("medium");
  const [isOpenDeck, setIsOpenDeck] = useState(false);

  if (!isActive) {
    return (
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsActive(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-300 bg-zinc-900 border border-zinc-700/80 rounded-full transition-all shadow-md hover:border-indigo-500 active:scale-95"
          title="Enable Lava Lamp Active Flow Focus Visuals"
        >
          <Eye className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Enable ADHD Focus Lamp</span>
        </button>
      </div>
    );
  }

  // Speed multiplier mappings (adjust animation durations)
  const speedMultipliers = {
    slow: 1.5,
    medium: 0.8,
    fast: 0.45,
  };

  const currentMultiplier = speedMultipliers[selectedSpeed];

  // Neon, Cosmic Aurora, and Magma palettes with higher contrast and vibrancy (using higher opacities e.g., 25% - 45%)
  const colorPalettes: Record<PaletteId, string[]> = {
    neon: [
      "from-fuchsia-500/35 to-violet-600/25",
      "from-cyan-400/40 to-indigo-600/20",
      "from-pink-500/35 to-rose-600/25",
      "from-violet-500/40 to-fuchsia-600/25",
      "from-sky-400/35 to-blue-600/20",
      "from-purple-600/40 to-pink-500/25",
      "from-cyan-500/40 to-violet-500/20",
    ],
    aurora: [
      "from-emerald-400/35 to-teal-600/25",
      "from-cyan-400/40 to-emerald-600/20",
      "from-teal-300/35 to-cyan-500/25",
      "from-emerald-500/35 to-indigo-600/25",
      "from-lime-400/35 to-teal-600/20",
      "from-cyan-500/40 to-emerald-600/25",
      "from-teal-400/40 to-blue-600/20",
    ],
    magma: [
      "from-red-500/40 to-orange-600/25",
      "from-amber-400/45 to-red-650/20",
      "from-orange-500/40 to-pink-600/25",
      "from-rose-500/35 to-yellow-500/25",
      "from-red-600/40 to-rose-700/25",
      "from-orange-400/45 to-amber-600/20",
      "from-amber-500/40 to-red-600/25",
    ],
  };

  const activeGradients = colorPalettes[selectedPalette];

  // Base configurations of original droplets
  const baseDroplets = [
    { id: 1, size: 100, xStart: "8%", xEnd: "25%", baseDuration: 28, delay: 0 },
    { id: 2, size: 140, xStart: "28%", xEnd: "18%", baseDuration: 34, delay: 1 },
    { id: 3, size: 85, xStart: "48%", xEnd: "56%", baseDuration: 22, delay: 3 },
    { id: 4, size: 120, xStart: "68%", xEnd: "60%", baseDuration: 30, delay: 0.5 },
    { id: 5, size: 90, xStart: "88%", xEnd: "80%", baseDuration: 26, delay: 4 },
    { id: 6, size: 160, xStart: "16%", xEnd: "35%", baseDuration: 38, delay: 2 },
    { id: 7, size: 80, xStart: "58%", xEnd: "40%", baseDuration: 25, delay: 1.5 },
  ];

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
          
          <button
            onClick={() => setIsActive(false)}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900/90 border border-zinc-800 rounded-full transition-colors"
            title="Hide Background Simulation"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>

        {isOpenDeck && (
          <div className="w-60 bg-[#121420]/95 border border-indigo-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in space-y-3.5 text-left">
            <h4 className="text-[10px] font-mono font-bold tracking-widest text-indigo-300 uppercase border-b border-indigo-500/20 pb-1.5 flex items-center justify-between">
              <span>Stimulation Matrix</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded uppercase">Interactive</span>
            </h4>

            {/* COLOR MATRIX SECTOR */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <Palette className="w-3 h-3 text-sky-400" />
                <span>Chromotherapy Mode</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-950/60 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedPalette("neon")}
                  className={`py-1 text-[9px] font-bold rounded uppercase transition-all tracking-wider ${
                    selectedPalette === "neon"
                      ? "bg-indigo-600 text-white font-extrabold shadow"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Neon
                </button>
                <button
                  onClick={() => setSelectedPalette("aurora")}
                  className={`py-1 text-[9px] font-bold rounded uppercase transition-all tracking-wider ${
                    selectedPalette === "aurora"
                      ? "bg-emerald-600 text-white font-extrabold shadow"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Aurora
                </button>
                <button
                  onClick={() => setSelectedPalette("magma")}
                  className={`py-1 text-[9px] font-bold rounded uppercase transition-all tracking-wider ${
                    selectedPalette === "magma"
                      ? "bg-rose-600 text-white font-extrabold shadow"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Magma
                </button>
              </div>
            </div>

            {/* DURATION SPEED SECTOR */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Simulation Pace</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-950/60 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedSpeed("slow")}
                  className={`py-1 text-[9px] font-bold rounded uppercase transition-all ${
                    selectedSpeed === "slow"
                      ? "bg-zinc-850 text-sky-450 border border-sky-500/20 font-extrabold text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Slow
                </button>
                <button
                  onClick={() => setSelectedSpeed("medium")}
                  className={`py-1 text-[9px] font-bold rounded uppercase transition-all ${
                    selectedSpeed === "medium"
                      ? "bg-zinc-850 text-indigo-400 border border-indigo-500/20 font-extrabold text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedSpeed("fast")}
                  className={`py-1 text-[9px] font-bold rounded uppercase transition-all ${
                    selectedSpeed === "fast"
                      ? "bg-gradient-to-r from-violet-600 to-rose-600 text-white font-extrabold shadow animate-pulse"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="High frequency contrast simulation to hold ADHD visual focus"
                >
                  Highly Activating
                </button>
              </div>
            </div>

            <div className="text-[9px] font-mono text-zinc-500 leading-normal border-t border-zinc-800 pt-2 text-center flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Goo filter dynamically compiled</span>
            </div>
          </div>
        )}
      </div>

      {/* Lava Lamp Stage Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* SVG Liquid Goo Filter */}
        <svg className="absolute w-0 h-0 invisible">
          <defs>
            <filter id="lava-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9"
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
          {baseDroplets.map((drop, index) => {
            const calculatedDuration = drop.baseDuration * currentMultiplier;
            const gradientClass = activeGradients[index % activeGradients.length];

            return (
              <motion.div
                key={drop.id}
                initial={{ y: "115vh", x: drop.xStart, scale: 0.8 }}
                animate={{
                  y: "-115vh",
                  x: [drop.xStart, drop.xEnd, drop.xStart],
                  scale: [0.8, 1.25, 0.85, 1.2, 0.8],
                }}
                transition={{
                  duration: calculatedDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: drop.delay * currentMultiplier,
                }}
                className={`absolute rounded-full bg-gradient-to-tr ${gradientClass} pointer-events-none`}
                style={{
                  width: `${drop.size}px`,
                  height: `${drop.size}px`,
                  animation: `lava-morph ${calculatedDuration * 0.35}s ease-in-out infinite alternate`,
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
      `}</style>
    </>
  );
}

