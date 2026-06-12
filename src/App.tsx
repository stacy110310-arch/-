/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BookOpen, BarChart3, HelpCircle, ShieldAlert, Sparkles, Smile, RefreshCw, LogOut, User as UserIcon } from 'lucide-react';
import { MoodType, MoodLog, PetState, MOOD_DEFINITIONS } from './types';
import { MoodLogger } from './components/MoodLogger';
import { PetStatus } from './components/PetStatus';
import { StatsDashboard } from './components/StatsDashboard';
import { auth, onAuthStateChanged, signOut } from './lib/firebase';
import { AuthScreen } from './components/AuthScreen';

// Helper to calculate XP adjustments precisely (開心就長大，難過/不開心就長不大甚至退化!)
const calcNewXpAndLevel = (currentLevel: number, currentXp: number, effect: number) => {
  // We represent each level as having 100 XP.
  // Level 1 is from 100-199 total points, Level 2 is 200-299, etc.
  let totalPoints = currentLevel * 100 + currentXp;
  totalPoints += effect;

  // Enforce absolute lower bound support: Level 1, 0 XP
  if (totalPoints < 100) {
    totalPoints = 100;
  }

  const newLevel = Math.floor(totalPoints / 100);
  const newXp = totalPoints % 100;

  return {
    level: newLevel,
    xp: newXp,
    leveledUp: newLevel > currentLevel,
    leveledDown: newLevel < currentLevel,
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'pet' | 'diary' | 'stats'>('pet');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [petState, setPetState] = useState<PetState>({
    name: '抹茶糰子',
    type: 'slime',
    level: 1,
    xp: 20,
    energy: 80,
    fullness: 75,
    love: 60,
    cleanliness: 90,
    lastInteracted: new Date().toISOString(),
  });

  const [currentMood, setCurrentMood] = useState<MoodType>('calm');

  // Auth state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load from LocalStorage on user change and apply pre-seeds if empty
  useEffect(() => {
    if (!user) return;

    const savedLogs = localStorage.getItem(`pet-mood-logs-${user.uid}`);
    const savedPet = localStorage.getItem(`pet-mood-state-${user.uid}`);

    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      setLogs(parsedLogs);
      // Derive current mood from newest log if any
      if (parsedLogs.length > 0) {
        setCurrentMood(parsedLogs[parsedLogs.length - 1].mood);
      }
    } else {
      // Seed data so charts are prepackaged with interactive values on first login
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      const initialLogs: MoodLog[] = [
        {
          id: 'seed-1',
          date: twoDaysAgoStr,
          time: '14:30',
          mood: 'calm',
          note: '午後跟好久不見的老友坐在窗邊喝了杯經典烏龍茶。聽著舒緩的爵士樂，一言一笑都讓人能短暫遺忘煩瑣的世俗。生活，平淡舒坦就好。',
          tags: ['睡眠充足', '追劇看書'],
          xpGained: 10,
        },
        {
          id: 'seed-2',
          date: yesterdayStr,
          time: '19:15',
          mood: 'happy',
          note: '今天收到了心儀學校/公司的正式錄取通知！真的太高興了，過去熬夜奮戰的努力果然沒有白費！晚上去大吃了一餐好料犒賞自己，新的人生章節即將開啟！',
          tags: ['美食享受', '工作順利', '學習進度'],
          xpGained: 15,
        }
      ];
      setLogs(initialLogs);
      setCurrentMood('happy');
      localStorage.setItem(`pet-mood-logs-${user.uid}`, JSON.stringify(initialLogs));
    }

    if (savedPet) {
      setPetState(JSON.parse(savedPet));
    } else {
      const defaultState: PetState = {
        name: '抹茶糰子',
        type: 'slime',
        level: 1,
        xp: 20,
        energy: 80,
        fullness: 75,
        love: 60,
        cleanliness: 90,
        lastInteracted: new Date().toISOString(),
      };
      setPetState(defaultState);
      localStorage.setItem(`pet-mood-state-${user.uid}`, JSON.stringify(defaultState));
    }
  }, [user]);

  // Save changes to localStorage on mutations (user-scoped)
  const updateAndSaveLogs = (newLogs: MoodLog[]) => {
    setLogs(newLogs);
    if (user) {
      localStorage.setItem(`pet-mood-logs-${user.uid}`, JSON.stringify(newLogs));
    }
    if (newLogs.length > 0) {
      setCurrentMood(newLogs[0].mood); // Peak newest mood in list
    } else {
      setCurrentMood('calm');
    }
  };

  const updateAndSavePet = (newPet: PetState) => {
    setPetState(newPet);
    if (user) {
      localStorage.setItem(`pet-mood-state-${user.uid}`, JSON.stringify(newPet));
    }
  };

  // Add Mood Diary and trigger Pet Growing calculations
  const handleAddLog = (mood: MoodType, note: string, tags: string[]): { xpGained: number; leveledUp: boolean } => {
    const moodDef = MOOD_DEFINITIONS[mood];
    const xpEffect = moodDef.xpEffect;
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });

    const newLog: MoodLog = {
      id: `log-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      mood,
      note,
      tags,
      xpGained: xpEffect,
    };

    const nextLogs = [newLog, ...logs];
    updateAndSaveLogs(nextLogs);
    setCurrentMood(mood);

    // Apply growing logic immediately (XP modifiers)
    const formulaResult = calcNewXpAndLevel(petState.level, petState.xp, xpEffect);

    // Automatically boost full, energy on write diary
    const newEnergy = Math.min(100, petState.energy + 10);
    const newLove = Math.min(100, petState.love + 15);

    const nextPetState: PetState = {
      ...petState,
      level: formulaResult.level,
      xp: formulaResult.xp,
      energy: newEnergy,
      love: newLove,
      lastInteracted: now.toISOString(),
    };

    updateAndSavePet(nextPetState);

    return {
      xpGained: xpEffect,
      leveledUp: formulaResult.leveledUp,
    };
  };

  const handleDeleteLog = (id: string) => {
    const remainingLogs = logs.filter(log => log.id !== id);
    updateAndSaveLogs(remainingLogs);
  };

  const handleUpdatePet = (payload: Partial<PetState>) => {
    const nextPet = { ...petState, ...payload };
    updateAndSavePet(nextPet);
  };

  // Interactive buttons trigger small state bumps
  const handleTriggerInteraction = (type: string) => {
    // We update currentMood to happy dynamically during high-attention positive play!
    if (type === 'feed' || type === 'play' || type === 'pet') {
      setCurrentMood('happy');
    } else if (type === 'clean') {
      setCurrentMood('calm');
    }
  };

  // Factory Reset (To re-experience Baby stage instantly)
  const handleResetApp = () => {
    if (user && window.confirm('確定要重新孵化新的寵物並清除日記紀錄嗎？此動作將重置所有您的使用者養成紀錄。')) {
      localStorage.removeItem(`pet-mood-logs-${user.uid}`);
      localStorage.removeItem(`pet-mood-state-${user.uid}`);
      window.location.reload();
    }
  };

  // 1. Auth Loading State Spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] text-slate-800 font-sans p-8 flex flex-col items-center justify-center">
        <div className="bg-[#FFFDFB] rounded-[2.5rem] p-10 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="text-4xl"
          >
            🌀
          </motion.div>
          <p className="font-black text-sm tracking-wide text-slate-800">安全載入認證與資料中...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state Routing
  if (!user) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] text-slate-800 font-sans selection:bg-amber-200 p-3 sm:p-6 md:p-8 flex items-center justify-center">
      
      {/* Bento-style primary outer grid canvas */}
      <div className="w-full max-w-6xl bg-[#FFFDFB] rounded-[2.5rem] p-5 sm:p-8 md:p-10 border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        
        {/* Playful & Clean Bento Title Block */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-yellow-300 text-slate-900 rounded-3xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] select-none text-3xl transform -rotate-3 hover:rotate-3 transition-transform duration-200">
              🦖
            </div>
            <div>
              <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 flex items-center gap-2 leading-none font-display">
                寵物心情養成系統
                <span className="text-[10px] font-black px-2.5 py-0.5 bg-slate-900 text-yellow-300 rounded-full border border-slate-900 tracking-wider">
                  VITE-SPA
                </span>
              </h1>
              <p className="text-xs md:text-sm font-bold text-slate-400 mt-2">
                以日記灌溉、用愛與情緒陪伴小傢伙從「寶寶」快樂地蛻變為「成年伴侶」
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
            {/* User Profile Card */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full border border-slate-900"
                />
              ) : (
                <div className="w-5 h-5 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center text-[10px] font-bold">
                  👤
                </div>
              )}
              <span className="text-xs font-black text-slate-700">
                {user.displayName || user.email?.split('@')[0] || '培育員'}
              </span>
            </div>

            <div className="text-xs font-black text-slate-500 bg-[#FAF8F5] border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              培育對象: <span className="text-indigo-600 font-extrabold">{petState.name}</span>
            </div>

            <button
              onClick={handleResetApp}
              className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 border-2 border-slate-905 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none translate-y-0.5 hover:translate-y-1 transition-all cursor-pointer"
              title="重置系統"
            >
              <RefreshCw className="w-4 h-4 animate-hover" />
            </button>

            <button
              onClick={async () => {
                if (window.confirm("確定要登出培育系統嗎？您的養成進度已安全保存。")) {
                  await signOut(auth);
                }
              }}
              className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 border-2 border-slate-905 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none translate-y-0.5 hover:translate-y-1 transition-all cursor-pointer"
              title="登出系統"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Custom Bento Navigation Pods with different colors for each screen */}
        <nav className="grid grid-cols-3 gap-3 md:gap-5 mb-8">
          <button
            onClick={() => setActiveTab('pet')}
            className={`py-4 px-3 rounded-2xl border-3 font-black text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-200 flex flex-col md:flex-row items-center justify-center gap-2 transform active:scale-95 ${
              activeTab === 'pet'
                ? 'bento-card-gradient-amber border-slate-900 text-amber-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] scale-[1.02]'
                : 'bg-white border-slate-200/80 text-slate-500 hover:border-slate-900 hover:text-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300" />
            <span>互動寵物屋</span>
          </button>

          <button
            onClick={() => setActiveTab('diary')}
            className={`py-4 px-3 rounded-2xl border-3 font-black text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-200 flex flex-col md:flex-row items-center justify-center gap-2 transform active:scale-95 ${
              activeTab === 'diary'
                ? 'bento-card-gradient-rose border-slate-900 text-rose-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] scale-[1.02]'
                : 'bg-white border-slate-200/80 text-slate-500 hover:border-slate-900 hover:text-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
            }`}
          >
            <BookOpen className="w-5 h-5 text-rose-500" />
            <span>寫心情日記</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-3 rounded-2xl border-3 font-black text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-200 flex flex-col md:flex-row items-center justify-center gap-2 transform active:scale-95 ${
              activeTab === 'stats'
                ? 'bento-card-gradient-indigo border-slate-900 text-indigo-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] scale-[1.02]'
                : 'bg-white border-slate-200/80 text-slate-500 hover:border-slate-900 hover:text-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
            }`}
          >
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <span>數據與分析</span>
          </button>
        </nav>

        {/* Tab content sandbox display */}
        <main className="min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab === 'pet' && (
                <PetStatus
                  petState={petState}
                  onUpdatePet={handleUpdatePet}
                  onTriggerInteraction={handleTriggerInteraction}
                  currentMood={currentMood}
                />
              )}

              {activeTab === 'diary' && (
                <MoodLogger
                  petState={petState}
                  logs={logs}
                  onAddLog={handleAddLog}
                  onDeleteLog={handleDeleteLog}
                />
              )}

              {activeTab === 'stats' && (
                <StatsDashboard
                  logs={logs}
                  petState={petState}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom micro footer */}
        <footer className="mt-12 pt-6 border-t-2 border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-400 gap-3">
          <p>© 2026 卡通寵物心情養成花園．陪你接納每一種心境</p>
          <div className="flex items-center gap-3">
            <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-500 border border-slate-200">本機安全自動保存儲存技術</span>
            <span>•</span>
            <span className="text-slate-500 bg-amber-50 border border-amber-100 px-20 py-1 px-2.5 rounded-md">目前夥伴形態: {petState.level <= 2 ? '寶寶 🍼' : petState.level <= 4 ? '幼年 🌿' : '成年 👑'}</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
