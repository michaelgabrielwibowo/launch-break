/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Home, 
  BookOpen, 
  FolderGit2, 
  BookMarked, 
  Compass, 
  HelpCircle, 
  Settings, 
  Sparkles, 
  FileText, 
  Code, 
  BarChart3, 
  GraduationCap
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  toggleProModal: () => void;
}

export default function SidebarNav({ activeTab, setActiveTab, user, toggleProModal }: SidebarNavProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "topics", label: "Topics", icon: Compass },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "github", label: "GitHub Tools", icon: FolderGit2 },
    { id: "papers", label: "Papers", icon: FileText },
    { id: "practice", label: "Practice", icon: Code },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "saved", label: "Saved", icon: BookMarked }
  ];

  return (
    <nav className="w-[260px] h-screen fixed left-0 top-0 glass-nav flex flex-col z-50">
      {/* Branding Header */}
      <div className="p-gutter border-b border-white/20 dark:border-zinc-800/40">
        <div className="flex items-center gap-3 mb-6 p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/10">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-slate-900 dark:text-white leading-tight">
              Learning Launchpad
            </h1>
            <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Academic-Tech Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Duolingo style study streak indicator */}
      {user.streakCount !== undefined && user.streakCount > 0 && (
        <div className="mx-4 my-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3">
          <span className="text-xl animate-bounce">🔥</span>
          <div className="text-left">
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 font-sans leading-none">
              {user.streakCount} Day Streak
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Keep reading every day!
            </p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-sans text-[14px] font-medium leading-none text-left border ${
                isActive
                  ? "bg-slate-900/10 dark:bg-white/10 border-white/40 dark:border-white/10 text-slate-900 dark:text-white font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                  : "border-transparent text-slate-600 dark:text-zinc-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-sky-400" : ""}`} />
              <span>{item.label}</span>
              {item.id === "saved" && (
                <span className="ml-auto text-[10px] bg-white/50 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-full border border-white/20 dark:border-zinc-700/20">
                  curated
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Upgrade to Pro Promotion / Bottom Links */}
      <div className="p-4 border-t border-white/20 dark:border-zinc-850/40 space-y-3">
        {!user.isPro ? (
          <div className="p-4 bg-slate-100/80 dark:bg-zinc-900/70 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-purple-800 dark:text-purple-300 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-600 dark:text-purple-400" />
              <span>UPGRADE CURRENTLY FREE</span>
            </div>
            <p className="text-[11px] text-slate-800 dark:text-zinc-200 mb-2.5 leading-relaxed font-normal">
              Unlock live Gemini feedback, detailed paper synthesis & advanced math model sandboxes.
            </p>
            <button
              onClick={toggleProModal}
              className="w-full text-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-sans text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all shadow-md shadow-indigo-600/15"
            >
              Upgrade to Pro
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 text-white rounded-2xl text-center backdrop-blur-sm">
            <p className="text-[11px] font-bold text-purple-300">★ PRO WORKSPACE ACTIVATED</p>
          </div>
        )}

        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-sans text-[13px] text-left border ${
                activeTab === "settings"
                  ? "bg-slate-900/10 dark:bg-white/10 border-white/30 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  : "border-transparent text-slate-600 dark:text-zinc-400 hover:bg-white/30 dark:hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Workspace Settings</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("help")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-sans text-[13px] text-left border ${
                activeTab === "help"
                  ? "bg-slate-900/10 dark:bg-white/10 border-white/30 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  : "border-transparent text-slate-600 dark:text-zinc-400 hover:bg-white/30 dark:hover:bg-white/5"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support & Docs</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
