/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Sun, 
  Moon, 
  User, 
  Mail, 
  ShieldAlert, 
  Check, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsPanelProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  systemHealth: { status: string; has_api_key: boolean } | null;
}

export default function SettingsPanel({
  user,
  setUser,
  isDarkMode,
  setIsDarkMode,
  systemHealth
}: SettingsPanelProps) {

  // Preformed cool avatars to choose from
  const avatarChoices = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDhHSf1WInwkCKRXHruUxX2WZa5aWGJCnWOvqJRPvjsjwUrgN_9z1UD7UoW08cp-Xe00HNCm2ScXAnUsfSDcxXEHx9YgtWhsZD2AsIm8jVo1OcA4X9ie2x0ZUKvljr4W0cy5KYivRpFCKzzoSjotifGtqGXWcGA8Dby5yNWQDV6nrLi7vJPIt1xG93o3tX5jRLNxsbqzYUy5UlQReUKihOiKc0_XGDzzAiqagYHQQbAjGCq_dqCcY-3OvcFS7rOeB_CFy0KaAfTRwA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAup8TVvu0VCqfs6ezsEQT9CldyyRcpZtDAPyA9H10EFCq5kbq_dPtdTreiylWyBJgrRJ8Pfoj5Bwm47G9i0xPYlL2XElFTOZS7s2kvJqsRt2xKTB9nG9Rs1ptZWFS9W0Im9ArFQSMD4SRdgoO5fi1GZvUAXTuLBNwB1wemkOlwZb8ZTK2lfYB58MtuyboaLcKjZSYw47dKz8gByjkaoywe3l_C9fryTM2TJO1-XosJHvtMRLBJ6iP9M1jAenLWiXtzDOkiOfuU-rg",
    "https://api.dicebear.com/7.x/bottts/svg?seed=learn"
  ];

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in text-left">
      <div>
        <h2 className="font-sans text-md font-bold text-black dark:text-white">
          Workspace Profile & Visual Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
          Update environment styling, select responsive user avatars, and track system key integration states.
        </p>
      </div>

      {/* Visual styling and theme toggles */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-808 rounded-lg p-6 space-y-4">
        <h3 className="font-sans font-bold text-black dark:text-white text-sm">
          Theme Configuration
        </h3>
        
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
          This system is configured to run exclusively in a professional dark-slate color palette to optimize learning efficiency, focus, and eye comfort during long sessions.
        </p>

        <div className="p-4 bg-zinc-950/45 border border-zinc-850 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-indigo-400">
            <Moon className="w-5 h-5" />
            <span className="font-sans font-semibold text-zinc-200">Terminal Slate Dark Mode</span>
          </div>
          <span className="bg-sky-400/10 text-sky-400 border border-sky-400/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold font-mono">
            Active Palette
          </span>
        </div>
      </div>

      {/* Profile Details Editing */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg p-6 space-y-5">
        <h3 className="font-sans font-bold text-black dark:text-white text-sm">
          Educational Profile Parameters
        </h3>

        {/* Name input */}
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Scholar Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4.5 h-4.5" />
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full pl-9 pr-4 py-2 bg-[#f2f4f6] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded text-xs text-black dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Scholar Contact Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4.5 h-4.5" />
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-9 pr-4 py-2 bg-[#f2f4f6] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded text-xs text-black dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Select from Preformed Cool Avatars */}
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-2">Workspace Avatar Selection</label>
          <div className="flex gap-4">
            {avatarChoices.map((av, idx) => {
              const isSelected = user.avatarUrl === av;
              return (
                <button
                  key={idx}
                  onClick={() => setUser(prev => ({ ...prev, avatarUrl: av }))}
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 relative active:scale-95 transition-all ${
                    isSelected ? "border-blue-600 scale-105" : "border-transparent opacity-80"
                  }`}
                >
                  <img src={av} alt="Avatar selector" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/35 flex items-center justify-center">
                      <Check className="w-4.5 h-4.5 text-white stroke-[3.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integration key Status sheet */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg p-6 space-y-4">
        <h3 className="font-sans font-bold text-black dark:text-white text-sm">
          Google AI Studio Key Integrations
        </h3>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-zinc-400 shrink-0" />
          <div className="space-y-1.5 text-xs">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">
              {systemHealth?.has_api_key ? "Gemini Key Status: Live" : "Gemini Key Status: Offline Sandbox Mode"}
            </p>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed font-sans">
              To trigger actual AI study explanations and dynamically generate new multiple choice quizzes using Gemini model series, please ensure your <code className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-300">GEMINI_API_KEY</code> has been added in the Secrets panel on modern Google AI Studio interfaces.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
