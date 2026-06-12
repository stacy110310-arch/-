/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Compass, Calendar, Award, CheckCircle2, ChevronRight, MessageSquareHeart } from 'lucide-react';
import { MoodLog, MOOD_DEFINITIONS, MoodType, PetState } from '../types';

interface StatsDashboardProps {
  logs: MoodLog[];
  petState: PetState;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ logs, petState }) => {
  // 1. Calculate General Metrics
  const totalDays = logs.length;
  
  // Calculate continuous journaling streak
  const calculateStreak = (): number => {
    if (logs.length === 0) return 0;
    
    // Get unique dates sorted in descending order
    const dates = Array.from(new Set(logs.map(l => l.date))).sort().reverse() as string[];
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if streak is still active (today or yesterday has a log)
    if (dates[0] !== today && dates[0] !== yesterday) {
      return 0;
    }
    
    let currentCheck = new Date(dates[0]);
    streak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const logDate = new Date(dates[i]);
      const diffTime = Math.abs(currentCheck.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentCheck = logDate;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // 2. Calculate Mood Frequency
  const moodCounts: Record<MoodType, number> = {
    happy: 0,
    calm: 0,
    anxious: 0,
    angry: 0,
    sad: 0
  };

  logs.forEach(log => {
    if (moodCounts[log.mood] !== undefined) {
      moodCounts[log.mood]++;
    }
  });

  const maxMoodCount = Math.max(...Object.values(moodCounts), 1);

  // Determine dominant mood
  let dominantMoodKey: MoodType = 'happy';
  let maxCount = -1;
  (Object.keys(moodCounts) as MoodType[]).forEach(k => {
    if (moodCounts[k] > maxCount) {
      maxCount = moodCounts[k];
      dominantMoodKey = k;
    }
  });

  const dominantMood = totalDays > 0 ? MOOD_DEFINITIONS[dominantMoodKey] : null;

  // 3. Extract Top Lifestyle Tags
  const tagCounts: Record<string, number> = {};
  logs.forEach(log => {
    log.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // 4. Mood Advice / Insights engine based on pet and logs
  const getInsightText = () => {
    if (totalDays === 0) {
      return '目前還沒有累積足夠的感情資料喔，快去心情紀錄頁面跟牠分享你的今天吧！';
    }

    const happyRatio = (moodCounts.happy + moodCounts.calm) / totalDays;

    if (happyRatio >= 0.7) {
      return `你的生活充滿了暖洋洋的陽光！在你的精心呵護下，${petState.name} 成長得非常健康且極具自信心，身體時不時散發粉紅色的歡樂小愛心。繼續保持感恩與快樂的心境，生活會繼續給你滿滿的回報。`;
    } else if (moodCounts.sad / totalDays >= 0.4) {
      return `最近你的心裡盛滿了沉甸甸的小雨滴。${petState.name} 感覺到了你的失落，牠總是一言不發地抱著你的膝蓋，為你默默承擔風雨。記得多給自己一些空間和時間深呼吸，悲傷會隨著雨季漸漸過去，我們隨時傾聽。`;
    } else if (moodCounts.angry / totalDays >= 0.3) {
      return `最近像是有座小火山在你內心悄悄運作著。生氣是極其自然的情緒，但別忘了像吹蒲公英一樣將積怨吹散喔。${petState.name} 正拿著冰涼的抹茶給你降降溫，今晚吃點好吃的，好好犒賞辛苦的自己吧！`;
    } else if (moodCounts.anxious / totalDays >= 0.3) {
      return `最近周圍緊繃的氣流讓你感到有些局促和焦慮。不要害怕，深吸一口氣，吐出心中所有不確定的迷霧！${petState.name} 在草地上鋪了溫暖的野餐墊，隨時隨地，只要你累了，牠都在這裡等你。`;
    } else {
      return `你最近的心情地圖非常豐富多樣！有大晴天、有偶陣雨，這才是成熟生命的奇妙探險之旅。在你的溫柔紀錄之中，寵物懂得細細陪伴每一種你，牠正在努力提升理解能力，期待跟你成為更好的靈魂夥伴！`;
    }
  };

  // Convert logs to a 7-day timeline representation for custom grid visualization
  const getPastSevenDays = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      dates.push(str);
    }
    return dates;
  };

  const last7DaysDates = getPastSevenDays();

  return (
    <div className="space-y-6">
      {/* Metrics Row (Total Logs, Streaks, Stage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-4">
          <div className="bg-rose-50 border-2 border-slate-900 rounded-2xl p-3 text-2xl select-none">
            📔
          </div>
          <div>
            <p className="text-xs font-black text-slate-400">累積心情日記</p>
            <p className="text-2xl font-black text-slate-900">{totalDays} <span className="text-xs font-black text-slate-400">天</span></p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-4">
          <div className="bg-yellow-50 border-2 border-slate-900 rounded-2xl p-3 text-2xl select-none">
            ⚡
          </div>
          <div>
            <p className="text-xs font-black text-slate-400">連續陪伴天數</p>
            <p className="text-2xl font-black text-slate-900">{currentStreak} <span className="text-xs font-black text-slate-400">天</span></p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-4">
          <div className="bg-indigo-50 border-2 border-slate-900 rounded-2xl p-3 text-2xl select-none">
            🏆
          </div>
          <div>
            <p className="text-xs font-black text-slate-400">目前寵物等級</p>
            <p className="text-2xl font-black text-slate-900">LV. {petState.level}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-4">
          <div className="bg-emerald-50 border-2 border-slate-900 rounded-2xl p-3 text-2xl select-none">
            {dominantMood ? dominantMood.emoji : '🧬'}
          </div>
          <div>
            <p className="text-xs font-black text-slate-400">主導心情基因</p>
            <p className="text-lg font-black text-slate-900 truncate">
              {dominantMood ? dominantMood.label : '尚未定義'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Custom Cartoon SVG Bar Chart Column */}
        <div className="lg:col-span-7 bg-[#FFFDFB] border-3 border-slate-900 rounded-[2rem] p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 mb-1.5 font-display">
              <BarChart3 className="w-5.5 h-5.5 text-indigo-500" />
              心情基因偏好統計
            </h3>
            <p className="text-xs font-bold text-slate-400">
              各類心情的出現比重，可以看出你近期的心靈能量狀態分佈唷。
            </p>
          </div>

          {/* SVG/CSS Driven Custom Hand-drawn Style Bar Chart */}
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {(Object.keys(MOOD_DEFINITIONS) as MoodType[]).map((type) => {
              const conf = MOOD_DEFINITIONS[type];
              const count = moodCounts[type];
              const percentage = totalDays > 0 ? Math.round((count / totalDays) * 100) : 0;
              const barWidth = `${Math.max(5, (count / maxMoodCount) * 100)}%`;

              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className="text-lg filter drop-shadow-sm select-none">{conf.emoji}</span>
                      <span className="font-black text-slate-800">{conf.label}日</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {count} 次 (<span className="text-slate-800 font-black">{percentage}%</span>)
                    </span>
                  </div>

                  {/* Rounded cartoon bar track */}
                  <div className="w-full h-8 bg-[#FAF8F5] rounded-full border-2 border-slate-900 overflow-hidden relative p-1 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: barWidth }}
                      className="h-full rounded-full border border-slate-900/10 shadow-[inner_0_2px_4px_rgba(255,255,255,0.25)]"
                      style={{ backgroundColor: conf.color }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    {percentage > 0 && (
                      <span className="absolute inset-y-0 left-4 flex items-center text-[10px] font-black text-slate-900/60 pointer-events-none uppercase tracking-wider">
                        {percentage}% Energy
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Heatmap & Analytics Insights Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Calendar micro heatmap - 7 Day Activity Trace */}
          <div className="bg-[#FFFDFB] border-3 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="text-sm font-black text-slate-900 mb-3.5 flex items-center gap-1.5 font-display">
              <Calendar className="w-4.5 h-4.5 text-emerald-500" />
              近七日陪伴能量軌跡
            </h4>
            <div className="grid grid-cols-7 gap-2 text-center">
              {last7DaysDates.map((dateStr) => {
                // Find mood logs for this particular date
                const logsOnDate = logs.filter(l => l.date === dateStr);
                const hasLog = logsOnDate.length > 0;
                const topMood = hasLog ? logsOnDate[logsOnDate.length - 1].mood : null;
                const moodConfig = topMood ? MOOD_DEFINITIONS[topMood] : null;

                const dayOfWeek = new Date(dateStr).toLocaleDateString('zh-TW', { weekday: 'short' });

                return (
                  <div key={dateStr} className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">
                      {dayOfWeek}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className={`h-11 rounded-2xl border-2 flex items-center justify-center text-lg shadow-sm transition-all relative cursor-pointer ${
                        hasLog && moodConfig
                          ? 'border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                          : 'border-slate-200 bg-[#FAF8F5] text-transparent hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: moodConfig ? moodConfig.color : undefined }}
                      title={hasLog && moodConfig ? `${dateStr}: ${moodConfig.label}` : '無紀錄'}
                    >
                      {moodConfig ? moodConfig.emoji : '💤'}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifestyle tags insight */}
          <div className="bg-[#FFFDFB] border-3 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900 mb-3.5 flex items-center gap-1.5 border-b-2 border-dashed border-slate-100 pb-2 font-display">
                <Compass className="w-4 h-4 text-amber-500" />
                影響你心情的高頻標籤
              </h4>

              {sortedTags.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-slate-450 leading-relaxed">
                  多寫幾篇日記並選取標籤，系統將為你分析最常誘發幸福或壓力的源頭唷！
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {sortedTags.map(([tag, count]) => (
                    <div key={tag} className="bg-[#FAF8F5] px-3 py-2 border-2 border-slate-900 rounded-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-center">
                      <p className="text-[11px] font-black text-slate-700">#{tag}</p>
                      <p className="text-[10px] font-black text-indigo-600 mt-0.5">{count} 天出現</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comprehensive AI-like Advice Card */}
            <div className="mt-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4.5 relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 text-7xl opacity-5 select-none font-sans">
                💭
              </div>
              <p className="text-xs font-black text-slate-450 mb-1 flex items-center gap-1 uppercase tracking-tight">
                <MessageSquareHeart className="w-4 h-4 text-rose-500 fill-rose-300" />
                寵物陪伴心靈解讀
              </p>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                {getInsightText()}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
