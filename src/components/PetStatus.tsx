/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Zap, Coffee, Edit3, Check, RefreshCw, Star, ShowerHead, Gift } from 'lucide-react';
import { PetState, PetType, MoodType } from '../types';
import { PetCharacter, getPetTypeName, getPetStageName } from './PetCharacter';

interface PetStatusProps {
  petState: PetState;
  onUpdatePet: (newState: Partial<PetState>) => void;
  onTriggerInteraction: (type: string) => void;
  currentMood: MoodType;
}

// Dialog quotes engine representing high-fidelity cute pet conversations
const getPetQuote = (type: PetType, stage: 'baby' | 'junior' | 'adult', mood: MoodType, name: string) => {
  const nickname = name || '小寶貝';
  
  if (stage === 'baby') {
    switch (mood) {
      case 'happy': return `咕嚕嚕～嗶嗶！咿、咿呀♪ (${nickname} 好開心！)`;
      case 'sad': return `嗚嗚...嗶...噗啾... (${nickname} 需要你的抱抱...)`;
      case 'angry': return `嘟嘟！姆！ (${nickname} 正在氣呼呼！)`;
      case 'anxious': return `啵咿？啵咿？ (${nickname} 四處張望，有點慌張)`;
      case 'calm':
      default: return `阿姆...呼...💤 (${nickname} 飽飽的，正在幸福打瞌睡)`;
    }
  }

  if (type === 'slime') {
    switch (mood) {
      case 'happy': return `蹦跳蹦跳！看我彈得好高！主人今天心情也跟抹茶一樣清新甜美嗎？`;
      case 'sad': return `身體黏糊糊的...整個人都要融化成一攤綠水了...想聽主人的溫柔耳語...`;
      case 'angry': return `哼！別看我軟綿綿的，我也會發燙變成抹茶熔岩史萊姆唷！`;
      case 'anxious': return `沙沙...我會長得不夠大嗎？如果主人不開心，我也會變得乾巴巴的...`;
      case 'calm':
      default: return `軟綿綿，輕飄飄。生活就像茶道，慢慢攪拌，總會散發純淨香氣的～`;
    }
  }

  if (type === 'cat') {
    switch (mood) {
      case 'happy': return `喵嗚～可可貓貓為你打氣！主人摸摸下巴的話，我的小鈴鐺就會叮噹響喔！`;
      case 'sad': return `耳朵垂下來了...喵。主人，今天工作辛苦了嗎？讓我用軟肉球安慰你。`;
      case 'angry': return `喵嗷！竟然敢忽視肉罐頭！我要在你的日記本上踩上滿滿的巧克力梅花印！`;
      case 'anxious': return `尾巴抖了一下...那邊是有什麼奇怪的影子嗎？喵嗚...`;
      case 'calm':
      default: return `太陽暖洋洋的。曬個日光浴，伸個懶腰，喵～今天也是幸福滿分的一天。`;
    }
  }

  // dino
  switch (mood) {
    case 'happy': return `嗷嗚！大吼一聲！雖然我是恐龍，但我只吃好心情和主人的關愛唷！`;
    case 'sad': return `背上的刺都亮不起來了...我的恐龍蛋殼好像有點冰冷。`;
    case 'angry': return `吼喔喔！噴火囉！（假裝噴小火星）不要惹最威猛（且可愛）的小霸王生氣！`;
    case 'anxious': return `嗷？地殼在震動嗎？還是那是主人的嘆息聲？恐龍會保護你的！`;
    case 'calm':
    default: return `嚼嚼嚼...今天也過得很充實呢。讓我們在溫暖的平原上，慢悠悠地打個滾吧。`;
  }
};

