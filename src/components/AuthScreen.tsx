/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { 
  GraduationCap, 
  Chrome,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  BookOpen,
  Lock
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onEnterDemo: () => void;
}

export default function AuthScreen({ onAuthSuccess, onEnterDemo }: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const provider = new GoogleAuthProvider();
      // Configure provider if needed, then pop up
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err: any) {
      console.error("Google login rejected:", err);
      let friendlyError = "Sign in aborted or authentication failed. Please try again.";
      if (err.code === "auth/popup-closed-by-user") {
        friendlyError = "The authentication window was closed before completion. Please try again.";
      } else if (err.code === "auth/blocked-by-popup-triggerer") {
        friendlyError = "Your browser blocked the sign-in pop-up window. Please enable pop-ups for this domain.";
      } else if (err.message) {
        friendlyError = err.message;
      }
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#07090e] text-[#191c1e] dark:text-[#f8fafc] flex items-center justify-center p-4 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Background glass glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-gradient-to-tr from-cyan-400/20 to-indigo-500/20 dark:from-indigo-950/40 dark:to-purple-950/30 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-gradient-to-br from-pink-400/15 to-violet-500/15 dark:from-pink-950/20 dark:to-indigo-500/20 blur-[130px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 mx-auto mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 dark:text-white leading-tight tracking-tight">
            Learning Launchpad
          </h1>
          <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">
            Academic-Tech Workspace
          </p>
        </div>

        {/* Auth glass panel card */}
        <div className="glass-panel border border-white/30 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative">
          
          {/* Form Header */}
          <div className="mb-6 text-center">
            <h2 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
              Scholar Workspace Authentication
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-sans max-w-sm mx-auto">
              Access your personalized workspace, study history, and AI Partner resources securely with single sign-on.
            </p>
          </div>

          {/* Academic Features checklist brief */}
          <div className="space-y-3 my-6 text-left border-y border-zinc-200/50 dark:border-zinc-800/50 py-5">
            <div className="flex gap-3 items-start text-xs text-slate-700 dark:text-zinc-300">
              <BookOpen className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-slate-900 dark:text-white">Research & Course Tracking</strong>
                Track confidence ratings across machine learning, calculus, and scientific domains.
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs text-slate-700 dark:text-zinc-300">
              <Sparkles className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-slate-900 dark:text-white">AI Study Partner Logs</strong>
                Synchronize prompt queries, math sandboxes, and quiz outcomes with Google Cloud.
              </div>
            </div>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2.5 items-start text-xs text-red-600 dark:text-red-400 animate-fade-in text-left">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-slate-900 dark:text-white border border-zinc-200 dark:border-zinc-800 font-sans text-xs font-semibold py-3.5 px-4 rounded-xl active:scale-98 transition-all hover:shadow-md flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <RefreshCw className="w-4.5 h-4.5 text-zinc-500 animate-spin" />
            ) : (
              <>
                <Chrome className="w-4.5 h-4.5 text-red-500 dark:text-sky-400" />
                <span>Continue with Google Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
              </>
            )}
          </button>

          {/* Explore Demo Sandbox Button */}
          <button
            type="button"
            onClick={onEnterDemo}
            disabled={loading}
            className="w-full mt-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 dark:text-indigo-200 border border-zinc-800 hover:border-indigo-500/45 font-sans text-xs font-semibold py-3 px-4 rounded-xl active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            Explore Demo State (No Sign In)
          </button>

          {/* Security policy note footer */}
          <div className="mt-6 pt-4 text-[10px] text-center font-mono text-zinc-500 dark:text-zinc-500 flex items-center justify-center gap-1.5 leading-none">
            <Lock className="w-3.5 h-3.5" />
            <span>SECURED BY FIREBASE AUTHENTICATION</span>
          </div>

        </div>

      </div>
    </div>
  );
}
