/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, HelpCircle, Tag, Trophy, Trash2, Smile, Heart, Clock } from 'lucide-react';
import { MoodType, MOOD_DEFINITIONS, MoodLog, TAG_OPTIONS, PetState } from '../types';

interface MoodLoggerProps {
  petState: PetState;
  logs: MoodLog[];
  onAddLog: (mood: MoodType, note: string, tags: string[]) => { xpGained: number; leveledUp: boolean };
  onDeleteLog: (id: string) => void;
}

export const MoodLogger: React.FC<MoodLoggerProps> = ({
  petState,
  logs,
  onAddLog,
  onDeleteLog,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ xp: number; leveledUp: boolean; emoji: string; text: string } | null>(null);

  const handleToggleTag = (tagLabel: string) => {
    if (selectedTags.includes(tagLabel)) {
      setSelectedTags(selectedTags.filter(t => t !== tagLabel));
    } else {
      setSelectedTags([...selectedTags, tagLabel]);
    }
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    const result = onAddLog(selectedMood, note, selectedTags);
    const moodDef = MOOD_DEFINITIONS[selectedMood];

    let text = '';
    if (result.xpGained > 0) {
      text = `牠接收到了你的能量，獲得了 ${result.xpGained} XP 成長！`;
    } else if (result.xpGained < 0) {
      text = `看到你心情低落，牠貼心地鑽進你的懷裡，為你分擔了一些失落，退化了 ${Math.abs(result.xpGained)} XP... 但牠會一直陪伴著你。`;
    } else {
      text = `牠在你身邊安靜陪伴，摸了摸你的手，感覺很有精神。`;
    }

    setLastFeedback({
      xp: result.xpGained,
      leveledUp: result.leveledUp,
      emoji: moodDef.emoji,
      text: text,
    });

    setShowFeedback(true);
    setNote('');
    setSelectedTags([]);
  };

  // Filter logs based on search or selected tag
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = log.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMoodLabel = MOOD_DEFINITIONS[log.mood]?.label.includes(searchQuery);
    return matchesSearch || matchesTag || matchesMoodLabel;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Logger Column */}
      <div className="lg:col-span-7 bg-[#FFFDFB] rounded-[2rem] p-6 md:p-8 border-3 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
        {/* Playful Corner Ribbon */}
        <div className="absolute top-0 right-0 bg-yellow-300 text-slate-900 px-8 py-1.5 rotate-45 translate-x-7 translate-y-3 font-mono font-black text-xs border-b-2 border-slate-900">
          DAILY DIARY
        </div>

        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-2 font-display">
          <BookOpen className="w-7 h-7 text-indigo-500" />
          紀錄今日心情日記
        </h2>
        <p className="text-sm font-bold text-slate-400 mb-6">
          紀錄你的生活細瑣與伴侶同行，滋養彼此的成長喜樂。
        </p>

        <form onSubmit={handleLogSubmit} className="space-y-6">
          {/* Mood Selectors */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-3 flex items-center gap-1.5 font-display">
              <Smile className="w-4.5 h-4.5 text-indigo-500" />
              1. 選擇你此時的心情氣候
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {(Object.keys(MOOD_DEFINITIONS) as MoodType[]).map((type) => {
                const conf = MOOD_DEFINITIONS[type];
                const isSelected = selectedMood === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedMood(type)}
                    className={`flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl border-3 transition-all duration-200 cursor-pointer transform ${
                      isSelected
                        ? `${conf.borderColor} ${conf.bgClass} scale-[1.03] ring-4 ring-indigo-50/50 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]`
                        : 'border-slate-200 bg-white hover:border-slate-400 hover:scale-[1.01] active:scale-98'
                    }`}
                  >
                    <span className="text-3xl mb-1 filter drop-shadow-sm select-none">
                      {conf.emoji}
                    </span>
                    <span className={`text-xs font-black transition-colors ${
                      isSelected ? conf.textClass : 'text-slate-500'
                    }`}>
                      {conf.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diary Input */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2 flex items-center gap-1.5 font-display">
              <Calendar className="w-4.5 h-4.5 text-pink-500" />
              2. 寫些什麼吧（心情字句）
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今天發生了什麼令人難忘或辛苦的事嗎？跟寵物分享你的小秘密吧..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-100 font-bold placeholder:text-slate-400 text-slate-800 text-sm shadow-inner bg-[#FAF8F5] resize-none"
            />
          </div>

          {/* Tags list */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2.5 flex items-center gap-1.5 font-display">
              <Tag className="w-4.5 h-4.5 text-amber-500" />
              3. 今日事件標籤（多選）
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleToggleTag(tag.label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-black border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-850 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs sm:text-sm md:text-base shadow-[4px_4px_0px_0px_rgba(244,63,94,0.9)] hover:shadow-[2px_2px_0px_0px_rgba(244,63,94,0.9)] transition-all flex items-center justify-center gap-2 border-2 border-slate-900 text-center cursor-pointer"
          >
            <span>✨ 紀錄心情日記並增加寵物 EXP</span>
          </motion.button>
        </form>
      </div>

      {/* History Journal Column */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-[#FFFDFB] border-3 border-slate-900 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex-1 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-display">
              <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-500" />
              心情時光膠囊 ({logs.length})
            </h3>
            <span className="text-[10px] font-black px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl leading-none">
              安全儲存
            </span>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜尋日記內容、標籤、心情..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-[#FAF8F5] focus:outline-none focus:ring-4 focus:ring-indigo-100 text-xs font-bold placeholder:text-slate-450"
            />
          </div>

          {/* Logs List scroll */}
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {filteredLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                <HelpCircle className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-black text-slate-500">
                  {searchQuery ? '找不到相符的心情日記唷！' : '目前還沒有心情紀錄。'}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  快在左側寫下你的第一篇陪伴日記吧！
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const conf = MOOD_DEFINITIONS[log.mood];
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={log.id}
                    className="bg-[#FAF8F5] border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-transform duration-200"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl filter drop-shadow-sm select-none">
                          {conf.emoji}
                        </span>
                        <div>
                          <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            {conf.label}日
                            {log.xpGained > 0 ? (
                              <span className="text-[9px] font-black bg-rose-50 border border-rose-200 text-rose-650 px-1.5 py-0.2 rounded">
                                +{log.xpGained} XP
                              </span>
                            ) : log.xpGained < 0 ? (
                              <span className="text-[9px] font-black bg-indigo-50 border border-indigo-200 text-indigo-650 px-1.5 py-0.2 rounded">
                                {log.xpGained} XP
                              </span>
                            ) : (
                              <span className="text-[9px] font-black bg-slate-50 border border-slate-250 text-slate-650 px-1.5 py-0.2 rounded">
                                +0 XP
                              </span>
                            )}
                          </p>
                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{log.date} {log.time}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1.5 text-slate-350 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                        title="刪除這筆紀錄"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-slate-700 mt-2.5 leading-relaxed bg-white p-3 rounded-xl border-2 border-slate-900/5 whitespace-pre-wrap">
                      {log.note}
                    </p>

                    {log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {log.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-black px-2 py-0.5 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Sweet Growth Feedback Pop-up/Modal */}
      <AnimatePresence>
        {showFeedback && lastFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowFeedback(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-slate-900 rounded-3xl max-w-md w-full p-6 text-center shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-6xl animate-bounce inline-block mb-3 drop-shadow-md select-none">
                {lastFeedback.leveledUp ? '🎉' : lastFeedback.emoji}
              </span>

              <h4 className="text-2xl font-black text-slate-900 mb-2">
                {lastFeedback.leveledUp ? '🆙 寵物升級了！' : '心情順利寫入儲存罐！'}
              </h4>

              {lastFeedback.leveledUp && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 font-extrabold rounded-full border-2 border-yellow-300 text-xs mb-3">
                  <Trophy className="w-3.5 h-3.5 fill-yellow-500 text-yellow-600" />
                  寵物已順利蛻變至更強大的姿態！
                </div>
              )}

              <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {lastFeedback.text}
              </p>

              <button
                type="button"
                onClick={() => setShowFeedback(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px]"
              >
                太棒了，回寵物庭院！
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