export const PetStatus: React.FC<PetStatusProps> = ({
  petState,
  onUpdatePet,
  onTriggerInteraction,
  currentMood,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(petState.name);
  const [petQuote, setPetQuote] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeInteractionType, setActiveInteractionType] = useState('');

  // Determine stage based on Level
  const getStageByLevel = (lvl: number): 'baby' | 'junior' | 'adult' => {
    if (lvl <= 2) return 'baby';
    if (lvl <= 4) return 'junior';
    return 'adult';
  };

  const currentStage = getStageByLevel(petState.level);

  // Update quote when state changes
  useEffect(() => {
    setPetQuote(getPetQuote(petState.type, currentStage, currentMood, petState.name));
  }, [petState.type, currentStage, currentMood, petState.name]);

  // Handle species change preview
  const handleSpeciesChange = (type: PetType) => {
    onUpdatePet({ type });
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      onUpdatePet({ name: newName.trim() });
      setIsEditingName(false);
    }
  };

  const triggerAnimation = (actionName: string, updates: Partial<PetState>) => {
    if (isInteracting) return;
    setIsInteracting(true);
    setActiveInteractionType(actionName);
    onTriggerInteraction(actionName);

    // Apply incremental state updates
    onUpdatePet({
      ...updates,
      lastInteracted: new Date().toISOString()
    });

    // Reset interaction animation state after delay
    setTimeout(() => {
      setIsInteracting(false);
      setActiveInteractionType('');
    }, 1300);
  };

  // Nurturing interaction actions
  const handleFeed = () => {
    const nextFull = Math.min(100, petState.fullness + 25);
    const nextEnergy = Math.min(100, petState.energy + 10);
    // Feeding baby gives +5 XP
    const extraXp = currentStage === 'baby' ? 5 : 2;
    const nextXpTotal = petState.xp + extraXp;
    const levelIncrease = Math.floor(nextXpTotal / 100);
    const finalXp = nextXpTotal % 100;
    const finalLevel = petState.level + levelIncrease;

    triggerAnimation('feed', {
      fullness: nextFull,
      energy: nextEnergy,
      xp: finalXp,
      level: finalLevel
    });
  };

  const handlePlay = () => {
    if (petState.energy < 15) {
      alert(`${petState.name} 累了（能量不足 15），先讓牠吃點點心或休息一下吧！`);
      return;
    }
    const nextLove = Math.min(100, petState.love + 20);
    const nextEnergy = Math.max(0, petState.energy - 15);
    const nextClean = Math.max(0, petState.cleanliness - 10);
    
    // Play boosts XP
    const nextXpTotal = petState.xp + 12;
    const levelIncrease = Math.floor(nextXpTotal / 100);
    const finalXp = nextXpTotal % 100;
    const finalLevel = petState.level + levelIncrease;

    triggerAnimation('play', {
      love: nextLove,
      energy: nextEnergy,
      cleanliness: nextClean,
      xp: finalXp,
      level: finalLevel
    });
  };

  const handlePet = () => {
    const nextLove = Math.min(100, petState.love + 15);
    const nextXpTotal = petState.xp + 4;
    const levelIncrease = Math.floor(nextXpTotal / 100);
    const finalXp = nextXpTotal % 100;
    const finalLevel = petState.level + levelIncrease;

    triggerAnimation('pet', {
      love: nextLove,
      xp: finalXp,
      level: finalLevel
    });
  };

  const handleClean = () => {
    const nextClean = Math.min(100, petState.cleanliness + 30);
    const nextXpTotal = petState.xp + 3;
    const levelIncrease = Math.floor(nextXpTotal / 100);
    const finalXp = nextXpTotal % 100;
    const finalLevel = petState.level + levelIncrease;

    triggerAnimation('clean', {
      cleanliness: nextClean,
      xp: finalXp,
      level: finalLevel
    });
  };

  const xpPercent = petState.xp;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      {/* Visual Sandbox Main Stage */}
      <div className="md:col-span-7 bento-card-gradient-sky border-3 border-slate-900 rounded-3xl p-6 flex flex-col justify-between items-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden min-h-[480px]">
        
        {/* Tiny Sky grid pattern for aesthetic */}
        <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        {/* Top Header Badge & Name Edit */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={10}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-2.5 py-1 text-sm font-black border-2 border-slate-900 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 px-2.5 bg-emerald-500 text-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-emerald-600 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-xl border-2 border-slate-900/60 shadow-sm">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {petState.name}
                </h3>
                <button
                  onClick={() => {
                    setNewName(petState.name);
                    setIsEditingName(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                  title="重新命名"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] sm:text-xs font-black px-3 py-1 bg-white border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] text-slate-800">
            {getPetTypeName(petState.type)}
          </div>
        </div>

        {/* Central Character Component */}
        <div 
          onClick={handlePet}
          className="relative transition-transform active:scale-95 hover:scale-[1.02] saturate-110 flex-1 flex items-center justify-center w-full cursor-pointer"
          title="點擊可以撫摸小寵物喔！"
        >
          <PetCharacter
            type={petState.type}
            stage={currentStage}
            mood={currentMood}
            isInteracting={isInteracting}
            interactionType={activeInteractionType}
          />
        </div>

        {/* Responsive Pet Dialog Speech Bubble */}
        <div className="w-full bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative z-10 mb-2">
          {/* Bubble beak */}
          <div className="absolute left-1/2 -top-3 transform -translate-x-1/2 w-5 h-5 bg-white border-l-3 border-t-3 border-slate-900 rotate-45" />
          <p className="text-xs sm:text-sm font-black text-slate-800 text-center relative leading-relaxed">
            「 {petQuote} 」
          </p>
        </div>
      </div>

      {/* Right Column: Interaction Actions and Attributes */}
      <div className="md:col-span-5 flex flex-col justify-between gap-6">
        
        {/* Attribute Gauges Card */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-slate-100">
            <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5 font-display">
              <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-400" />
              等級狀態
            </h4>
            <span className="text-xs font-black bg-rose-50 border border-rose-200 text-rose-500 px-2 py-0.5 rounded-lg font-mono">
              LV. {petState.level}
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-black text-slate-500">
              <span>成長經驗值 ({xpPercent}/100)</span>
              <span>{xpPercent}%</span>
            </div>
            <div className="w-full h-4 bg-slate-50 rounded-full border-2 border-slate-900 overflow-hidden p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Grid of Gauges (Energy, Hunger, Love, cleanliness) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Energy */}
            <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border-2 border-slate-900/10 hover:border-slate-900/30 transition-all">
              <div className="flex items-center gap-1 text-amber-600 mb-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-[11px] font-black">活力能量</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs font-black text-slate-800">{petState.energy}/100</span>
                <span className="text-[9px] font-bold text-slate-400">⚡消耗</span>
              </div>
              <div className="w-full h-2 bg-slate-200/60 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${petState.energy}%` }} />
              </div>
            </div>

            {/* Hunger */}
            <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border-2 border-slate-900/10 hover:border-slate-900/30 transition-all">
              <div className="flex items-center gap-1 text-emerald-600 mb-1">
                <Coffee className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[11px] font-black">肚肚飽食</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs font-black text-slate-800">{petState.fullness}/100</span>
                <span className="text-[9px] font-bold text-slate-400">🍖飽腹</span>
              </div>
              <div className="w-full h-2 bg-slate-200/60 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${petState.fullness}%` }} />
              </div>
            </div>

            {/* Love */}
            <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border-2 border-slate-900/10 hover:border-slate-900/30 transition-all">
              <div className="flex items-center gap-1 text-rose-600 mb-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span className="text-[11px] font-black">親密喜愛</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs font-black text-slate-800">{petState.love}/100</span>
                <span className="text-[9px] font-bold text-slate-400">💗貼心</span>
              </div>
              <div className="w-full h-2 bg-slate-200/60 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${petState.love}%` }} />
              </div>
            </div>

            {/* Cleanliness */}
            <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border-2 border-slate-900/10 hover:border-slate-900/30 transition-all">
              <div className="flex items-center gap-1 text-sky-600 mb-1">
                <ShowerHead className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[11px] font-black">沐浴清潔</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs font-black text-slate-800">{petState.cleanliness}/100</span>
                <span className="text-[9px] font-bold text-slate-400">🧼香噴</span>
              </div>
              <div className="w-full h-2 bg-slate-200/60 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${petState.cleanliness}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Interactive Nursery Controls */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5 pb-2 border-b-2 border-slate-100 font-display">
            <Gift className="w-4.5 h-4.5 text-indigo-500" />
            日常養成互動
          </h4>

          <div className="grid grid-cols-2 gap-3.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFeed}
              disabled={isInteracting}
              className="py-3 px-2 bg-pink-50 hover:bg-pink-100 border-2 border-slate-900 text-pink-800 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              <span className="text-2xl">🍪</span>
              <span className="font-extrabold tracking-tight">餵食點心 (+XP)</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              disabled={isInteracting}
              className="py-3 px-2 bg-indigo-50 hover:bg-indigo-100 border-2 border-slate-900 text-indigo-800 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              <span className="text-2xl">⭐️</span>
              <span className="font-extrabold tracking-tight">遊戲玩耍 (++XP)</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePet}
              disabled={isInteracting}
              className="py-3 px-2 bg-rose-50 hover:bg-rose-100 border-2 border-slate-900 text-rose-800 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              <span className="text-2xl">❤️</span>
              <span className="font-extrabold tracking-tight">撫摸寵物 (+XP)</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClean}
              disabled={isInteracting}
              className="py-3 px-2 bg-sky-50 hover:bg-sky-100 border-2 border-slate-900 text-sky-800 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              <span className="text-2xl">🧼</span>
              <span className="font-extrabold tracking-tight">洗澡洗香 (+XP)</span>
            </motion.button>
          </div>
        </div>

        {/* Companion Species Selector (隨時能切換喜歡的卡通角色) */}
        <div className="bento-card-gradient-amber border-3 border-slate-900 rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <h5 className="text-xs font-black text-amber-950 flex items-center gap-1.5 mb-3 font-display">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
            切換培育基因型態
          </h5>
          <div className="grid grid-cols-3 gap-2.5">
            {(['slime', 'cat', 'dino'] as PetType[]).map((type) => {
              const active = petState.type === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSpeciesChange(type)}
                  className={`py-2 px-1 rounded-xl border-2 text-[11px] font-black tracking-tight transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {type === 'slime' && '🍵 史萊姆'}
                  {type === 'cat' && '🐱 貓貓球'}
                  {type === 'dino' && '🦖 小恐龍'}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
