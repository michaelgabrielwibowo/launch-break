import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Search, 
  Star, 
  GitFork, 
  BookOpen, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Sparkles, 
  ShieldAlert,
  FolderGit2,
  FileText,
  Bookmark,
  Loader2,
  Code
} from "lucide-react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  open_issues_count: number;
  created_at: string;
}

const PRESET_REPOS = [
  { owner: "google", repo: "generative-ai-js", title: "google/generative-ai-js", desc: "Official JavaScript/TypeScript SDK for the Gemini API." },
  { owner: "huggingface", repo: "transformers", title: "huggingface/transformers", desc: "State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX." },
  { owner: "facebookresearch", repo: "pytorch", title: "facebookresearch/pytorch", desc: "Tensors and Dynamic neural networks in Python with strong GPU acceleration." },
  { owner: "tensorflow", repo: "tensorflow", title: "tensorflow/tensorflow", desc: "An Open Source Machine Learning Framework for Everyone." },
  { owner: "jax-ml", repo: "jax", title: "google/jax", desc: "Autograd and XLA, brought together for high-performance machine learning research." }
];

export default function GitHubSearchTool() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Repo details modal/drawer state
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [readme, setReadme] = useState<string>("");
  const [loadingReadme, setLoadingReadme] = useState(false);
  
  // AI synthesis of the repository codebase
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Load a defaulted query on page load
  useEffect(() => {
    handleSearch("machine learning");
  }, []);

  const handleSearch = async (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/github/search?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error("Failed to search GitHub repositories. Rate limit exceeded or API offline.");
      }
      const data = await response.json();
      setResults(data.items || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRepo = async (repo: Repository) => {
    setSelectedRepo(repo);
    setReadme("");
    setAiAnalysis("");
    setLoadingReadme(true);
    
    try {
      const res = await fetch(`/api/github/readme?owner=${repo.owner.login}&repo=${repo.name}`);
      if (res.ok) {
        const data = await res.json();
        setReadme(data.readme || "No README content found.");
      } else {
        setReadme("Could not download README documentation for this repository.");
      }
    } catch {
      setReadme("Could not load README file.");
    } finally {
      setLoadingReadme(false);
    }
  };

  const handleGenerateAiAnalysis = async (repo: Repository) => {
    setAnalyzing(true);
    setAiAnalysis("");
    try {
      const promptText = `Analyze the repository "${repo.full_name}" (Primary language: ${repo.language || "Unknown"}). Description: "${repo.description}". Based on standard computer science principles, provide a concise guide explaining:
1. What mathematical/statistical frameworks are likely simulated in this codebase.
2. How this code structure maps to learning tracks (like neural networks, algorithms, numerical optimizers).
Keep it dense, structure in absolute technical detail with markdown.`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          context: { activeTab: "github" }
        })
      });
      
      const data = await response.json();
      if (data.text) {
        setAiAnalysis(data.text);
      } else {
        setAiAnalysis("Failed to parse analysis insights from scholastic model.");
      }
    } catch {
      setAiAnalysis("Unsuccessful connection with the core model. Check API key configurations.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
              <FolderGit2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Code Repository Linker</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight">GitHub Code Analyzer</h1>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Connect directly with source control. Search, review documentation, mapping libraries directly into foundational math concepts, and synthesize architectural structures using Gemini.
            </p>
          </div>
          <div className="flex md:self-center">
            <Github className="w-16 h-16 text-zinc-800 dark:text-zinc-700/50 absolute right-4 top-4 md:static md:opacity-100" />
          </div>
        </div>
      </div>

      {/* Control Search Deck */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
        {/* Search Field */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="github-search-input"
              type="text"
              placeholder="Search repositories (e.g., scikit-learn, transformers, jax, numpy...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 font-sans text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            id="github-search-btn"
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black font-sans font-bold text-xs rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search GitHub</span>
          </button>
        </div>

        {/* Quick Presets Search */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wide">Featured Libraries:</span>
          {PRESET_REPOS.map((preset) => (
            <button
              key={preset.repo}
              onClick={() => {
                setQuery(preset.repo);
                handleSearch(preset.repo);
              }}
              className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-500/10 hover:text-indigo-400 border border-zinc-200 dark:border-zinc-800 dark:hover:border-indigo-500/20 text-zinc-700 dark:text-zinc-300 rounded text-[11px] transition-all flex items-center gap-1 font-mono"
            >
              <Code className="w-3 h-3 text-zinc-400" />
              <span>{preset.repo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Deck */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>Error loading search results: {error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <Github className="w-5 h-5 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-400 font-mono">Querying GitHub public repositories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((repo, idx) => (
            <motion.div
              id={`repo-card-${repo.id}`}
              key={repo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
              onClick={() => handleOpenRepo(repo)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 hover:shadow-lg dark:hover:shadow-indigo-500/5 p-5 rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-[190px] relative group overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full group-hover:scale-125 transition-transform duration-500" />

              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  {/* Language Dot */}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ 
                        backgroundColor: 
                          repo.language === "TypeScript" ? "#3178c6" :
                          repo.language === "Python" ? "#3572A5" :
                          repo.language === "C++" ? "#f34b7d" :
                          repo.language === "JavaScript" ? "#f1e05a" : "#10b981"
                      }}
                    />
                    {repo.language || "Unknown"}
                  </span>
                  {/* External Hub */}
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-400 hover:text-black dark:hover:text-white p-1 hover:bg-zinc-150 rounded transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <img 
                    src={repo.owner.avatar_url} 
                    alt={repo.owner.login} 
                    className="w-5 h-5 rounded-full border border-zinc-200 dark:border-zinc-800" 
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="font-sans font-bold text-zinc-800 dark:text-zinc-150 text-[13px] tracking-tight truncate flex-1 hover:underline">
                    {repo.full_name}
                  </h3>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 font-sans leading-relaxed">
                  {repo.description || "No description provided."}
                </p>
              </div>

              {/* Badges footer */}
              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-850/50 pt-3 text-[11px] text-zinc-400 font-mono relative z-10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors">
                    <Star className="w-3.5 h-3.5" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{repo.forks_count.toLocaleString()}</span>
                  </span>
                </div>
                <span className="text-[9.5px]/relaxed font-bold tracking-wider text-indigo-500 uppercase flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Analyze</span>
                  <Terminal className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}

          {results.length === 0 && !loading && (
            <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Github className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">No matching repositories found. Try another mathematical or research programming query.</p>
            </div>
          )}
        </div>
      )}

      {/* Repo Details Full Screen Drawer */}
      <AnimatePresence>
        {selectedRepo && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRepo(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar drawer body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 h-full relative z-10 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedRepo.owner.avatar_url} 
                    alt={selectedRepo.owner.login} 
                    className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {selectedRepo.language || "codebase"}
                      </span>
                      <a 
                        href={selectedRepo.html_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10.5px] font-mono text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-0.5 hover:underline"
                      >
                        <span>GitHub url</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <h2 className="font-sans font-bold text-zinc-900 dark:text-zinc-100 text-sm md:text-md tracking-tight leading-tight">
                      {selectedRepo.full_name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRepo(null)}
                  className="p-1 px-3 text-xs border border-zinc-200 dark:border-zinc-800 font-mono text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded bg-white dark:bg-zinc-950 transition-colors"
                >
                  Close (ESC)
                </button>
              </div>

              {/* Scrollable Context Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Statistics panel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-lg text-center font-mono">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Stars</span>
                    <span className="text-sm font-bold text-black dark:text-white mt-1 block">
                      {selectedRepo.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-lg text-center font-mono">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Forks</span>
                    <span className="text-sm font-bold text-black dark:text-white mt-1 block">
                      {selectedRepo.forks_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-lg text-center font-mono">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Open Issues</span>
                    <span className="text-sm font-bold text-rose-500 mt-1 block">
                      {selectedRepo.open_issues_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-3 rounded-lg text-center font-mono">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Age</span>
                    <span className="text-sm font-bold text-black dark:text-white mt-1 block">
                      {new Date(selectedRepo.created_at).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* AI Analysis action console */}
                <div className="bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-transparent dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-transparent border border-indigo-200/50 dark:border-indigo-800/30 p-5 rounded-xl space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-sans font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-row">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>AI Cognitive Architecture Synthesis</span>
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                        Examine the mathematical concepts, numerical regularizers, and algorithms modeled directly under this codebase structure. Powered by Gemini.
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateAiAnalysis(selectedRepo)}
                      disabled={analyzing}
                      className="px-3.5 py-1.5 flex-shrink-0 bg-indigo-600 dark:bg-indigo-500 text-white font-sans text-xs font-bold rounded hover:bg-indigo-500 disabled:opacity-55 transition-colors flex items-center gap-1"
                    >
                      {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
                      <span>Synthesize</span>
                    </button>
                  </div>

                  {analyzing && (
                    <div className="py-4 text-center font-mono text-[10.5px] text-indigo-500 flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing repository structures into computer science tracks...</span>
                    </div>
                  )}

                  {aiAnalysis && (
                    <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-indigo-500/10 text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap space-y-2 max-h-[300px] overflow-y-auto font-sans prose prose-sm dark:prose-invert">
                      {aiAnalysis}
                    </div>
                  )}
                </div>

                {/* README.md code documentation rendering */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-2">
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-zinc-500" />
                      <span>README.md Documentation</span>
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      SOURCE: raw markdown
                    </span>
                  </div>

                  {loadingReadme ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                      <span>Loading raw documentation...</span>
                    </div>
                  ) : (
                    <pre className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-slate-800 dark:text-zinc-350 text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto font-mono scrollbar-thin">
                      {readme}
                    </pre>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
