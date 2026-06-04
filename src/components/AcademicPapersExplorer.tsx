import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck,
  Brain, 
  Sparkles, 
  TrendingUp, 
  Download, 
  Award,
  Loader2,
  Calendar,
  Users,
  GitBranch,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  pdfUrl: string;
  source: string;
  citationCount: number;
}

export default function AcademicPapersExplorer() {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Backed-up bookmark collections for student studies
  const [bookmarks, setBookmarks] = useState<Record<string, Paper>>({});
  
  // Selected paper analysis state
  const [analyzedPaper, setAnalyzedPaper] = useState<Paper | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);

  // Initialize with academic standard topics
  useEffect(() => {
    handleSearch("transformers deep learning");
    // Load local storage bookmarks if any
    try {
      const stored = localStorage.getItem("scholastic_bookmarks");
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/papers/search?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error("Unable to parse federated open access indexes. Try again later.");
      }
      const data = await response.json();
      setPapers(data.papers || []);
    } catch (err: any) {
      setError(err.message || "An expected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = (paper: Paper) => {
    const next = { ...bookmarks };
    if (next[paper.id]) {
      delete next[paper.id];
    } else {
      next[paper.id] = paper;
    }
    setBookmarks(next);
    localStorage.setItem("scholastic_bookmarks", JSON.stringify(next));
  };

  const handleAnalyzePaper = async (paper: Paper) => {
    setAnalyzedPaper(paper);
    setAiAnalysis("");
    setAnalyzing(true);
    
    try {
      const response = await fetch("/api/papers/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          authors: paper.authors,
          year: paper.year,
          source: paper.source
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to get deep technical synthesis.");
      }
      
      const data = await response.json();
      setAiAnalysis(data.synthesis || "No synthesis received from academic core.");
    } catch (err: any) {
      setAiAnalysis("Analysis server returned brief timeout. Reconnection attempts pending...\n\n" + (err.message || ""));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-2xl border border-violet-900/30 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent opacity-70" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>arXiv & Semantic Scholar Federated Portal</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight">Academic Open Papers Locator</h1>
            <p className="text-xs text-zinc-350 leading-relaxed font-sans">
              Search millions of open-access academic publications, computer science papers, bioRxiv articles, and mathematical theorems. Map scientific literature into synthesis structures instantly with on-demand intelligence.
            </p>
          </div>
          <div className="flex md:self-center">
            <FileText className="w-16 h-16 text-violet-800 dark:text-violet-750/30 absolute right-4 top-4 md:static md:opacity-100" />
          </div>
        </div>
      </div>

      {/* Control Panel Deck */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
        {/* Search Field */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="papers-search-input"
              type="text"
              placeholder="Search across arXiv, Semantic Scholar, BioRxiv and ACM (e.g., Attention is all you need, Adam Optimizer...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 font-sans text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
          <button
            id="papers-search-btn"
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="px-5 py-2 bg-violet-650 dark:bg-violet-600 text-white font-sans font-bold text-xs rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search Publications</span>
          </button>
        </div>

        {/* Preset academic search vectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wide">Popular Scientific Tracks:</span>
          {["Transformers", "Reinforcement Learning", "Diffusion Models", "Quantum Computing", "Graph Neural Networks"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-500/10 hover:text-violet-400 border border-zinc-200 dark:border-zinc-800 dark:hover:border-violet-500/20 text-zinc-700 dark:text-zinc-300 rounded text-[11px] transition-all font-sans"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Deck */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>Search interface failed: {error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
            <Brain className="w-5 h-5 text-violet-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-400 font-mono text-center">Aggregating arXiv & Semantic Scholar citation indexes in parallel...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper, idx) => (
            <motion.div
              id={`paper-row-${paper.id}`}
              key={paper.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between gap-4 relative group hover:border-violet-500/30 transition-all duration-300 shadow-sm hover:shadow"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 pr-4">
                    <h3 className="font-sans font-bold text-zinc-800 dark:text-zinc-100 text-[14px] leading-snug tracking-tight">
                      {paper.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-350">
                        <Users className="w-3 h-3 text-zinc-400" />
                        {paper.authors.slice(0, 4).join(", ") + (paper.authors.length > 4 ? " et al." : "")}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700 font-normal">|</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {paper.year}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700 font-normal">|</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold tracking-wide uppercase">
                        {paper.source}
                      </span>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleToggleBookmark(paper)}
                    className="p-1 px-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:text-violet-500 hover:border-violet-500/30 transition-colors flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/45 text-zinc-400"
                  >
                    {bookmarks[paper.id] ? (
                      <BookmarkCheck className="w-4 h-4 text-violet-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                  {paper.abstract}
                </p>
              </div>

              {/* Card Actions Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-850/50 pt-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{paper.citationCount.toLocaleString()} Citations</span>
                  </span>
                  
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-500 dark:text-violet-400 hover:underline flex items-center gap-1 py-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Link</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAnalyzePaper(paper)}
                    className="px-3.5 py-1.5 bg-violet-650 dark:bg-violet-600 text-white font-bold text-[11px] hover:opacity-90 rounded flex items-center gap-1 font-sans active:scale-95 transition-all w-full sm:w-auto justify-center"
                  >
                    <Sparkles className="w-3 h-3 text-violet-300 animate-pulse" />
                    <span>Analyze with Gemini</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {papers.length === 0 && !loading && (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <FileText className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">No indexed scientific materials matched this query.</p>
            </div>
          )}
        </div>
      )}

      {/* Bookmarked Papers Subsection */}
      {Object.values(bookmarks).length > 0 && !loading && (
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-violet-500" />
            <h2 className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">
              My Academic Saved Library ({Object.values(bookmarks).length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(bookmarks).map((paper) => (
              <div 
                key={paper.id + "_save"}
                className="p-4 bg-zinc-550/5 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-[12.5px] font-sans font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                    {paper.title}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {paper.authors[0]} et al. • {paper.year} • {paper.source}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-zinc-100 dark:border-zinc-850/30">
                  <span className="text-zinc-400 font-bold">{paper.citationCount} Citations</span>
                  <div className="flex items-center gap-2">
                    {paper.pdfUrl && (
                      <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="text-violet-500 hover:underline">
                        File Link
                      </a>
                    )}
                    <button 
                      onClick={() => handleToggleBookmark(paper)} 
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep Analytical Analysis Drawer */}
      <AnimatePresence>
        {analyzedPaper && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnalyzedPaper(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 h-full relative z-10 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono uppercase bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded font-bold">
                    {analyzedPaper.source} • {analyzedPaper.year}
                  </span>
                  <h2 className="font-sans font-bold text-zinc-900 dark:text-zinc-150 text-sm md:text-md tracking-tight leading-tight line-clamp-2">
                    {analyzedPaper.title}
                  </h2>
                </div>
                <button
                  onClick={() => setAnalyzedPaper(null)}
                  className="p-1 px-3 text-xs border border-zinc-200 dark:border-zinc-800 font-mono text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded bg-white dark:bg-zinc-950 transition-colors shrink-0 ml-4"
                >
                  Close
                </button>
              </div>

              {/* Content Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2">Authors list</h4>
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 font-sans font-semibold">
                    {analyzedPaper.authors.join(", ")}
                  </p>
                </div>

                <div className="space-y-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                  <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Metadata Synopsis</h4>
                  <p className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                    {analyzedPaper.abstract}
                  </p>
                </div>

                {/* Analytical synthesis generated block */}
                <div className="space-y-3 border-t border-zinc-150 dark:border-zinc-800 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-violet-500" />
                      <span>Gemini Technical Synthesis</span>
                    </h4>
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider font-bold">
                      deep study insights
                    </span>
                  </div>

                  {analyzing ? (
                    <div className="py-20 text-center font-mono text-[11px] text-violet-500 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                      <span>Scholastic engine parsing abstract formulas...</span>
                    </div>
                  ) : (
                    <div className="p-5 bg-gradient-to-r from-violet-50/20 to-transparent dark:from-violet-950/10 dark:to-transparent border border-violet-500/10 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap space-y-3 prose prose-sm dark:prose-invert">
                      {aiAnalysis}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer footer link */}
              {analyzedPaper.pdfUrl && (
                <div className="p-4 border-t border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono">Need full publication?</span>
                  <a
                    href={analyzedPaper.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 px-3 bg-violet-650 hover:opacity-90 text-white font-sans font-bold flex items-center gap-1 rounded transition-colors"
                  >
                    <span>Fetch PDF Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
