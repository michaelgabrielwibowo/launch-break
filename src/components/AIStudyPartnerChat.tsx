/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, BrainCircuit, Send, X, RotateCcw, AlertTriangle } from "lucide-react";
import { ChatMessage } from "../types";

interface AIStudyPartnerChatProps {
  currentTab: string;
  systemHealth: { status: string; has_api_key: boolean } | null;
}

export default function AIStudyPartnerChat({ currentTab, systemHealth }: AIStudyPartnerChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      sender: "assistant",
      text: "### Welcome to your Academic Helper!\n\nI am your live Google Gemini Study Tutor. How can I help you master advanced modeling or computational architecture concepts today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || userInput;
    if (!prompt.trim() || isLoading) return;

    if (!textToSend) setUserInput("");

    // Add user message to historical feed
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          context: { activeTab: currentTab }
        })
      });

      const data = await response.json();
      const aiResponseText = data.text || "No structured response received from analytical server.";

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "assistant",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI response fetch error:", err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        text: "🚨 **Connection Interrupted**: Failed to fetch live response from Express server. Ensure backend coordinates are active on Port 3000.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: "m0",
        sender: "assistant",
        text: "Conversation history cleared. Ready for new scientific queries.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Preset question helpers
  const presets = [
    "Explain Gradient Descent simply",
    "Define self-attention in Transformer models",
    "What is the difference between L1 and L2 regularizations?"
  ];

  return (
    <>
      {/* 1. Floating Sparkle toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all outline-none flex items-center justify-center gap-2 font-semibold"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-amber-400 dark:text-amber-600" />
        <span className="font-sans text-xs">AI Study Partner</span>
      </button>

      {/* 2. Interactive Sliding Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-[520px] glass-panel rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in text-left border border-white/25 dark:border-zinc-805">
          
          {/* Header */}
          <div className="p-4 bg-white/45 dark:bg-zinc-950/30 border-b border-white/20 dark:border-zinc-800/40 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4.5 h-4.5 text-indigo-600 dark:text-sky-400 animate-pulse" />
              <div>
                <h3 className="font-sans font-bold text-xs text-slate-900 dark:text-white leading-tight">Gemini Scholar Partner</h3>
                <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Live AI Education Model</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={handleResetChat} 
                title="Clear logs" 
                className="p-1.5 hover:bg-white/40 dark:hover:bg-zinc-800/40 rounded-xl text-zinc-500 hover:text-indigo-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/40 dark:hover:bg-zinc-800/40 rounded-xl text-zinc-500 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/15 dark:bg-zinc-950/15">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-normal font-sans border ${
                  msg.sender === "user"
                    ? "bg-slate-950/10 border-white/40 dark:bg-white/10 dark:border-white/10 text-slate-900 dark:text-white self-end ml-auto shadow-sm"
                    : "bg-white/45 border-white/20 dark:bg-zinc-900/35 dark:border-zinc-800/45 text-slate-850 dark:text-zinc-200 self-start mr-auto whitespace-pre-line shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
                }`}
              >
                {/* Visual markdown rendering summary */}
                <div className="space-y-1 font-sans">
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 text-right mt-1.5 block leading-none">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="bg-white/35 border border-white/25 dark:bg-zinc-900/30 dark:border-zinc-800/40 p-3 rounded-2xl text-xs self-start mr-auto max-w-[80%] flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-zinc-400 border-t-indigo-600 dark:border-t-white rounded-full animate-spin"></span>
                <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">Gemini analyzing parameters...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick presets choices helper */}
          {chatMessages.length === 1 && (
            <div className="px-4 py-2 border-t border-white/15 dark:border-zinc-800 flex flex-col gap-1.5 bg-white/25 dark:bg-zinc-950/20">
              <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest pl-1 leading-none">Preset Queries</span>
              {presets.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="w-full text-left font-sans text-[11px] bg-white/45 dark:bg-zinc-900/40 hover:bg-white/60 dark:hover:bg-zinc-850/40 border border-white/20 dark:border-zinc-800 p-1.5 rounded-xl transition-all text-slate-800 dark:text-zinc-300 truncate font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input submission box */}
          <div className="p-3 border-t border-white/15 dark:border-zinc-800 bg-white/45 dark:bg-zinc-900/40 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Scholar anything... (markdown supported)"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="w-full glass-input rounded-xl px-3 py-1.5 font-sans text-xs text-slate-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
              />
              <button
                disabled={!userInput.trim() || isLoading}
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white dark:text-black rounded-xl disabled:opacity-40 transition-all flex items-center justify-center shadow-md shadow-indigo-600/10"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
