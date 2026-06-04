/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, School, Eye, Clock, ShieldCheck, ArrowUpRight, GraduationCap } from "lucide-react";
import { TopicTrack, Resource } from "../types";

interface TopicsTabProps {
  topics: TopicTrack[];
  setTopics: React.Dispatch<React.SetStateAction<TopicTrack[]>>;
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;
  onExploreResource: (res: Resource) => void;
}

export default function TopicsTab({
  topics,
  setTopics,
  selectedTopicId,
  setSelectedTopicId,
  onExploreResource
}: TopicsTabProps) {
  
  // Find currently active topic object
  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0]!;

  // Recalculate completion percent instantly
  const totalTasks = activeTopic.tasks.length;
  const completedTasksCount = activeTopic.tasks.filter(t => t.completed).length;
  const compPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Toggle tasks check states
  const handleTaskCheckToggle = (taskId: string) => {
    setTopics(prev =>
      prev.map(topic => {
        if (topic.id === activeTopic.id) {
          return {
            ...topic,
            tasks: topic.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
          };
        }
        return topic;
      })
    );
  };

  // Click handler adjusting track complexity
  const handleTrackSelector = (level: "Beginner" | "Intermediate" | "Advanced") => {
    setTopics(prev =>
      prev.map(topic => {
        if (topic.id === activeTopic.id) {
          return {
            ...topic,
            level: level
          };
        }
        return topic;
      })
    );
  };

  // Adjust rating stars on click
  const handleRatingChange = (newRating: number) => {
    setTopics(prev =>
      prev.map(topic => {
        if (topic.id === activeTopic.id) {
          return {
            ...topic,
            rating: newRating
          };
        }
        return topic;
      })
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Tab Select bar permitting shifting between multiple subjects */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#eceef0] dark:border-zinc-805 pb-3">
        {topics.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTopicId(item.id)}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded transition-all ${
              selectedTopicId === item.id
                ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                : "bg-[#f2f4f6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-[#eceef0] dark:hover:bg-zinc-800"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Main topic area grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
        
        {/* Left Column: Topic Metadata Sheet and Lesson Modules */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 rounded-lg border border-[#eceef0] dark:border-zinc-800 p-8 shadow-sm relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0051d5]"></div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-[#eceef0] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-mono text-[11px] rounded border border-[#c4c7c7] dark:border-zinc-700 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                    <span>Academic Topic</span>
                  </span>
                  
                  {/* Clickable Rating Stars */}
                  <div className="flex gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button 
                        key={starVal} 
                        onClick={() => handleRatingChange(starVal)}
                        className="hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            starVal <= activeTopic.rating ? "fill-amber-500 stroke-amber-500" : "text-zinc-300 dark:text-zinc-700"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>

                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    {activeTopic.level}
                  </span>
                </div>

                <h2 className="font-sans text-[28px] md:text-[36px] font-bold text-black dark:text-white leading-tight mb-4">
                  {activeTopic.title}
                </h2>
                
                <p className="font-sans text-md text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {activeTopic.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950/40 px-2.5 py-1.5 rounded border border-zinc-100 dark:border-zinc-850">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated Completion: {activeTopic.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950/40 px-2.5 py-1.5 rounded border border-zinc-100 dark:border-zinc-850">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Prerequisites: {activeTopic.prerequisites}</span>
                  </div>
                </div>
              </div>

              {/* Tracks Dropdown updates track state level */}
              <div className="flex-shrink-0">
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Select Track Mode</label>
                <select 
                  value={activeTopic.level}
                  onChange={(e) => handleTrackSelector(e.target.value as any)}
                  className="bg-[#f2f4f6] dark:bg-zinc-800 border border-[#c4c7c7] dark:border-zinc-700 rounded px-3 py-1.5 font-mono text-xs text-zinc-800 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner Track</option>
                  <option value="Intermediate">Intermediate Track</option>
                  <option value="Advanced">Advanced Track</option>
                </select>
              </div>
            </div>
          </section>

          {/* Curriculum Documents Grid */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#eceef0] dark:border-zinc-800 pb-2">
              <h3 className="font-sans text-md font-bold text-black dark:text-white">
                Start Here & Core Materials
              </h3>
              <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                {activeTopic.resources.length} Reference Materials
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTopic.resources.map((res) => (
                <div
                  key={res.id}
                  onClick={() => onExploreResource(res)}
                  className="bg-white dark:bg-zinc-900 border border-[#eceef0] dark:border-zinc-800 rounded p-5 hover:shadow-md hover:border-blue-500 duration-200 transition-all cursor-pointer relative overflow-hidden group text-left"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                  
                  <div className="flex justify-between items-start mb-3 pl-2">
                    <span className="px-2 py-0.5 bg-zinc-150 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-350 text-[10px] font-mono rounded border border-[#eceef0] dark:border-zinc-700">
                      {res.type}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  </div>

                  <h4 className="font-sans text-sm font-bold text-black dark:text-white mb-2 pl-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {res.title}
                  </h4>
                  <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 pl-2">
                    {res.description}
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t border-[#eceef0] dark:border-zinc-800 pt-3 text-[10px] text-slate-500 dark:text-zinc-400 font-mono pl-2">
                    <div className="flex items-center gap-1">
                      <span>Ref Level: {res.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Est: {res.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Dynamic Progress checklist and rating choice */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-[#eceef0] dark:border-zinc-800 rounded-lg p-6 shadow-sm transition-colors duration-200">
            <h3 className="font-sans text-sm font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-650 dark:text-sky-400" />
              <span>Progress Tracker</span>
            </h3>

            {/* Micro Overall Completion */}
            <div className="mb-6 text-left">
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Overall Completion</span>
                <span className="text-black dark:text-white font-bold">{compPercent}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${compPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Checkable Tasks */}
            <div className="space-y-3.5 mb-6 text-left">
              {activeTopic.tasks.map((task) => (
                <label 
                  key={task.id}
                  className="flex items-start gap-3 cursor-pointer group select-none text-left"
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskCheckToggle(task.id)}
                      className="peer appearance-none w-4.5 h-4.5 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-colors"
                    />
                    <span className="absolute scale-80 pointer-events-none text-white text-[10px] font-bold opacity-0 peer-checked:opacity-100 flex items-center justify-center">
                      ✔
                    </span>
                  </div>
                  <span className={`font-sans text-xs transition-colors ${
                    task.completed 
                      ? "text-zinc-400 dark:text-zinc-500 line-through" 
                      : "text-zinc-850 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white"
                  }`}>
                    {task.title}
                  </span>
                </label>
              ))}
            </div>

            {/* Confidence scale rating selector */}
            <div className="border-t border-[#eceef0] dark:border-zinc-800 pt-5 text-left">
              <h4 className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-2">Self Confidence Rating</h4>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = activeTopic.rating === num;
                  return (
                    <button
                      key={num}
                      onClick={() => handleRatingChange(num)}
                      className={`flex-1 py-1.5 border rounded text-xs transition-all font-bold ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
