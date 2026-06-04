/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from "react";
import SidebarNav from "./components/SidebarNav";
import TopAppBar from "./components/TopAppBar";
import HomeFeed from "./components/HomeFeed";
import TopicsTab from "./components/TopicsTab";
import ResourcesExplorer from "./components/ResourcesExplorer";
import GitHubSearchTool from "./components/GitHubSearchTool";
import AcademicPapersExplorer from "./components/AcademicPapersExplorer";
import PracticeLab from "./components/PracticeLab";
import ProgressTrackerHub from "./components/ProgressTrackerHub";
import SettingsPanel from "./components/SettingsPanel";
const AIStudyPartnerChat = lazy(() => import("./components/AIStudyPartnerChat"));
import AuthScreen from "./components/AuthScreen";
import LavaLampBackground from "./components/LavaLampBackground";

import { UserProfile, TopicTrack, Resource, ActiveCourse } from "./types";
import { INITIAL_RESOURCE_POOL, INITIAL_TOPICS, INITIAL_ACTIVE_COURSES } from "./data";
import { Sparkles, X, GraduationCap, Github, RefreshCw } from "lucide-react";

// Firebase instances and helpers
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  // Page routing tab states: home, topics, resources, github, papers, practice, progress, saved, settings, help
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Custom states
  const [searchString, setSearchString] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("t1");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  
  // Auth and sync layers
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Platform entity storage
  const [user, setUser] = useState<UserProfile>({
    name: "Scholar Student",
    email: "",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=learn",
    isPro: false,
    readingTimes: {},
    streakCount: 0,
    lastActiveDate: "",
    claimedRewardDays: 0
  });

  // Action: Custom User State Sync wrapper with Auto Cloud persistence
  const handleUpdateUser = async (updater: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    setUser((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      
      if (auth.currentUser && !demoMode) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        setDoc(userRef, {
          name: next.name,
          email: next.email,
          avatarUrl: next.avatarUrl,
          isPro: next.isPro,
          isDarkMode: true,
          streakCount: next.streakCount !== undefined ? next.streakCount : 0,
          lastActiveDate: next.lastActiveDate || "",
          claimedRewardDays: next.claimedRewardDays !== undefined ? next.claimedRewardDays : 0,
          readingTimes: next.readingTimes || {}
        }, { merge: true }).catch((err) => {
          console.error("Firestore persistence exception caught:", err);
        });
      }
      return next;
    });
  };

  const handleToggleDarkMode = async (mode: boolean) => {
    // Mode is locked to true for exclusive Dark Mode Palette setup
    setIsDarkMode(true);
    if (auth.currentUser && !demoMode) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      setDoc(userRef, { isDarkMode: true }, { merge: true }).catch((err) => {
        console.error("Failed to sync dark mode state to cloud database:", err);
      });
    }
  };
  
  const [topics, setTopics] = useState<TopicTrack[]>(INITIAL_TOPICS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCE_POOL);
  const [activeCourses, setActiveCourses] = useState<ActiveCourse[]>(INITIAL_ACTIVE_COURSES);
  
  const [systemHealth, setSystemHealth] = useState<{ status: string; has_api_key: boolean } | null>(null);

  // Synchronize dynamic visual dark mode preferences
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Auth Session state synchronizer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        
        // Retrieve and sync Firestore user document
        const userRef = doc(db, "users", firebaseUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              name: data.name || "Scholar Candidate",
              email: data.email || firebaseUser.email || "",
              avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || "default")}`,
              isPro: data.isPro || false,
              streakCount: data.streakCount !== undefined ? data.streakCount : 0,
              lastActiveDate: data.lastActiveDate || "",
              claimedRewardDays: data.claimedRewardDays !== undefined ? data.claimedRewardDays : 0,
              readingTimes: data.readingTimes || {}
            });
            setIsDarkMode(true);
          } else {
            // Profile block missing, perform automatic self-init bootstrap
            const bootstrapProfile = {
              name: firebaseUser.displayName || "Scholar Candidate",
              email: firebaseUser.email || "",
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || "default")}`,
              isPro: false,
              isDarkMode: true,
              streakCount: 0,
              lastActiveDate: "",
              claimedRewardDays: 0,
              readingTimes: {}
            };
            await setDoc(userRef, bootstrapProfile);
            setUser({
              name: bootstrapProfile.name,
              email: bootstrapProfile.email,
              avatarUrl: bootstrapProfile.avatarUrl,
              isPro: bootstrapProfile.isPro,
              streakCount: bootstrapProfile.streakCount,
              lastActiveDate: bootstrapProfile.lastActiveDate,
              claimedRewardDays: bootstrapProfile.claimedRewardDays,
              readingTimes: bootstrapProfile.readingTimes
            });
            setIsDarkMode(true);
          }
        } catch (err: any) {
          console.error("Sync error:", err);
          // Fallback securely matching active auth state
          setUser({
            name: firebaseUser.displayName || "Scholar Candidate",
            email: firebaseUser.email || "",
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || "default")}`,
            isPro: false,
            streakCount: 0,
            lastActiveDate: "",
            claimedRewardDays: 0,
            readingTimes: {}
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Duolingo Streak Check Effect
  useEffect(() => {
    if (!currentUser || !user.email) return;
    
    // Stable timezone-insensitive local study date string
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
    const lastDate = user.lastActiveDate;
    
    if (lastDate === todayStr) {
      // Already active today, streak is locked and good!
      return;
    }
    
    const todayMs = new Date(todayStr).getTime();
    const yesterdayStr = new Date(todayMs - 86400000).toLocaleDateString("en-CA");
    
    let nextStreak = user.streakCount || 0;
    if (lastDate === yesterdayStr) {
      // Continuing daily consistency, increment streak
      nextStreak += 1;
    } else if (!lastDate) {
      // Brand new user, starting streak at 1
      nextStreak = 1;
    } else {
      // More than 1 day difference, streak broke, restart at 1
      nextStreak = 1;
    }
    
    // Commit and save updated streak state to cloud
    handleUpdateUser(prev => ({
      ...prev,
      streakCount: nextStreak,
      lastActiveDate: todayStr
    }));
  }, [currentUser, user.email]);

  // Fetch API health and Key verification on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setSystemHealth(data);
      } catch (err) {
        console.log("Offline mode: express server offline/bundler compiling. Fallbacking securely.");
        setSystemHealth({ status: "offline", has_api_key: false });
      }
    };
    checkApiHealth();
  }, []);

  const handleSelectTopicById = (id: string) => {
    setSelectedTopicId(id);
    setActiveTab("topics");
  };

  const handleExploreResourceFromCard = (res: Resource) => {
    // If resource belongs to machine learning topic, open topics page with details
    onExploreResource(res);
  };

  const onExploreResource = (res: Resource) => {
    // Transition smoothly to PDF summaries reader inside Resources explorer
    setActiveTab("resources");
    setSearchString(res.title);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-650 dark:text-sky-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Synchronizing Workstation...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser && !demoMode) {
    return (
      <AuthScreen 
        onAuthSuccess={() => setDemoMode(false)} 
        onEnterDemo={() => {
          setDemoMode(true);
          setUser({
            name: "Guest Scholar (Demo)",
            email: "scholar@example.com",
            avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=demo",
            isPro: false,
            readingTimes: {},
            streakCount: 1,
            lastActiveDate: new Date().toLocaleDateString("en-CA"),
            claimedRewardDays: 0
          });
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#07090e] text-[#191c1e] dark:text-[#f8fafc] flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Lava Lamp background and dynamic Glassmorphic Glows */}
      <LavaLampBackground />
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[45vw] h-[45vw] max-w-[650px] rounded-full bg-gradient-to-tr from-sky-400/20 to-indigo-400/20 dark:from-indigo-950/40 dark:to-purple-950/30 blur-[130px] opacity-85 transition-all duration-1000" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] rounded-full bg-gradient-to-br from-pink-400/15 to-violet-400/15 dark:from-pink-950/20 dark:to-indigo-950/20 blur-[140px] opacity-80 transition-all duration-1000" />
        <div className="absolute top-[35%] left-[25%] w-[35vw] h-[35vw] max-w-[450px] rounded-full bg-gradient-to-tr from-cyan-400/10 to-teal-400/10 dark:from-cyan-950/15 dark:to-emerald-950/15 blur-[110px] opacity-75" />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Sidebar navigation drawer */}
        <SidebarNav 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Keep search string pristine unless moving between resources
            if (tab !== "resources" && tab !== "papers" && tab !== "saved") {
              setSearchString("");
            }
          }} 
          user={user}
          toggleProModal={() => setIsProModalOpen(true)}
        />

        {/* Main workspace container wrapper */}
        <div className="flex-1 pl-0 md:pl-[260px] flex flex-col min-h-screen transition-all duration-200 relative overflow-hidden">
          
          {/* Universal Top Bar */}
          <TopAppBar 
            user={user} 
            searchString={searchString} 
            onSearchChange={setSearchString} 
            setActiveTab={setActiveTab}
            systemHealth={systemHealth}
            isDarkMode={isDarkMode}
            setIsDarkMode={handleToggleDarkMode}
            demoMode={demoMode}
            onExitDemo={() => {
              setDemoMode(false);
              setCurrentUser(null);
            }}
          />

        {/* Dynamic page container based on routes */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 bg-white/5 dark:bg-[#07090e]/5 backdrop-blur-[2.5px]">
          
          {activeTab === "home" && (
            <HomeFeed
              activeCourses={activeCourses}
              setActiveCourses={setActiveCourses}
              searchString={searchString}
              onSearchChange={(val) => {
                setSearchString(val);
                setActiveTab("resources");
              }}
              setActiveTab={setActiveTab}
              setTopicSearchFilter={setSearchString}
              onExploreResource={onExploreResource}
              onSelectTopicById={handleSelectTopicById}
            />
          )}

          {activeTab === "topics" && (
            <TopicsTab
              topics={topics}
              setTopics={setTopics}
              selectedTopicId={selectedTopicId}
              setSelectedTopicId={setSelectedTopicId}
              onExploreResource={handleExploreResourceFromCard}
            />
          )}

          {activeTab === "resources" && (
            <ResourcesExplorer
              resources={resources}
              setResources={setResources}
              searchString={searchString}
              onSearchChange={setSearchString}
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === "papers" && (
            <AcademicPapersExplorer />
          )}

          {activeTab === "saved" && (
            <ResourcesExplorer
              resources={resources}
              setResources={setResources}
              searchString={searchString}
              onSearchChange={setSearchString}
              activeSavedOnly={true}
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === "practice" && (
            <PracticeLab />
          )}

          {activeTab === "progress" && (
            <ProgressTrackerHub 
              topics={topics}
              resources={resources}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPanel
              user={user}
              setUser={handleUpdateUser}
              isDarkMode={isDarkMode}
              setIsDarkMode={handleToggleDarkMode}
              systemHealth={systemHealth}
            />
          )}

          {activeTab === "github" && (
            <GitHubSearchTool />
          )}

          {activeTab === "help" && (
            <div className="space-y-6 max-w-2xl text-left animate-fade-in">
              <h2 className="font-sans font-bold text-black dark:text-white text-md">
                Learning Launchpad Documentation & Hub
              </h2>

              <div className="prose prose-zinc dark:prose-invert font-sans text-xs space-y-4 text-zinc-750 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Getting Started with Academic precision parameters:
                </p>
                <p>
                  Welcome to your highly integrated scholastic portal. Learn core data parameters, click through specialized exercise checkers, and monitor your study hours streak inside an unified client deck.
                </p>

                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mt-4">Key Operations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Checking Tasks Progress:</strong> Navigate to any Topics Track and check off lesson items. Overall syllabus completeness rate will recalculate on-the-fly.</li>
                  <li><strong>Saving Books & Papers:</strong> Bookmark individual resource items in the Library tab. View them gathered cleanly inside the "Saved" section.</li>
                  <li><strong>Live AI Academic Chat:</strong> Open the floating helper on the bottom-right corner to initiate live question interactions with Gemini.</li>
                </ul>
              </div>
            </div>
          )}

        </main>

        {/* Footer Component designed precisely matching standard metadata */}
        <footer className="w-full bg-white/10 dark:bg-[#07090e]/15 backdrop-blur-sm border-t border-[#eceef0]/30 dark:border-zinc-800/30 py-6 px-8 mt-auto flex flex-col md:flex-row items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs transition-colors duration-200">
          <p className="font-sans font-semibold text-black dark:text-white text-center md:text-left mb-3 md:mb-0">
            © 2026 Learning Launchpad. Structured knowledge for modern minds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
            <span>Privacy Policy (coming soon)</span>
            <span>Terms of Service (coming soon)</span>
            <span>API Docs (coming soon)</span>
            <span>Community Discord (coming soon)</span>
          </div>
        </footer>

        {/* Floating AI Study partner widget */}
        <Suspense fallback={null}>
          <AIStudyPartnerChat 
            currentTab={activeTab} 
            systemHealth={systemHealth}
          />
        </Suspense>

      </div>

      {/* 4. PREMIUM PRO PROMOTION UPGRADE MODAL */}
      {isProModalOpen && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="pro-modal-title">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-md w-full p-6 text-left relative shadow-2xl">
            <button
              onClick={() => setIsProModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-500 hover:text-black dark:hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center p-3 rounded bg-purple-50 dark:bg-purple-950 text-purple-600">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <h3 id="pro-modal-title" className="font-sans font-bold text-lg text-black dark:text-white">
                Prototype Feature: Pro Workspace (Unimplemented)
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Supercharge your academic modeling environment with unrestricted Gemini integrations. Access advanced math model compilations, instant PDF highlights, deep research paper analysis, and collaborative team tracking options! Please note that the Pro workspace is not yet implemented in this release.
              </p>

              <div className="space-y-2 border-y border-zinc-150 dark:border-zinc-805 py-3 text-xs text-zinc-700 dark:text-zinc-300">
                <p className="flex items-center gap-2 font-medium">✨ Unlimited AI Study Tutor Prompts (Future Scope)</p>
                <p className="flex items-center gap-2 font-medium">📊 High Density Interactive Graphs & Progress Logs (Future Scope)</p>
                <p className="flex items-center gap-2 font-medium">💻 Sandboxed Sandbox code processors with extensive runtimes (Future Scope)</p>
              </div>

              <button
                disabled
                className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-450 dark:text-zinc-500 font-sans text-xs font-semibold rounded cursor-not-allowed flex items-center justify-center gap-2"
              >
                Pro Plan Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
