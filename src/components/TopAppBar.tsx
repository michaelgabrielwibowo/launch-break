/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Bell, History, Sparkles, User, LogOut, Check, Sun, Moon } from "lucide-react";
import { UserProfile } from "../types";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface TopAppBarProps {
  user: UserProfile;
  searchString: string;
  onSearchChange: (val: string) => void;
  setActiveTab: (tab: string) => void;
  systemHealth: { status: string; has_api_key: boolean } | null;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  demoMode: boolean;
  onExitDemo: () => void;
}

export default function TopAppBar({
  user,
  searchString,
  onSearchChange,
  setActiveTab,
  systemHealth,
  isDarkMode,
  setIsDarkMode,
  demoMode,
  onExitDemo
}: TopAppBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 w-full sticky top-0 z-40 bg-white/35 dark:bg-[#07090e]/25 backdrop-blur-[9px] border-b border-white/20 dark:border-zinc-800/25 flex items-center justify-between px-6 transition-all duration-300">
      {/* Search component with auto matching */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search learning resources, academic papers, practices..."
            value={searchString}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 glass-input rounded-xl text-sm text-slate-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {searchString && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-black dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {demoMode && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono rounded-full font-bold uppercase tracking-wider animate-pulse">
            Demo Mode Active
          </span>
        )}
      </div>

      {/* Auxiliary links and user states */}
      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-5">
          <button
            onClick={() => { setActiveTab("home"); onSearchChange(""); }}
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white font-sans text-sm font-medium transition-colors"
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab("help")}
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white font-sans text-sm font-medium transition-colors"
          >
            Mentors
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white font-sans text-sm font-medium transition-colors"
          >
            Labs
          </button>
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-3 border-l border-[#eceef0] dark:border-zinc-800 pl-6 relative">
          {/* System Key Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AI: {systemHealth?.has_api_key ? "Live Gemini" : "Sandbox"}</span>
          </div>

          <button className="p-1.5 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 relative transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>

          <button className="p-1.5 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <History className="w-4.5 h-4.5" />
          </button>

          {/* User Profile avatar dropdown */}
          <div className="relative">
            <button
               onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:opacity-95 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative active:scale-95 transition-transform">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-1.5 text-zinc-600 dark:text-zinc-400" />
                )}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 z-50 animate-fade-in text-left">
                <div className="px-3 py-2 border-b border-white/20 dark:border-zinc-805">
                  <div className="flex items-center gap-1.5 opacity-90">
                    <p className="font-sans font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    {user.isPro && (
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-none animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-zinc-400 truncate">{user.email}</p>
                </div>
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => { setActiveTab("settings"); setProfileOpen(false); }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-350 hover:bg-white/40 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Edit Profile Details
                  </button>
                  <button
                    onClick={() => { setActiveTab("progress"); setProfileOpen(false); }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-350 hover:bg-white/40 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Workspace Analytics
                  </button>
                  <div className="h-px bg-white/20 dark:bg-zinc-800 my-1"></div>
                  <button
                    onClick={async () => {
                      setProfileOpen(false);
                      if (demoMode) {
                        onExitDemo();
                      } else {
                        try {
                          await signOut(auth);
                        } catch (err) {
                          console.error("Sign out process failed:", err);
                        }
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{demoMode ? "Exit Demo State" : "Disconnect Workstation"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
