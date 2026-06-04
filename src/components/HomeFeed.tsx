/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Compass, 
  ArrowRight, 
  BookOpen, 
  Bookmark, 
  LineChart, 
  Route, 
  PlusCircle, 
  Clock, 
  Play, 
  FileText,
  Search
} from "lucide-react";
import { ActiveCourse, Resource } from "../types";

interface HomeFeedProps {
  activeCourses: ActiveCourse[];
  setActiveCourses: React.Dispatch<React.SetStateAction<ActiveCourse[]>>;
  searchString: string;
  onSearchChange: (val: string) => void;
  setActiveTab: (tab: string) => void;
  setTopicSearchFilter: (term: string) => void;
  onExploreResource: (res: Resource) => void;
  onSelectTopicById: (id: string) => void;
}

export default function HomeFeed({
  activeCourses,
  setActiveCourses,
  searchString,
  onSearchChange,
  setActiveTab,
  setTopicSearchFilter,
  onExploreResource,
  onSelectTopicById
}: HomeFeedProps) {

  // Search Tag Chips
  const topicChips = [
    "Python",
    "Machine Learning",
    "Operations Research",
    "Statistics",
    "Web Development",
    "Finance",
    "Psychology"
  ];

  // Helper handling course checking percentage increment
  const handleProgressIncrement = (id: string) => {
    setActiveCourses(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextVal = c.progressPercent === 100 ? 0 : Math.min(100, c.progressPercent + 5);
          return {
            ...c,
            progressPercent: nextVal,
            timeRemaining: nextVal === 100 ? "Completed!" : c.timeRemaining
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Hero Section based on mockup 2 design parameters */}
      <section className="flex flex-col items-center justify-center text-center py-12 md:py-16 px-4 glass-banner rounded-3xl border border-white/30 dark:border-white/5 relative overflow-hidden transition-all duration-350">
        {/* Subtle academic background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }}
        ></div>
        
        <div className="z-10 max-w-2xl">
          <h2 className="font-sans text-[26px] md:text-[38px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            Learn anything faster with curated resources.
          </h2>
          <p className="font-sans text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
            Access structured paths, top-tier textbooks, and computer science papers calibrated for technical mastery.
          </p>

          {/* Core dynamic search bar */}
          <div className="relative w-full max-w-lg mx-auto group">
            <SearchInputInsideHero 
              searchString={searchString} 
              onSearchChange={onSearchChange} 
            />
          </div>
        </div>

        {/* Search Helper chips */}
        <div className="z-10 flex flex-wrap justify-center gap-2 mt-8 max-w-2xl">
          {topicChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSearchChange(chip)}
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-[#eceef0] dark:border-zinc-700 hover:border-black dark:hover:border-white rounded-full font-sans text-xs text-zinc-600 dark:text-zinc-350 hover:text-black dark:hover:text-white active:scale-95 transition-all outline-none"
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* Bento Grid Quick Actions */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setActiveTab("topics");
              onSelectTopicById("t1"); // Open ML with custom additions
            }}
            className="flex flex-col items-start justify-between p-5 glass-panel hover:border-white/50 dark:hover:border-white/15 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all text-left h-36"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center transition-transform">
              <PlusCircle className="w-5 h-5 text-zinc-800 dark:text-zinc-205" />
            </div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Create Learning Path
            </h3>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className="flex flex-col items-start justify-between p-5 glass-panel hover:border-white/50 dark:hover:border-white/15 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all text-left h-36"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center">
              <Compass className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            </div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Browse Resources
            </h3>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className="flex flex-col items-start justify-between p-5 glass-panel hover:border-white/50 dark:hover:border-white/15 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all text-left h-36"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-amber-550" />
            </div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Saved Resources
            </h3>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className="flex flex-col items-start justify-between p-5 glass-panel hover:border-white/50 dark:hover:border-white/15 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all text-left h-36"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center">
              <LineChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              My Progress Logs
            </h3>
          </button>
        </div>
      </section>

      {/* Continuation grids and Featured pathways */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Continue Learning Panel */}
        <section className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-[#eceef0] dark:border-zinc-800 pb-2">
            <h2 className="font-sans text-md font-bold text-black dark:text-white">
              Continue Learning
            </h2>
            <button
              onClick={() => setActiveTab("resources")}
              className="font-sans text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {activeCourses.map((course) => {
              const isVideo = course.type.toLowerCase().includes("video");
              return (
                <div
                  key={course.id}
                  className="glass-panel border border-white/20 dark:border-zinc-800/40 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg hover:-translate-y-0.5 transition-all relative overflow-hidden"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5" 
                    style={{ backgroundColor: course.accentColor }}
                  ></div>

                  <div className="flex-1 space-y-2 pl-2 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-zinc-300 rounded text-[10px] font-mono uppercase tracking-wider">
                        {course.type}
                      </span>
                      <span className="text-slate-600 dark:text-zinc-400 text-[10px] font-mono border border-white/20 dark:border-zinc-700/30 px-1.5 rounded">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="font-sans text-md font-bold text-slate-900 dark:text-white leading-tight">
                      {course.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="pt-2 mt-3 border-t border-white/10 dark:border-zinc-800/40 flex items-center justify-between text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {course.timeRemaining}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-zinc-400" />
                          {course.currentModule}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side check increment and progress bar */}
                  <div className="sm:w-1/4 flex flex-col justify-center gap-3 border-t sm:border-t-0 sm:border-l border-[#eceef0] dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-5 text-left">
                    <div>
                      <div className="flex justify-between font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        <span>Completion Rate</span>
                        <span className="font-bold text-black dark:text-white">
                          {course.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${course.progressPercent}%`,
                            backgroundColor: course.accentColor
                          }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleProgressIncrement(course.id)}
                      className="w-full glass-button hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-xl text-slate-800 dark:text-white py-2 font-mono text-xs hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm"
                    >
                      {isVideo ? "Resume Module" : "Continue Reading"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Paths List */}
        <section className="space-y-5 text-left">
          <div className="flex items-center justify-between border-b border-[#eceef0] dark:border-zinc-800 pb-2">
            <h2 className="font-sans text-md font-bold text-black dark:text-white">
              Featured Paths
            </h2>
          </div>

          <div className="space-y-4">
            {/* Path 1 */}
            <div className="glass-panel border border-white/20 dark:border-zinc-800/40 rounded-2xl p-5 hover:shadow-lg hover:border-blue-500/50 group hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-sky-500/10 flex items-center justify-center">
                  <Route className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                </div>
                <span className="bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-white px-2 py-1 rounded text-[10px] font-mono uppercase font-bold border border-white/20 dark:border-zinc-700/20">
                  Curated
                </span>
              </div>
              <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors mb-1">
                Full-Stack React & Node
              </h3>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                From component lifecycle loops to advanced proxy middleware, API structures, and Redis caches.
              </p>
              <button
                onClick={() => {
                  alert("Opening structured route 'Full-Stack React & Node'. Try checking the Resources tab for matching web templates!");
                }}
                className="inline-flex items-center gap-1 font-mono text-xs text-indigo-600 hover:text-indigo-700 dark:text-sky-400 transition-all font-semibold"
              >
                <span>Explore Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Path 2 */}
            <div className="glass-panel border border-white/20 dark:border-zinc-800/40 rounded-2xl p-5 hover:shadow-lg hover:border-amber-500/50 group hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/10 flex items-center justify-center">
                  <Route className="w-4 h-4 text-[#f59e0b]" />
                </div>
              </div>
              <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#f59e0b] transition-colors mb-1">
                Stochastic Processes
              </h3>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                Calibrate Markov chains, Poisson traffic simulations, queuing variables, and stochastic bounds.
              </p>
              <button
                onClick={() => {
                  setActiveTab("topics");
                  onSelectTopicById("t3"); // Jump to Operations Research / Stochastic
                }}
                className="inline-flex items-center gap-1 font-mono text-xs text-indigo-600 hover:text-indigo-700 dark:text-sky-400 transition-all font-semibold"
              >
                <span>Explore Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// Small helper inside Hero search bar
function SearchInputInsideHero({ searchString, onSearchChange }: { searchString: string; onSearchChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        className="w-full pl-11 pr-24 py-3.5 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm text-slate-900 dark:text-white"
        placeholder="What parameters or papers do you want to master?"
        value={searchString}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <span className="font-mono text-[9px] uppercase tracking-wider bg-slate-950/5 dark:bg-white/10 border border-white/20 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-350 px-2 py-1 rounded-xl">
          ⌘ K / Enter
        </span>
      </div>
    </div>
  );
}
