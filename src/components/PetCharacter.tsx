/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { PetType, MoodType } from '../types';

interface PetCharacterProps {
  type: PetType;
  stage: 'baby' | 'junior' | 'adult';
  mood: MoodType;
  isInteracting: boolean;
  interactionType: string;
}

export const getPetStageName = (stage: 'baby' | 'junior' | 'adult') => {
  switch (stage) {
    case 'baby': return '寶寶階段 (Lv.1 - Lv.2)';
    case 'junior': return '幼年階段 (Lv.3 - Lv.4)';
    case 'adult': return '成年階段 (Lv.5+)';
  }
};

export const getPetTypeName = (type: PetType) => {
  switch (type) {
    case 'slime': return '抹茶史萊姆';
    case 'cat': return '可可貓貓球';
    case 'dino': return '哈密瓜小恐龍';
  }
};

export const PetCharacter: React.FC<PetCharacterProps> = ({
  type,
  stage,
  mood,
  isInteracting,
  interactionType,
}) => {
  // Determine pet scale based on growth stage
  const getStageScale = () => {
    switch (stage) {
      case 'baby': return 0.75;
      case 'junior': return 1.0;
      case 'adult': return 1.25;
    }
  };

  // Determine animations based on mood and interaction
  const getAnimatePreset = () => {
    if (isInteracting) {
      switch (interactionType) {
        case 'feed':
          return {
            y: [0, -25, 10, -10, 0],
            scaleY: [1, 0.85, 1.15, 0.95, 1],
            scaleX: [1, 1.15, 0.85, 1.05, 1],
          };
        case 'play':
          return {
            y: [0, -35, 0, -20, 0],
            x: [0, -15, 15, -10, 10, 0],
            rotate: [0, -10, 10, -5, 5, 0],
          };
        case 'pet':
          return {
            scaleY: [1, 0.8, 1.05, 0.95, 1],
            scaleX: [1, 1.15, 0.95, 1.02, 1],
            y: [0, -5, 0],
          };
        case 'clean':
          return {
            rotate: [0, 45, -45, 30, -30, 0],
            x: [0, 10, -10, 5, -5, 0],
          };
        default:
          return {};
      }
    }

    // Default idling animation based on mood
    switch (mood) {
      case 'happy':
        return {
          y: [0, -15, 0],
          scaleY: [1, 0.95, 1.05, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'sad':
        return {
          x: [-2, 2, -1, 1, 0],
          y: [0, 3, 0],
          rotate: [-1, 2, -1],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'angry':
        return {
          x: [-3, 3, -3, 3, 0],
          y: [0, -2, 1, -1, 0],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "linear"
          }
        };
      case 'anxious':
        return {
          rotate: [-1.5, 1.5, -1.5],
          x: [-1, 1, -1],
          scale: [0.99, 1.01, 0.99],
          transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'calm':
      default:
        return {
          scaleY: [1, 1.03, 1],
          scaleX: [1, 0.98, 1],
          y: [0, -3, 0],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
    }
  };

  const currentScale = getStageScale();
  const animationPreset = getAnimatePreset();

  // Color profiles
  const colors = {
    slime: {
      primary: '#51CF66', // emerald
      light: '#A9E34B',
      shadow: '#37B24D',
      background: 'radial-gradient(circle, #D8F5A2 0%, #37B24D 100%)'
    },
    cat: {
      primary: '#9C7A60', // gentle cocoa
      light: '#F8F0FC',
      shadow: '#6F4E37',
      blush: '#FF8787',
    },
    dino: {
      primary: '#20B2AA', // teal melon
      light: '#7FFFD4',
      shadow: '#128C87',
      orange: '#FFA500',
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Dynamic Background Aura */}
      <div className={`absolute w-44 h-44 rounded-full filter blur-3xl opacity-25 transition-all duration-1000 ${
        mood === 'happy' ? 'bg-rose-400 scale-125' :
        mood === 'sad' ? 'bg-indigo-300' :
        mood === 'angry' ? 'bg-orange-500 scale-110' :
        mood === 'anxious' ? 'bg-yellow-300' : 'bg-emerald-300'
      }`} />

      {/* Interactive Activity Particles/Effects */}
      {isInteracting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: [1, 1, 0], scale: [1, 1.2, 0.8], y: [-10, -50, -70] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute z-10 text-4xl pointer-events-none font-sans"
        >
          {interactionType === 'feed' && '🍪 Yummy!'}
          {interactionType === 'play' && '⭐️ Wheee!'}
          {interactionType === 'pet' && '💞 Hehe~'}
          {interactionType === 'clean' && '✨ Sparkling!'}
        </motion.div>
      )}

      {/* Mood Emotion Floating Emotes */}
      {!isInteracting && (
        <React.Fragment>
          {mood === 'happy' && (
            <motion.div
              animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-4 right-10 z-10 text-2xl filter drop-shadow"
            >
              ❤️
            </motion.div>
          )}
          {mood === 'sad' && (
            <motion.div
              animate={{ y: [-5, 15], opacity: [0, 0.8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
              className="absolute top-12 left-10 z-10 text-2xl text-blue-400 drop-shadow-sm font-mono"
            >
              💦
            </motion.div>
          )}
          {mood === 'angry' && (
            <motion.div
              animate={{ scale: [0.9, 1.2, 0.9], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute -top-6 left-12 z-10 text-2xl text-red-500 font-bold"
            >
              💢
            </motion.div>
          )}
          {mood === 'anxious' && (
            <motion.div
              animate={{ x: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute -top-4 right-14 z-10 text-2xl font-semibold"
            >
              😰
            </motion.div>
          )}
        </React.Fragment>
      )}

      {/* Main Pet SVG container with motion */}
      <motion.div
        animate={animationPreset}
        style={{ scale: currentScale }}
        className="w-52 h-52 flex items-center justify-center cursor-pointer transition-all duration-300"
        id="pet-character-container"
      >
        {type === 'slime' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg filter">
            <defs>
              <linearGradient id="slimeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A9E34B" />
                <stop offset="100%" stopColor="#37B24D" />
              </linearGradient>
              <linearGradient id="slimeFaceShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#40C057" />
                <stop offset="100%" stopColor="#2F9E44" />
              </linearGradient>
            </defs>

            {/* Stage-dependent Base Blob */}
            {stage === 'baby' && (
              // Round, bouncy cute baby droplet
              <path
                d="M 100 40 C 135 40, 160 80, 160 120 C 160 160, 130 170, 100 170 C 70 170, 40 160, 40 120 C 40 80, 65 40, 100 40 Z"
                fill="url(#slimeGrad)"
              />
            )}

            {stage === 'junior' && (
              // Slightly squashed playful blob with little leaf stem
              <g>
                <path
                  d="M 100 30 C 145 30, 170 70, 170 120 C 170 165, 140 175, 100 175 C 60 175, 30 165, 30 120 C 30 70, 55 30, 100 30 Z"
                  fill="url(#slimeGrad)"
                />
                {/* Seed leaf stem */}
                <path d="M 100 30 Q 110 15 125 12 Q 113 25 100 30" fill="#2B8A3E" />
                <path d="M 100 30 Q 90 15 75 14 Q 87 25 100 30" fill="#2B8A3E" />
              </g>
            )}

            {stage === 'adult' && (
              // Crown flower + multi-layered glorious drop slime
              <g>
                <path
                  d="M 100 25 C 155 25, 180 65, 180 120 C 180 170, 145 180, 100 180 C 55 180, 20 170, 20 120 C 20 65, 45 25, 100 25 Z"
                  fill="url(#slimeGrad)"
                />
                {/* Cute flower bloom crown */}
                <circle cx="100" cy="22" r="8" fill="#FFF" />
                <circle cx="89" cy="20" r="6" fill="#FFA94D" />
                <circle cx="111" cy="20" r="6" fill="#FFA94D" />
                <circle cx="94" cy="11" r="6" fill="#FF8787" />
                <circle cx="106" cy="11" r="6" fill="#FF8787" />
                <circle cx="100" cy="18" r="4" fill="#FFE066" />
                {/* Slime fluid layers */}
                <path d="M 50 140 Q 100 155 150 140" fill="none" stroke="#2B8A3E" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
              </g>
            )}

            {/* Facial Eyes & Mouth depending on Mood */}
            {mood === 'happy' && (
              <g>
                {/* Curved Happy eyes */}
                <path d="M 65 110 Q 75 95 85 110" fill="none" stroke="#1E5422" strokeWidth="6" strokeLinecap="round" />
                <path d="M 115 110 Q 125 95 135 110" fill="none" stroke="#1E5422" strokeWidth="6" strokeLinecap="round" />
                {/* Wide happy tongue out mouth */}
                <path d="M 90 125 Q 100 145 110 125 Z" fill="#FF8787" stroke="#1E5422" strokeWidth="4" />
                {/* Cute pink cheek blushes */}
                <circle cx="55" cy="120" r="10" fill="#FFA8A8" opacity="0.7" />
                <circle cx="145" cy="120" r="10" fill="#FFA8A8" opacity="0.7" />
              </g>
            )}

            {mood === 'sad' && (
              <g>
                {/* Teary drooping eyes */}
                <path d="M 65 105 A 8 8 0 0 0 81 105" fill="none" stroke="#1E5422" strokeWidth="5" strokeLinecap="round" />
                <path d="M 119 105 A 8 8 0 0 0 135 105" fill="none" stroke="#1E5422" strokeWidth="5" strokeLinecap="round" />
                {/* Wobbly wavy sad mouth */}
                <path d="M 90 130 Q 100 120 110 130" fill="none" stroke="#1E5422" strokeWidth="4" strokeLinecap="round" />
                {/* Tears */}
                <path d="M 73 112 Q 73 130 65 130 Q 77 130 73 112" fill="#74C0FC" />
              </g>
            )}

            {mood === 'angry' && (
              <g>
                {/* Angry angled eyebrows */}
                <path d="M 60 95 L 85 108" stroke="#1E5422" strokeWidth="6" strokeLinecap="round" />
                <path d="M 140 95 L 115 108" stroke="#1E5422" strokeWidth="6" strokeLinecap="round" />
                {/* Sharp pupils */}
                <circle cx="72" cy="113" r="5" fill="#1E5422" />
                <circle cx="128" cy="113" r="5" fill="#1E5422" />
                {/* Frowning mouth */}
                <path d="M 92 135 Q 100 125 108 135" fill="none" stroke="#1E5422" strokeWidth="4.5" strokeLinecap="round" />
                {/* Angered cheek red lines */}
                <path d="M 52 122 L 62 118 M 55 126 L 65 122" stroke="#FF6B6B" strokeWidth="3" />
                <path d="M 148 122 L 138 118 M 145 126 L 135 122" stroke="#FF6B6B" strokeWidth="3" />
              </g>
            )}

            {mood === 'anxious' && (
              <g>
                {/* Spiral/jitter eyes */}
                <g stroke="#1E5422" strokeWidth="4" fill="none">
                  <path d="M 65 110 Q 75 100 75 110 T 67 112" />
                  <path d="M 125 110 Q 135 100 135 110 T 127 112" />
                </g>
                {/* Small circular mouth */}
                <circle cx="100" cy="130" r="7" fill="none" stroke="#1E5422" strokeWidth="4" />
                {/* Sweat/blue lines */}
                <rect x="95" y="80" width="10" height="2" fill="#74C0FC" />
                <rect x="93" y="84" width="14" height="2.5" fill="#74C0FC" />
              </g>
            )}

            {mood === 'calm' && (
              <g>
                {/* Calm relaxed eyes */}
                <line x1="65" y1="110" x2="80" y2="110" stroke="#1E5422" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="120" y1="110" x2="135" y2="110" stroke="#1E5422" strokeWidth="5.5" strokeLinecap="round" />
                {/* Small resting cat mouth */}
                <path d="M 94 125 Q 100 130 106 125" fill="none" stroke="#1E5422" strokeWidth="4" strokeLinecap="round" />
                {/* Soft glow blush */}
                <circle cx="58" cy="118" r="8" fill="#F03E3E" opacity="0.3" />
                <circle cx="142" cy="118" r="8" fill="#F03E3E" opacity="0.3" />
              </g>
            )}

            {/* Growth / Pacifier for Baby */}
            {stage === 'baby' && (
              <g>
                {/* Mini Baby yellow pacifier */}
                <circle cx="100" cy="130" r="10" fill="#FFE066" stroke="#C5A000" strokeWidth="2.5" />
                <path d="M 100 140 A 10 10 0 0 1 100 120" fill="none" stroke="#D9480F" strokeWidth="3" />
              </g>
            )}
          </svg>
        )}

        {type === 'cat' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl filter">
            <defs>
              <linearGradient id="catGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C49A70" />
                <stop offset="100%" stopColor="#7B563D" />
              </linearGradient>
              <linearGradient id="catInnerEar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA8A8" />
                <stop offset="100%" stopColor="#FF6B6B" />
              </linearGradient>
            </defs>

            {/* Tail based on stage */}
            {stage !== 'baby' && (
              <motion.path
                d="M 155 140 C 180 140, 190 100, 185 85 C 180 75, 175 80, 175 85 C 180 95, 170 125, 150 125"
                fill="none"
                stroke="#634430"
                strokeWidth="11"
                strokeLinecap="round"
                animate={{ rotate: mood === 'happy' ? [0, 20, -10, 20, 0] : [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: mood === 'happy' ? 1.5 : 3, ease: 'easeInOut' }}
                style={{ originX: '150px', originY: '125px' }}
              />
            )}

            {/* Main Cat Body */}
            <circle cx="100" cy="120" r="65" fill="url(#catGrad)" />

            {/* Cat Ears */}
            {stage === 'baby' && (
              <g>
                {/* Tiny kitten ears */}
                <polygon points="50,65 35,35 70,55" fill="#7B563D" stroke="#5C3E2B" strokeWidth="3" />
                <polygon points="50,65 35,35 70,55" fill="url(#catInnerEar)" scale="0.6" />
                <polygon points="150,65 165,35 130,55" fill="#7B563D" stroke="#5C3E2B" strokeWidth="3" />
                <polygon points="150,65 165,35 130,55" fill="url(#catInnerEar)" scale="0.6" />
              </g>
            )}

            {stage !== 'baby' && (
              <g>
                {/* Standard robust rounded kitty ears */}
                <path d="M 40 70 L 25 25 Q 55 25 70 60 Z" fill="#634430" stroke="#4B3222" strokeWidth="3.5" />
                <path d="M 45 65 L 35 35 Q 55 35 63 58 Z" fill="url(#catInnerEar)" />

                <path d="M 160 70 L 175 25 Q 145 25 130 60 Z" fill="#634430" stroke="#4B3222" strokeWidth="3.5" />
                <path d="M 155 65 L 165 35 Q 145 35 137 58 Z" fill="url(#catInnerEar)" />
              </g>
            )}

            {/* Forehead Stripes */}
            <path d="M 93 55 L 95 72 L 97 55 Z" fill="#4B3222" />
            <path d="M 103 55 L 105 72 L 107 55 Z" fill="#4B3222" />

            {/* Dynamic Facial Expressions */}
            {mood === 'happy' && (
              <g>
                {/* Star-shaped eyes / twinkling curved lines */}
                <path d="M 55 105 Q 67 93 75 105" fill="none" stroke="#2B1A0D" strokeWidth="6.5" strokeLinecap="round" />
                <path d="M 125 105 Q 133 93 145 105" fill="none" stroke="#2B1A0D" strokeWidth="6.5" strokeLinecap="round" />
                {/* Blushing cheeks */}
                <ellipse cx="50" cy="116" rx="12" ry="8" fill="#FFA8A8" opacity="0.8" />
                <ellipse cx="150" cy="116" rx="12" ry="8" fill="#FFA8A8" opacity="0.8" />
                {/* Cute nose + double cat mouth */}
                <polygon points="98,112 102,112 100,115" fill="#FFA8A8" />
                <path d="M 88 122 Q 100 134 100 122 Q 100 134 112 122" fill="none" stroke="#2B1A0D" strokeWidth="5.5" strokeLinecap="round" />
                {/* Whiskers */}
                <line x1="38" y1="120" x2="16" y2="117" stroke="#4B3222" strokeWidth="3" strokeLinecap="round" />
                <line x1="38" y1="126" x2="18" y2="128" stroke="#4B3222" strokeWidth="3" strokeLinecap="round" />
                <line x1="162" y1="120" x2="184" y2="117" stroke="#4B3222" strokeWidth="3" strokeLinecap="round" />
                <line x1="162" y1="126" x2="182" y2="128" stroke="#4B3222" strokeWidth="3" strokeLinecap="round" />
              </g>
            )}

            {mood === 'sad' && (
              <g>
                {/* Teary eyes */}
                <circle cx="68" cy="108" r="8" fill="#2B1A0D" />
                <circle cx="66" cy="106" r="3.5" fill="white" />
                <circle cx="132" cy="108" r="8" fill="#2B1A0D" />
                <circle cx="130" cy="106" r="3.5" fill="white" />
                {/* Tear drop */}
                <path d="M 136 112 L 142 128 C 146 128, 142 135, 137 131 C 132 127, 136 112, 136 112" fill="#74C0FC" />
                {/* Sad single wavy mouth */}
                <path d="M 90 126 Q 100 118 110 126" fill="none" stroke="#2B1A0D" strokeWidth="4" strokeLinecap="round" />
                {/* Drooping whiskers */}
                <line x1="38" y1="123" x2="18" y2="127" stroke="#4B3222" strokeWidth="3.5" />
                <line x1="162" y1="123" x2="182" y2="127" stroke="#4B3222" strokeWidth="3.5" />
              </g>
            )}

            {mood === 'angry' && (
              <g>
                {/* Angled angry eyebrows and glowing red eyes */}
                <path d="M 50 92 L 78 102" stroke="#2B1A0D" strokeWidth="6" strokeLinecap="round" />
                <path d="M 150 92 L 122 102" stroke="#2B1A0D" strokeWidth="6" strokeLinecap="round" />
                <circle cx="68" cy="111" r="7.5" fill="#E03131" stroke="#2B1A0D" strokeWidth="3" />
                <circle cx="132" cy="111" r="7.5" fill="#E03131" stroke="#2B1A0D" strokeWidth="3" />
                {/* Small sharp fangs in a grimacing mouth */}
                <path d="M 92 130 C 92 135, 108 135, 108 130 Z" fill="#FFF" stroke="#2B1A0D" strokeWidth="3" />
                <polygon points="95,130 98,135 101,130" fill="#FFF" />
                <polygon points="107,130 104,135 101,130" fill="#FFF" />
              </g>
            )}

            {mood === 'anxious' && (
              <g>
                {/* Worried eyes */}
                <path d="M 55 102 C 55 92, 75 92, 75 102" fill="none" stroke="#2B1A0D" strokeWidth="5" />
                <path d="M 125 102 C 125 92, 145 92, 145 102" fill="none" stroke="#2B1A0D" strokeWidth="5" />
                <circle cx="65" cy="108" r="3" fill="#2B1A0D" />
                <circle cx="135" cy="108" r="3" fill="#2B1A0D" />
                {/* Shivering tiny mouth */}
                <path d="M 90 125 L 95 120 L 100 125 L 105 120 L 110 125" fill="none" stroke="#2B1A0D" strokeWidth="4.5" strokeLinecap="round" />
              </g>
            )}

            {mood === 'calm' && (
              <g>
                {/* Contented sleeping eye loops */}
                <path d="M 56 108 Q 68 116 80 108" fill="none" stroke="#2B1A0D" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 120 108 Q 132 116 144 108" fill="none" stroke="#2B1A0D" strokeWidth="5.5" strokeLinecap="round" />
                {/* Satisfied smiling curved mouth */}
                <path d="M 94 121 Q 100 126 106 121" fill="none" stroke="#2B1A0D" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse cx="50" cy="116" rx="8" ry="4" fill="#FFA5A5" opacity="0.6" />
                <ellipse cx="150" cy="116" rx="8" ry="4" fill="#FFA5A5" opacity="0.6" />
              </g>
            )}

            {/* Adult Accessory details */}
            {stage === 'adult' && (
              <g>
                {/* Elegant collar with golden bell */}
                <path d="M 55 160 Q 100 182 145 160" fill="none" stroke="#E03131" strokeWidth="6" strokeLinecap="round" />
                <circle cx="100" cy="176" r="11" fill="#FCC419" stroke="#E67E22" strokeWidth="3" />
                <circle cx="100" cy="172" r="3.5" fill="#4B3222" />
                {/* Sparkly ears / details */}
                <polygon points="30,85 36,92 28,95 24,88" fill="#FFF" opacity="0.5" />
              </g>
            )}

            {/* Baby pacifier/ribbon */}
            {stage === 'baby' && (
              <g>
                <circle cx="100" cy="125" r="9" fill="url(#catInnerEar)" />
                <path d="M 94 125 L 106 125" stroke="#FFF" strokeWidth="3" />
              </g>
            )}
          </svg>
        )}

        {type === 'dino' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl filter">
            <defs>
              <linearGradient id="dinoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#12B886" />
                <stop offset="100%" stopColor="#087F5B" />
              </linearGradient>
              <linearGradient id="dinoChest" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2F9F3" />
                <stop offset="100%" stopColor="#8CE9C4" />
              </linearGradient>
            </defs>

            {/* Baby Dinosaur Eggshell peeking */}
            {stage === 'baby' && (
              <g>
                {/* Back eggshell */}
                <ellipse cx="100" cy="130" rx="60" ry="50" fill="#FFF" stroke="#CFD8DC" strokeWidth="5.5" />
                {/* Tiny Dino body peering */}
                <path d="M 60 100 C 60 60, 140 60, 140 100 Z" fill="url(#dinoGrad)" />
                {/* Front Jagged Eggshell */}
                <path d="M 40 130 L 60 110 L 80 135 L 100 110 L 120 135 L 140 115 L 160 130 C 160 160, 40 160, 40 130 Z" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="4" />
                {/* Baby rosy cheeks */}
                <circle cx="70" cy="95" r="7" fill="#FFA8A8" opacity="0.8" />
                <circle cx="130" cy="95" r="7" fill="#FFA8A8" opacity="0.8" />
              </g>
            )}

            {/* Junior and Adult Dinosaur */}
            {stage !== 'baby' && (
              <g>
                {/* Dino back spikes */}
                <g fill="#F59F00">
                  <polygon points="50,60 30,70 50,85" />
                  <polygon points="40,85 15,100 40,115" />
                  <polygon points="40,115 15,130 45,145" />
                  {stage === 'adult' && (
                    <React.Fragment>
                      <polygon points="52,40 38,45 52,55" />
                      <polygon points="150,140 170,150 150,165" />
                    </React.Fragment>
                  )}
                </g>

                {/* Dino Tail */}
                <path d="M 50 145 Q 15 170 30 185 Q 55 180 65 145 Z" fill="url(#dinoGrad)" />
                {stage === 'adult' && (
                  <circle cx="23" cy="177" r="6" fill="#F59F00" />
                )}

                {/* Mighty Dino body shape (chubby cute) */}
                <path
                  d="M 100 40 C 145 40, 155 75, 155 110 C 155 145, 140 175, 100 175 C 60 175, 52 145, 52 110 C 52 75, 55 40, 100 40 Z"
                  fill="url(#dinoGrad)"
                />

                {/* Pale Chest patch */}
                <path d="M 80 110 C 80 85, 120 85, 120 110 C 120 145, 115 175, 100 175 C 85 175, 80 145, 80 110 Z" fill="url(#dinoChest)" />
              </g>
            )}

            {/* Facial Elements based on Stage & Mood */}
            {mood === 'happy' && (
              <g>
                {/* Twinkly eyes */}
                <path d="M 75 88 Q 85 78 92 88" fill="none" stroke="#053F2E" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 118 88 Q 125 78 132 88" fill="none" stroke="#053F2E" strokeWidth="5.5" strokeLinecap="round" />
                {stage !== 'baby' && (
                  <React.Fragment>
                    {/* Exuberant dinosaur grin */}
                    <path d="M 90 105 Q 105 125 120 105" fill="none" stroke="#053F2E" strokeWidth="5" strokeLinecap="round" />
                    {/* Playful tiny hands */}
                    <path d="M 60 120 Q 75 125 78 118" fill="none" stroke="url(#dinoGrad)" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 140 120 Q 125 125 122 118" fill="none" stroke="url(#dinoGrad)" strokeWidth="10" strokeLinecap="round" />
                  </React.Fragment>
                )}
                {stage === 'baby' && (
                  <path d="M 94 100 Q 100 106 106 100" fill="none" stroke="#053F2E" strokeWidth="4" strokeLinecap="round" />
                )}
                <circle cx="68" cy="95" r="8" fill="#FFA8A8" opacity="0.6" />
                <circle cx="132" cy="95" r="8" fill="#FFA8A8" opacity="0.6" />
              </g>
            )}

            {mood === 'sad' && (
              <g>
                {/* Teary puppy eyes */}
                <circle cx="82" cy="88" r="7.5" fill="#053F2E" />
                <circle cx="80" cy="85" r="3" fill="#FFF" />
                <circle cx="122" cy="88" r="7.5" fill="#053F2E" />
                <circle cx="120" cy="85" r="3" fill="#FFF" />
                {/* Sad downwards mouth */}
                <path d="M 95 108 Q 102 98 109 108" fill="none" stroke="#053F2E" strokeWidth="4.5" strokeLinecap="round" />
                {stage !== 'baby' && (
                  <g>
                    {/* Drooping hands */}
                    <path d="M 60 125 Q 70 135 68 130" fill="none" stroke="url(#dinoGrad)" strokeWidth="9" strokeLinecap="round" />
                    <path d="M 140 125 Q 130 135 132 130" fill="none" stroke="url(#dinoGrad)" strokeWidth="9" strokeLinecap="round" />
                  </g>
                )}
              </g>
            )}

            {mood === 'angry' && (
              <g>
                {/* Furious slanted lines */}
                <path d="M 72 74 L 92 84" stroke="#053F2E" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 132 74 L 112 84" stroke="#053F2E" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="82" cy="90" r="7" fill="#E03131" stroke="#053F2E" strokeWidth="2.5" />
                <circle cx="118" cy="90" r="7" fill="#E03131" stroke="#053F2E" strokeWidth="2.5" />
                {/* Open angry dragon puff */}
                <path d="M 94 105 Q 100 120 106 105 Z" fill="#FFA94D" stroke="#053F2E" strokeWidth="3" />
              </g>
            )}

            {mood === 'anxious' && (
              <g>
                <circle cx="82" cy="88" r="6" fill="#053F2E" />
                <circle cx="122" cy="88" r="6" fill="#053F2E" />
                {/* Worried squiggly line above head */}
                <path d="M 95 30 Q 100 15 105 30 T 115 30" fill="none" stroke="#74C0FC" strokeWidth="3.5" />
                <path d="M 93 105 Q 100 100 107 105" fill="none" stroke="#053F2E" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}

            {mood === 'calm' && (
              <g>
                {/* Horizontal serene bars */}
                <line x1="75" y1="88" x2="88" y2="88" stroke="#053F2E" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="114" y1="88" x2="127" y2="88" stroke="#053F2E" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 96 104 Q 101 108 106 104" fill="none" stroke="#053F2E" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="70" cy="94" r="5" fill="#E2F9F3" opacity="0.6" />
                <circle cx="130" cy="94" r="5" fill="#E2F9F3" opacity="0.6" />
              </g>
            )}
          </svg>
        )}
      </motion.div>

      {/* Pet Name & Badge Indicator */}
      <div className="mt-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
          {getPetStageName(stage)}
        </span>
      </div>
    </div>
  );
};
