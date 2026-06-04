/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Flame, 
  Clock, 
  BookMarked, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  Grid
} from "lucide-react";
import { TopicTrack, Resource } from "../types";

interface ProgressTrackerHubProps {
  topics: TopicTrack[];
  resources: Resource[];
}

export default function ProgressTrackerHub({ topics, resources }: ProgressTrackerHubProps) {
  
  // Tabulate indicators
  const totalTopicCount = topics.length;
  const completedTasks = topics.reduce((acc, t) => acc + t.tasks.filter(tk => tk.completed).length, 0);
  const totalTasks = topics.reduce((acc, t) => acc + t.tasks.length, 0);
  const overallTaskAccuracyPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const savedResourcesCount = resources.filter(r => r.isSaved).length;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h2 className="font-sans text-md font-bold text-black dark:text-white">
          Workspace Activity & Analytics Portfolio
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
          Analyze study logs, self-confidence ratios, and streak milestones logged on client systems.
        </p>
      </div>

      {/* High-level portfolio summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded bg-amber-50 dark:bg-zinc-800 text-[#f59e0b] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400 uppercase">Study Streak</span>
            <span className="font-sans font-bold text-lg text-black dark:text-white">12 Consecutive Days</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded bg-blue-50 dark:bg-zinc-800 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400 uppercase">Estimated Hours</span>
            <span className="font-sans font-bold text-lg text-black dark:text-white">54.5 Hours Logged</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded bg-emerald-50 dark:bg-zinc-800 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400 uppercase">Syllabus Progress</span>
            <span className="font-sans font-bold text-lg text-black dark:text-white">
              {completedTasks}/{totalTasks} Chapters ({overallTaskAccuracyPercent}%)
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded bg-purple-50 dark:bg-zinc-800 text-purple-600 flex items-center justify-center shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-mono text-zinc-400 uppercase">Saved Syllabi</span>
            <span className="font-sans font-bold text-lg text-black dark:text-white">{savedResourcesCount} References</span>
          </div>
        </div>
      </div>

      {/* SVG Daily study logs analytical chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
        <h3 className="font-sans font-bold text-black dark:text-white text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
          <span>Bi-weekly Academic Learning Load Ratio</span>
        </h3>

        {/* Simple inline pure SVG responsive chart */}
        <div className="w-full h-64 relative bg-zinc-50 dark:bg-zinc-950/20 rounded border border-[#eceef0] dark:border-zinc-850 p-4">
          <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
            {/* Grid references Lines */}
            <line x1="40" y1="20" x2="580" y2="20" stroke="#f2f4f6" strokeWidth="1" className="dark:stroke-zinc-800" />
            <line x1="40" y1="70" x2="580" y2="70" stroke="#f2f4f6" strokeWidth="1" className="dark:stroke-zinc-800" />
            <line x1="40" y1="120" x2="580" y2="120" stroke="#f2f4f6" strokeWidth="1" className="dark:stroke-zinc-800" />
            <line x1="40" y1="170" x2="580" y2="170" stroke="#e0e3e5" strokeWidth="1" className="dark:stroke-zinc-800 animate-pulse" />

            {/* Path representing data: hours of study per day */}
            <path
              d="M 40,170 Q 120,80 200,110 T 360,40 T 520,120 T 580,20"
              fill="none"
              stroke="#0051d5"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Highlighted core dots */}
            <circle cx="200" cy="110" r="4.5" fill="#0051d5" className="animate-ping" />
            <circle cx="200" cy="110" r="3.5" fill="#0051d5" />
            
            <circle cx="360" cy="40" r="4.5" fill="#f59e0b" className="animate-pulse" />
            <circle cx="360" cy="40" r="3.5" fill="#f59e0b" />

            {/* Labels values */}
            <text x="35" y="24" className="text-[10px] font-mono fill-zinc-400">8h</text>
            <text x="35" y="74" className="text-[10px] font-mono fill-zinc-400">5h</text>
            <text x="35" y="124" className="text-[10px] font-mono fill-zinc-400">2h</text>
            <text x="35" y="174" className="text-[10px] font-mono fill-zinc-400">0h</text>

            <text x="120" y="190" className="text-[10px] font-mono fill-zinc-500 text-center">Mon</text>
            <text x="240" y="190" className="text-[10px] font-mono fill-zinc-500 text-center">Wed</text>
            <text x="360" y="190" className="text-[10px] font-mono fill-zinc-500 text-center">Fri</text>
            <text x="480" y="190" className="text-[10px] font-mono fill-zinc-500 text-center">Sun</text>
            <text x="580" y="190" className="text-[10px] font-mono fill-zinc-500 text-center">Today</text>
          </svg>
        </div>
      </div>

      {/* Dynamic Breakdown per curriculum module */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm text-left">
        <h3 className="font-sans font-bold text-black dark:text-white text-sm mb-4 flex items-center gap-1.5">
          <Calendar className="w-4.5 h-4.5 text-blue-600" />
          <span>Curriculums Modules Completion Checkbooks</span>
        </h3>

        <div className="space-y-4">
          {topics.map((topic) => {
            const completedCt = topic.tasks.filter(t => t.completed).length;
            const totalCt = topic.tasks.length;
            const pct = Math.round((completedCt / totalCt) * 100);

            return (
              <div key={topic.id} className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded hover:border-zinc-400 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-black dark:text-white">
                      {topic.title} ({topic.level})
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                      Prerequisites: {topic.prerequisites} • Confidence Score: {topic.rating}/5
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {completedCt}/{totalCt} Modules Finished
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      ({pct}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar inside list */}
                <div className="w-full bg-[#eceef0] dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
