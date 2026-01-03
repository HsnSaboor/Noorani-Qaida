
import React, { useState, useEffect, useRef } from 'react';
import { LessonItem } from '../../types';
import { playSuccessSound, playErrorSound } from '../../data/utils';
import { Volume2, CheckCircle, XCircle, Loader2, RefreshCw, ArrowRight } from 'lucide-react';

interface AudioChallengeProps {
  items: LessonItem[];
  onClose: () => void;
}

const AudioChallenge: React.FC<AudioChallengeProps> = ({ items, onClose }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<LessonItem[]>([]);
  const [targetItem, setTargetItem] = useState<LessonItem | null>(null);
  
  const [selection, setSelection] = useState<{ round: number; itemId: string } | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  
  const MAX_ROUNDS = 5;

  // Memoize valid items to prevent re-runs unless items actually change deep content
  const validItems = React.useMemo(() => items.filter(i => i.text_ar), [items]);

  useEffect(() => {
    if (validItems.length < 2) {
      setGameOver(true);
    } else {
      startNewGame();
    }
    
    return () => {
        stopAllAudio();
        if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    }
  }, [validItems]);

  const stopAllAudio = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
      }
      if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
  };

  const startNewGame = () => {
      setScore(0);
      setGameOver(false);
      setupRound(0);
  };

  const setupRound = (roundIndex: number) => {
      stopAllAudio();
      
      if (validItems.length < 2) return;

      const target = validItems[Math.floor(Math.random() * validItems.length)];
      
      const distractors = validItems
        .filter(i => i.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const roundOptions = [target, ...distractors].sort(() => 0.5 - Math.random());
      
      setSelection(null);
      setTargetItem(target);
      setOptions(roundOptions);
      setCurrentRound(roundIndex);

      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = window.setTimeout(() => {
          playAudio(target.audio?.main, target.text_ar);
      }, 500);
  };

  const playTTS = (text: string) => {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.8;
          
          utterance.onstart = () => setIsPlaying(true);
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          
          window.speechSynthesis.speak(utterance);
      } else {
          setIsPlaying(false);
      }
  };

  const playAudio = (url?: string, text?: string) => {
      stopAllAudio();

      if (!url) {
          if (text) playTTS(text);
          return;
      }
      
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      
      audio.onerror = () => {
          if (text) playTTS(text);
          else setIsPlaying(false);
      };
      
      audio.play().catch(() => {
          if (text) playTTS(text);
          else setIsPlaying(false);
      });
  };

  const handleSelect = (item: LessonItem) => {
      if (selection) return; 
      
      playAudio(item.audio?.main, item.text_ar);
      
      setSelection({ round: currentRound, itemId: item.id });
      
      const isCorrect = item.id === targetItem?.id;

      if (isCorrect) {
          setScore(prev => prev + 1);
          setTimeout(() => playSuccessSound(), 200);
      } else {
          setTimeout(() => playErrorSound(), 200);
      }
  };

  const handleNext = () => {
      if (currentRound < MAX_ROUNDS - 1) {
          setupRound(currentRound + 1);
      } else {
          setGameOver(true);
      }
  };

  if (gameOver) {
      if (validItems.length < 2) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p>Loading game content...</p>
            </div>
          );
      }

      return (
        <div 
            className="flex flex-col items-center justify-center h-full text-center animate-in zoom-in p-6"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            <div className={`p-6 rounded-full mb-6 ${score > MAX_ROUNDS / 2 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'}`}>
                {score > MAX_ROUNDS / 2 ? <CheckCircle size={48} /> : <XCircle size={48} />}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Game Over!</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                You scored <span className="font-bold text-brand">{score}</span> out of {MAX_ROUNDS}
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={startNewGame}
                    className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors shadow-lg"
                >
                    <RefreshCw size={20} /> Play Again
                </button>
                <button 
                    onClick={onClose}
                    className="text-slate-500 font-bold hover:text-slate-800 dark:hover:text-slate-200"
                >
                    Close
                </button>
            </div>
        </div>
      );
  }

  if (!targetItem) {
      return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-brand" size={32} /></div>;
  }

  return (
    <div 
        className={`flex flex-col h-full max-w-2xl mx-auto p-2`}
        // STOP PROPAGATION: Prevent parent LessonPage from detecting swipes/clicks
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
    >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Audio Challenge</h2>
            <div className="flex gap-3">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Round {currentRound + 1}/{MAX_ROUNDS}</span>
                <span className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg text-sm font-bold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">Score: {score}</span>
            </div>
        </div>

        {/* Content Wrapper */}
        <div key={currentRound} className="animate-in fade-in slide-in-from-right duration-300 flex-1 flex flex-col">
            {/* Play Button */}
            <div className="flex justify-center mb-10">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Double safety
                        playAudio(targetItem?.audio?.main, targetItem?.text_ar);
                    }}
                    className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 relative
                        ${isPlaying 
                            ? 'bg-brand scale-110 ring-4 ring-brand-light dark:ring-brand-dark' 
                            : 'bg-gradient-to-br from-brand to-cyan-500 hover:scale-105'}
                    `}
                    title="Play Sound Again"
                >
                    <div className={`absolute inset-0 rounded-full bg-white opacity-20 ${isPlaying ? 'animate-ping' : ''}`}></div>
                    <Volume2 size={48} className="text-white relative z-10" />
                </button>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {options.map((item) => {
                    const isSelected = selection?.round === currentRound && selection?.itemId === item.id;
                    const isCorrect = item.id === targetItem?.id;
                    
                    let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-brand hover:shadow-md dark:hover:border-brand-dark";
                    
                    if (isSelected) {
                        if (isCorrect) {
                            btnClass = "bg-green-500 border-green-600 text-white shadow-lg scale-[1.02] ring-4 ring-green-200 dark:ring-green-900";
                        } else {
                            btnClass = "bg-red-500 border-red-600 text-white shadow-lg scale-95 ring-4 ring-red-200 dark:ring-red-900";
                        }
                    } else if (selection?.round === currentRound && isCorrect) {
                        btnClass = "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300 shadow-md"; 
                    } else if (selection) {
                        btnClass = "opacity-40 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 grayscale";
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={(e) => {
                                e.stopPropagation(); // Double safety
                                handleSelect(item);
                            }}
                            disabled={selection !== null}
                            className={`
                                h-28 rounded-2xl text-4xl font-bold font-arabic transition-all duration-300 shadow-sm
                                ${btnClass}
                                ${selection && !isSelected ? 'cursor-not-allowed opacity-50' : ''}
                            `}
                        >
                            {item.text_ar}
                        </button>
                    )
                })}
            </div>

            {/* Next Button - Distinct Space */}
            {selection && (
                <div className="flex justify-center mt-auto animate-in slide-in-from-bottom-4 pb-6">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="bg-brand text-white text-lg font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Next <ArrowRight size={24} />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default AudioChallenge;
