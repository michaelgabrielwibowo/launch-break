/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookMarked,
  FileText, 
  Search, 
  BookOpen, 
  Book, 
  Save, 
  Brain, 
  Clock, 
  AlertCircle,
  Gem,
  Gift,
  Award,
  Sparkles,
  Zap
} from "lucide-react";
import { Resource, UserProfile } from "../types";

interface ResourcesExplorerProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  searchString: string;
  onSearchChange: (v: string) => void;
  activeSavedOnly?: boolean;
  user?: UserProfile;
  onUpdateUser?: (updater: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
}

export default function ResourcesExplorer({
  resources,
  setResources,
  searchString,
  onSearchChange,
  activeSavedOnly = false,
  user,
  onUpdateUser
}: ResourcesExplorerProps) {

  const [selectedPaper, setSelectedPaper] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all"); // all, book, paper, article
  const [personalNote, setPersonalNote] = useState<string>("");
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  
  // Stopwatch Reading Timer state
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Tick the stopwatch every second
  useEffect(() => {
    if (!selectedPaper || !sessionStartTime) return;
    const interval = setInterval(() => {
      setSessionSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedPaper, sessionStartTime]);

  // Filter items
  const filteredList = resources.filter(res => {
    // 1. Saved-only toggle (from sidebar "Saved" click)
    if (activeSavedOnly && !res.isSaved) return false;

    // 2. Type tab filter
    if (activeTab === "book" && res.type !== "Book") return false;
    if (activeTab === "paper" && res.type !== "Research Paper") return false;
    if (activeTab === "article" && res.type !== "Article" && res.type !== "Video Course") return false;

    // 3. Search filter
    if (searchString) {
      const query = searchString.toLowerCase();
      return (
        res.title.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query) ||
        res.category.toLowerCase().includes(query) ||
        res.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Toggle bookmark / saved state
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click
    setResources(prev =>
      prev.map(res => {
        if (res.id === id) {
          return { ...res, isSaved: !res.isSaved };
        }
        return res;
      })
    );
  };

  const handleOpenReader = (res: Resource) => {
    setSelectedPaper(res);
    setPersonalNote(savedNotes[res.id] || "");
    setSessionSeconds(0);
    setSessionStartTime(Date.now());
  };

  const handleCloseReader = () => {
    if (selectedPaper && sessionStartTime && onUpdateUser) {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      if (elapsed > 0) {
        onUpdateUser(prev => {
          const currentTimes = prev.readingTimes || {};
          const currentElapsed = currentTimes[selectedPaper.id] || 0;
          return {
            ...prev,
            readingTimes: {
              ...currentTimes,
              [selectedPaper.id]: currentElapsed + elapsed
            }
          };
        });
      }
    }
    setSelectedPaper(null);
    setSessionStartTime(null);
    setSessionSeconds(0);
  };

  const handleSaveNotes = () => {
    if (!selectedPaper) return;
    setSavedNotes(prev => ({
      ...prev,
      [selectedPaper.id]: personalNote
    }));
    alert("System Cache: Academic notes saved securely contextually!");
  };

  // Gamified Pro-only extension rewards math
  const totalStudySeconds = Object.values(user?.readingTimes || {}).reduce((a, b) => a + b, 0);
  const targetRequiredPerClaim = 120; // 120 seconds of document study unlocks a reward!
  const premiumProgress = totalStudySeconds % targetRequiredPerClaim;
  const lifetimeEarnedRewards = Math.floor(totalStudySeconds / targetRequiredPerClaim);
  const claimedRewards = user?.claimedRewardDays || 0;
  const unwonRewardClaims = lifetimeEarnedRewards - claimedRewards;

  const handleClaimReward = () => {
    if (!user?.isPro) return;
    if (unwonRewardClaims <= 0) return;
    
    if (onUpdateUser) {
      onUpdateUser(prev => ({
        ...prev,
        claimedRewardDays: (prev.claimedRewardDays || 0) + 1
      }));
      alert(`Success! You have claimed a +7 Day Premium Extension Reward points. Saved to your profile!`);
    }
  };

  const formatTimerString = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Rewards Center Widget */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-600/10 to-indigo-900/10 border border-amber-500/20 dark:border-amber-400/10 p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              {user?.isPro ? (
                <Gem className="w-5 h-5 text-amber-500 animate-pulse" />
              ) : (
                <Gift className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-sans font-extrabold text-neutral-850 dark:text-amber-100 flex items-center gap-1.5 uppercase tracking-wide">
                <span>Developer Extension rewards</span>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-zinc-800 border border-amber-400/30 text-amber-400 rounded-full">
                  PRO ONLY
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                {user?.isPro
                  ? `Claim premium workspace extension days by studying and analyzing documentation files.`
                  : "Upgrade component limits to Pro to claim free developer extensions per study hour!"}
              </p>
            </div>
          </div>

          {/* Progress bar visual for studying matching duolingo style */}
          <div className="space-y-1.5 max-w-md pt-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
              <span>Study Progress towards Claim</span>
              <span>{premiumProgress}s / {targetRequiredPerClaim}s</span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (premiumProgress / targetRequiredPerClaim) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            Unclaimed Extensions
          </span>
          <span className="text-2xl font-bold font-mono text-amber-500">
            {user?.isPro ? unwonRewardClaims : 0}
          </span>
          
          <button
            onClick={handleClaimReward}
            disabled={!user?.isPro || unwonRewardClaims <= 0}
            className={`w-full px-4 py-2 font-mono text-[11px] font-bold uppercase rounded-lg border tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              user?.isPro && unwonRewardClaims > 0
                ? "bg-amber-500 hover:bg-amber-600 text-black border-amber-500 hover:scale-103 shadow-lg shadow-amber-500/15"
                : "bg-zinc-100/50 dark:bg-zinc-850/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{user?.isPro ? "Claim +7 Days" : "Pro Locked"}</span>
          </button>
        </div>
      </div>

      {/* Header bar and filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eceef0] dark:border-zinc-800 pb-4">
        <div>
          <h2 className="font-sans text-md font-bold text-black dark:text-white flex items-center gap-2">
            <span>{activeSavedOnly ? "Saved References & Syllabus" : "Curated Curriculums & Libraries"}</span>
            <span className="px-2 py-0.5 text-[9px] bg-sky-500/10 border border-sky-450 text-sky-400 rounded-full font-mono">
              ★ {totalStudySeconds}s Study Time Accrued
            </span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
            Quickly preview textbook volumes, scientific publications, and tutorials.
          </p>
        </div>

        {/* Resources categories tab controls */}
        <div className="flex items-center gap-1 bg-[#f2f4f6] dark:bg-zinc-900 border border-[#c4c7c7] dark:border-zinc-800 p-1 rounded font-mono text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "all" ? "bg-white dark:bg-zinc-800 text-black dark:text-white font-bold" : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "book" ? "bg-white dark:bg-zinc-800 text-black dark:text-white font-bold" : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            Books ({resources.filter(r => r.type === "Book" && (!activeSavedOnly || r.isSaved)).length})
          </button>
          <button
            onClick={() => setActiveTab("paper")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "paper" ? "bg-white dark:bg-zinc-800 text-black dark:text-white font-bold" : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            Papers ({resources.filter(r => r.type === "Research Paper" && (!activeSavedOnly || r.isSaved)).length})
          </button>
          <button
            onClick={() => setActiveTab("article")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "article" ? "bg-white dark:bg-zinc-800 text-black dark:text-white font-bold" : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            Tutorials / Videos
          </button>
        </div>
      </div>

      {/* Grid displays */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No matching resources found. Try altering active search strings!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((res) => (
            <div
              key={res.id}
              onClick={() => handleOpenReader(res)}
              className="bg-white dark:bg-zinc-900 border border-[#eceef0] dark:border-zinc-800 rounded-lg p-5 hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-350 font-mono text-[10px] rounded">
                    {res.type}
                  </span>
                  
                  {/* Bookmark Toggle Icon */}
                  <button
                    onClick={(e) => handleToggleBookmark(res.id, e)}
                    className="p-1 rounded text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 active:scale-90 transition-all"
                  >
                    <BookMarked 
                      className={`w-4 h-4 ${res.isSaved ? "fill-amber-500 text-amber-500" : ""}`} 
                    />
                  </button>
                </div>

                <h3 className="font-sans text-sm font-bold text-black dark:text-white mb-2 leading-snug line-clamp-2">
                  {res.title}
                </h3>
                <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="mt-5 border-t border-[#eceef0] dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-350">
                  {res.category}
                </span>
                
                <div className="flex flex-col items-end gap-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    Level: {res.estimatedTime}
                  </span>
                  {user?.readingTimes?.[res.id] !== undefined && user.readingTimes[res.id] > 0 && (
                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5">
                      ★ {user.readingTimes[res.id]}s studied
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Academic split-screen Reader Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end animate-fade-in pointer-events-auto">
          <div className="w-full max-w-4xl h-full bg-white dark:bg-zinc-900 shadow-xl flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-800 text-left">
            
            {/* Header bar hosting the StopWatch */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div className="truncate pr-4">
                <span className="font-mono text-[10px] bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  {selectedPaper.type}
                </span>
                <h3 className="font-sans font-bold text-sm text-black dark:text-white truncate mt-1">
                  {selectedPaper.title}
                </h3>
              </div>
              
              {/* Dynamic Reading Timer clock */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-mono font-bold rounded-full">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>ANALYSIS TIME: {formatTimerString(sessionSeconds)}</span>
                </div>
                
                <button
                  onClick={handleCloseReader}
                  className="p-1 px-3 rounded border border-zinc-300 dark:border-zinc-800 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-[#f8fafc] hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                  Close & Save Time
                </button>
              </div>
            </div>

            {/* Split layout: Actual summaries / reading on left, personal notes on right */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 h-full overflow-hidden bg-slate-50 dark:bg-[#07090e]">
              
              {/* Left PDF / Document contents preview pane */}
              <div className="md:col-span-3 p-6 h-full overflow-y-auto border-r border-[#eceef0] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                <h4 className="font-sans font-bold text-black dark:text-white text-md border-b border-zinc-200 dark:border-zinc-850 pb-1 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-indigo-400" />
                  <span>Interactive Academic Summary</span>
                </h4>

                <div className="prose prose-zinc dark:prose-invert font-sans text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-4">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                    <span>Syllabus Level: {selectedPaper.level} • Estimated Time: {selectedPaper.estimatedTime}</span>
                  </p>

                  <p>
                    Below is the core synthesized transcript of <strong>{selectedPaper.title}</strong>, prepared by Learning Launchpad's expert system:
                  </p>

                  <div className="p-4 bg-[#f2f4f6] dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-850 font-sans text-xs text-zinc-830 dark:text-zinc-350 space-y-3">
                    <p className="font-bold border-b border-zinc-300 dark:border-zinc-800 pb-1 text-black dark:text-amber-100 uppercase tracking-wide font-mono text-[10px]">
                      Section 1.0 - Abstract Synthesis
                    </p>
                    <p>
                      This text focuses on fundamental modeling constraints. When dealing with "{selectedPaper.category}", the major operational efficiency is driven by structural hyperparameters, regularizations, and loss coefficient balance.
                    </p>
                    <p>
                      In computational implementation parameters, optimal gradient distributions require scaling values appropriately before weights are fully evaluated. Over-parameterization on high dimensional datasets often results in severe localized overfitting.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Key Analytical Takeaways:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use regular expressions or tokenization matrices to formulate base parameters.</li>
                      <li>In high-dimensional targets, distance metrics collapse, causing extreme data isolation.</li>
                      <li>Lasso L1 driving feature coefficients to exact zero performs contextual automatic selections.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-250 dark:border-yellow-900 rounded text-yellow-850 dark:text-yellow-400 text-xs flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Always ensure vector representations maintain orthogonal dimensions during initial projection matrix calculations to prevent feature contamination.</span>
                  </div>
                </div>
              </div>

              {/* Right Workspace notepad */}
              <div className="md:col-span-2 p-6 bg-zinc-50 dark:bg-zinc-950 h-full flex flex-col justify-between">
                <div className="space-y-4 flex-1 flex flex-col">
                  <h4 className="font-sans font-bold text-black dark:text-white text-md flex items-center gap-1.5">
                    <Brain className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                    <span>Workspace Notes</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-sans">
                    Notes are stored dynamically contextualized to {selectedPaper.title}.
                  </p>
                  
                  <textarea
                    className="w-full flex-1 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-xs text-black dark:text-[#f8fafc] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Type personal formulas, key points, or checklist drafts here..."
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                  <button
                    onClick={handleSaveNotes}
                    className="w-full py-2 bg-black dark:bg-zinc-850 hover:bg-zinc-900 dark:hover:bg-zinc-750 text-white dark:text-amber-100 font-mono text-xs font-semibold rounded hover:opacity-90 flex items-center justify-center gap-2 transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Lecture Notes
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
