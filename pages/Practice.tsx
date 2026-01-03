
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LESSONS, TEXTS, fetchLessonContent } from '../constants';
import { LessonItem } from '../types';
import { ArrowLeft, RefreshCw, Volume2, Loader2, Grid3x3, Brain, Headphones } from 'lucide-react';
import MemoryGame from '../components/games/MemoryGame';
import AudioChallenge from '../components/games/AudioChallenge';

const Practice: React.FC = () => {
  const { language, progress } = useAppContext();
  const t = TEXTS;
  
  const [practiceItems, setPracticeItems] = useState<LessonItem[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'free' | 'memory' | 'challenge'>('free');

  // Load items from unlocked lessons
  useEffect(() => {
    const loadItems = async () => {
        setLoading(true);
        const allItems: LessonItem[] = [];
        // Even if locked in state, we allow practice of content from "available" lessons logic.
        const unlockedIds = LESSONS.map(l => l.lesson_id); 

        try {
            const lessonPromises = unlockedIds.map(id => fetchLessonContent(id));
            const loadedLessons = await Promise.all(lessonPromises);

            loadedLessons.forEach(lesson => {
                if (!lesson) return;
                if (lesson.items) {
                    lesson.items.forEach(item => {
                       if (item.audio?.main && item.text_ar.length < 15) allItems.push(item);
                    });
                }
                if (lesson.practice) {
                    lesson.practice.forEach(p => {
                        if (p.audio?.main) allItems.push(p);
                    });
                }
            });

            // Get a decent number of items for variety
            const shuffled = allItems.sort(() => 0.5 - Math.random()).slice(0, 30);
            setPracticeItems(shuffled);
        } catch (e) {
            console.error("Failed to load practice items", e);
        } finally {
            setLoading(false);
        }
    };

    loadItems();
  }, [progress.completedLessons, refreshTrigger]);

  const handlePlay = (item: LessonItem) => {
      if (playingId) return;
      setPlayingId(item.id);

      const audioSrc = item.audio?.main;
      if (!audioSrc) {
          setTimeout(() => setPlayingId(null), 1000);
          return;
      }
      
      const audio = new Audio(audioSrc);
      audio.crossOrigin = "anonymous";
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setTimeout(() => setPlayingId(null), 1000);
      audio.play().catch(() => setTimeout(() => setPlayingId(null), 1000));
  };

  const refreshItems = () => {
      setRefreshTrigger(prev => prev + 1);
  };
  
  const CARD_VARIANTS = [
    'from-orange-100 to-orange-200 border-orange-300',
    'from-blue-100 to-blue-200 border-blue-300',
    'from-emerald-100 to-emerald-200 border-emerald-300',
    'from-purple-100 to-purple-200 border-purple-300',
    'from-rose-100 to-rose-200 border-rose-300',
    'from-amber-100 to-amber-200 border-amber-300',
    'from-cyan-100 to-cyan-200 border-cyan-300',
    'from-lime-100 to-lime-200 border-lime-300',
    'from-fuchsia-100 to-fuchsia-200 border-fuchsia-300',
    'from-sky-100 to-sky-200 border-sky-300',
    'from-indigo-100 to-indigo-200 border-indigo-300',
    'from-teal-100 to-teal-200 border-teal-300',
  ];

  return (
    <div className={`max-w-4xl mx-auto p-4 sm:p-6 pb-24 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link 
            to="/"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
            <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">{t.practiceMode[language]}</h1>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-full w-full sm:w-auto overflow-x-auto">
            <button 
                onClick={() => setMode('free')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'free' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Grid3x3 size={16} /> Free
            </button>
            <button 
                onClick={() => setMode('memory')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'memory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Brain size={16} /> Memory
            </button>
            <button 
                onClick={() => setMode('challenge')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'challenge' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Headphones size={16} /> Challenge
            </button>
        </div>
      </div>

      {loading ? (
          <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand" size={32} />
          </div>
      ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
              {mode === 'free' && (
                  <>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center mb-6 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-slate-700 mb-2">{t.touchToPlay[language]}</h2>
                            <p className="text-slate-500 mb-4">Tap any word to hear its pronunciation.</p>
                            <button onClick={refreshItems} className="flex items-center gap-2 text-sm font-bold text-brand hover:underline">
                                <RefreshCw size={14} /> Shuffle Words
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {practiceItems.map((item, index) => {
                            const variantClass = CARD_VARIANTS[index % CARD_VARIANTS.length];
                            const isPlaying = playingId === item.id;
                            
                            return (
                            <div 
                                key={item.id}
                                onClick={() => handlePlay(item)}
                                className={`
                                    relative aspect-square flex flex-col items-center justify-center
                                    rounded-3xl cursor-pointer
                                    transition-all duration-300 active:scale-110 touch-manipulation
                                    ${isPlaying 
                                        ? 'scale-110 z-50 bg-brand text-white shadow-2xl ring-4 ring-brand-light rotate-2' 
                                        : `bg-gradient-to-br ${variantClass} shadow-md hover:shadow-xl hover:-translate-y-1 border`}
                                `}
                            >
                                {isPlaying && (
                                    <div className="fixed inset-0 bg-black/10 z-[-1] rounded-3xl backdrop-blur-[1px]" />
                                )}
                                
                                <span className={`font-arabic font-bold ${isPlaying ? 'text-white scale-125' : 'text-slate-800'} ${item.text_ar.length > 5 ? 'text-2xl' : 'text-4xl'} transition-transform duration-300`}>
                                    {item.text_ar}
                                </span>
                                
                                {isPlaying && (
                                    <Volume2 size={24} className="mt-2 text-white animate-bounce absolute bottom-4" />
                                )}
                            </div>
                        )})}
                    </div>
                  </>
              )}

              {mode === 'memory' && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-slate-100 min-h-[60vh]">
                      <MemoryGame items={practiceItems} onClose={() => setMode('free')} />
                  </div>
              )}

              {mode === 'challenge' && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-slate-100 min-h-[60vh]">
                      <AudioChallenge items={practiceItems} onClose={() => setMode('free')} />
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default Practice;
