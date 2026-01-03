
import React, { useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LESSONS, TEXTS } from '../constants';
import { Lock, Play, Check, ChevronDown, Layers, Zap, Target, BookMarked, BookOpen, Star, Cloud, Lightbulb } from 'lucide-react';

// Memoized Lesson Card
const LessonCard = memo(({
    title,
    description,
    lessonId,
    isCompleted,
    isLocked,
    progressPercent,
    onClick,
    categoryColor,
    objective,
    rule
}: {
    title: string;
    description: string;
    lessonId: number;
    isCompleted: boolean;
    isLocked: boolean;
    progressPercent: number;
    objective?: string;
    rule?: string;
    onClick: () => void;
    categoryColor: string;
}) => {

    // Playful Kid Gradients
    const gradients: Record<string, string> = {
        'blue': 'from-cyan-400 to-blue-500 border-blue-600',
        'indigo': 'from-indigo-400 to-violet-500 border-violet-600',
        'purple': 'from-fuchsia-400 to-purple-500 border-purple-600',
        'emerald': 'from-lime-400 to-emerald-500 border-emerald-600',
        'orange': 'from-yellow-400 to-orange-500 border-orange-600',
    };

    const gradientClass = gradients[categoryColor] || gradients['blue'];

    return (
        <div
            onClick={!isLocked ? onClick : undefined}
            className={`
            relative rounded-3xl p-6 transition-transform duration-200
            flex flex-col items-center gap-4 group cursor-pointer border-b-4 h-full text-center
            ${isLocked
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-70'
                    : `bg-gradient-to-br ${gradientClass} shadow-lg hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:border-b-0 active:translate-y-1`
                }
          `}
        >
            {/* Header: Number and Title CENTERED */}
            <div className="flex flex-col items-center justify-center w-full gap-3">
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-black shadow-inner mb-1 ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                    {isCompleted ? <Check size={28} strokeWidth={4} /> : (isLocked ? <Lock size={20} /> : lessonId)}
                </div>

                <h4 className={`text-xl sm:text-2xl font-black leading-tight w-full ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`}>
                    {title}
                </h4>
            </div>

            {/* Playful and Informative Content */}
            <div className="flex-1 w-full flex flex-col gap-2">
                <p className={`text-xs sm:text-sm font-bold leading-tight line-clamp-2 ${isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-white/80'}`}>
                    {description}
                </p>

                {objective && !isLocked && (
                    <div className="bg-white/10 rounded-xl p-2 mt-1">
                        <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                            <Target size={10} /> Goal
                        </p>
                        <p className="text-[10px] text-white line-clamp-2 leading-tight">
                            {objective}
                        </p>
                    </div>
                )}

                {rule && !isLocked && (
                    <div className="bg-yellow-400/20 rounded-xl p-2 mt-1 border border-yellow-300/30">
                        <p className="text-[10px] text-yellow-100 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                            <Lightbulb size={10} /> Rule
                        </p>
                        <p className="text-[10px] text-white line-clamp-2 leading-tight">
                            {rule}
                        </p>
                    </div>
                )}
            </div>

            {!isCompleted && !isLocked && progressPercent > 0 && (
                <div className="w-full bg-black/10 h-2 rounded-full mt-auto overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                </div>
            )}
        </div>
    );
});

// Phase Accordion Component
const PhaseAccordion = ({
    id,
    title,
    description,
    lessons,
    color,
    icon,
    isExpanded,
    onToggle,
    progress,
    language
}: {
    id: string;
    title: string;
    description: string;
    lessons: any[];
    color: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    progress: any;
    language: string;
}) => {
    const navigate = useNavigate();

    // Theme colors mapping to the requested styles
    // p1: light blue, p2: light purple, p3: light teal, p4: light orange
    const styleMap: Record<string, { bg: string, iconBg: string, iconText: string }> = {
        'blue': { bg: 'bg-white dark:bg-slate-800', iconBg: 'bg-sky-100 dark:bg-sky-900', iconText: 'text-sky-600 dark:text-sky-400' },
        'indigo': { bg: 'bg-white dark:bg-slate-800', iconBg: 'bg-purple-100 dark:bg-purple-900', iconText: 'text-purple-600 dark:text-purple-400' },
        'emerald': { bg: 'bg-white dark:bg-slate-800', iconBg: 'bg-teal-100 dark:bg-teal-900', iconText: 'text-teal-600 dark:text-teal-400' },
        'purple': { bg: 'bg-white dark:bg-slate-800', iconBg: 'bg-orange-100 dark:bg-orange-900', iconText: 'text-orange-600 dark:text-orange-400' }, // Mapped to Orange style from request
        'orange': { bg: 'bg-white dark:bg-slate-800', iconBg: 'bg-rose-100 dark:bg-rose-900', iconText: 'text-rose-600 dark:text-rose-400' },
    };

    const styles = styleMap[color] || styleMap['blue'];
    const completedInPhase = lessons.filter(l => progress.completedLessons.includes(l.lesson_id)).length;
    const totalInPhase = lessons.length;

    return (
        <div className={`rounded-[1.5rem] transition-all duration-300 overflow-hidden mb-4 border-2 ${isExpanded ? 'border-slate-100 dark:border-slate-700 shadow-xl' : 'border-transparent hover:scale-[1.01] shadow-sm'} ${styles.bg}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center p-5 text-left transition-colors"
            >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm mr-4 flex-shrink-0 ${styles.iconBg} ${styles.iconText}`}>
                    {icon}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500">
                            {completedInPhase}/{totalInPhase} Completed
                        </span>
                    </div>
                </div>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 bg-slate-50 dark:bg-slate-700 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-slate-400" />
                </div>
            </button>

            {isExpanded && (
                <div className="p-5 pt-0 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {lessons.map((lesson, idx) => {
                            const isCompleted = progress.completedLessons.includes(lesson.lesson_id);

                            // UPDATED: All lessons are open (unlocked) by default
                            const isLocked = false;

                            // Calculate Item Progress
                            const totalItems = lesson.meta.item_count || 0;
                            let pct = 0;
                            if (isCompleted) pct = 100;
                            else if (totalItems > 0) {
                                const count = progress.completedItems.filter((id: string) => id.startsWith(`l${lesson.lesson_id}_`)).length;
                                pct = Math.round((count / totalItems) * 100);
                            }

                            return (
                                <LessonCard
                                    key={lesson.lesson_id}
                                    title={lesson.title[language] || lesson.title['en']}
                                    description={lesson.description[language] || lesson.description['en']}
                                    lessonId={lesson.lesson_id}
                                    isCompleted={isCompleted}
                                    isLocked={isLocked}
                                    progressPercent={pct}
                                    objective={lesson.objective ? (lesson.objective[language] || lesson.objective['en']) : undefined}
                                    rule={lesson.rule ? (lesson.rule[language] || lesson.rule['en']) : undefined}
                                    onClick={() => navigate(`/lesson/${lesson.lesson_id}`)}
                                    categoryColor={color}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const FloatingArabic = ({ delay, side }: { delay: number, side: 'left' | 'right', key?: React.Key }) => {
    const letters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
    const colors = ['text-amber-300', 'text-yellow-200', 'text-white', 'text-cyan-100', 'text-orange-200'];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return (
        <span
            className={`absolute font-arabic text-4xl font-bold ${color} pointer-events-none select-none animate-float-up drop-shadow-lg`}
            style={{
                left: side === 'left' ? `${15 + Math.random() * 10}%` : `${75 + Math.random() * 10}%`,
                bottom: '35%',
                animationDelay: `${delay}s`,
                animationDuration: `${2.5 + Math.random()}s`,
                textShadow: '0 0 8px rgba(255,255,255,0.5)'
            }}
        >
            {letter}
        </span>
    );
};

const Home: React.FC = () => {
    const { language, progress } = useAppContext();
    const navigate = useNavigate();
    const t = TEXTS;
    const safeLessons = LESSONS || [];

    // Determine Phases
    const phases = useMemo(() => [
        {
            id: 'phase1',
            title: t.phase1Title[language],
            description: t.phase1Desc[language],
            lessons: safeLessons.filter(l => l.lesson_id >= 1 && l.lesson_id <= 10),
            color: 'blue',
            icon: <Layers size={24} />
        },
        {
            id: 'phase2',
            title: t.phase2Title[language],
            description: t.phase2Desc[language],
            lessons: safeLessons.filter(l => l.lesson_id >= 11 && l.lesson_id <= 24),
            color: 'indigo', // Mapped to Purple style
            icon: <Zap size={24} />
        },
        {
            id: 'phase3',
            title: t.phase3Title[language],
            description: t.phase3Desc[language],
            lessons: safeLessons.filter(l => l.lesson_id >= 25 && l.lesson_id <= 48),
            color: 'emerald', // Mapped to Teal style
            icon: <Target size={24} />
        },
        {
            id: 'phase4',
            title: t.phase4Title[language],
            description: t.phase4Desc[language],
            lessons: safeLessons.filter(l => l.lesson_id >= 49 && l.lesson_id <= 68),
            color: 'purple', // Mapped to Orange style
            icon: <BookMarked size={24} />
        },
        {
            id: 'phase5',
            title: t.phase5Title[language],
            description: t.phase5Desc[language],
            lessons: safeLessons.filter(l => l.lesson_id >= 69),
            color: 'orange', // Mapped to Rose style
            icon: <BookOpen size={24} />
        }
    ], [safeLessons, language]);

    // Determine Active Phase - UPDATED: All collapsed by default
    const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);

    const activeLessonId = progress.lastActiveLessonId || (progress.completedLessons.length > 0 ? Math.max(...progress.completedLessons) + 1 : 1);
    const continueLesson = safeLessons.find(l => l.lesson_id === activeLessonId) || safeLessons[0];

    const fontClass = language === 'ur' ? 'font-urdu' : (language === 'ar' ? 'font-arabic' : 'font-sans');
    const isRtl = language === 'ur' || language === 'ar';

    return (
        <div className={`max-w-7xl mx-auto p-4 sm:p-6 pb-32 ${isRtl ? 'rtl-text' : ''} ${fontClass}`}>
            <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          70% { opacity: 0.9; }
          100% { transform: translateY(-150px) scale(1.3); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 3s ease-out infinite;
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>

            {/* Header Section - UPDATED with Bright Cyan/Yellow Palette */}
            <div className="text-center py-6 mb-2">
                <div className="w-full max-w-2xl h-[300px] bg-gradient-to-tr from-cyan-500 via-cyan-400 to-yellow-200 rounded-[3rem] mx-auto mb-6 flex items-center justify-center text-white shadow-xl shadow-cyan-200/50 dark:shadow-none relative overflow-hidden group border-4 border-white/20">
                    {/* Decorative Elements */}
                    <div className="absolute top-[-40px] left-[-40px] w-48 h-48 bg-white/30 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"></div>

                    {/* Floating Arabic Background */}
                    {[...Array(6)].map((_, i) => (
                        <FloatingArabic key={`l-${i}`} delay={i * 0.5} side="left" />
                    ))}
                    {[...Array(6)].map((_, i) => (
                        <FloatingArabic key={`r-${i}`} delay={i * 0.5 + 0.2} side="right" />
                    ))}

                    {/* Background Arabic Word - Low Opacity */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                        <span className="font-arabic text-[220px] leading-none text-white opacity-10 blur-[1px] mix-blend-overlay transform scale-150 animate-pulse">
                            اقرأ
                        </span>
                    </div>

                    {/* Main Illustration: Enhanced Book */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Floating Glow */}
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-[80px] opacity-40 animate-pulse"></div>

                        {/* Enhanced Book Container */}
                        <div className="relative z-20 flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[3.5rem] shadow-[0_20px_50px_rgba(34,197,94,0.3)] dark:shadow-none transform hover:scale-105 transition-all duration-500 animate-bounce-slow border-4 border-yellow-300 ring-8 ring-white/10">
                                <BookOpen size={100} fill="#06b6d4" className="text-cyan-600 drop-shadow-xl" />
                            </div>

                            {/* Kids - Premium Avatars synced to profile */}
                            <div className="flex gap-12 -mt-10 relative z-30 items-end">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl animate-sway overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl">
                                    <img
                                        src={progress.avatarUrl || (progress.gender === 'girl' ? '/avatars/girl.png' : '/avatars/boy.png')}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-5xl font-black text-cyan-900 dark:text-cyan-100 mb-2 tracking-tight">Noorani Qaida</h1>
                <p className="text-cyan-600 dark:text-cyan-400 font-bold text-xl">
                    {progress.name ? `Welcome back, ${progress.name}! 🚀` : 'Adventure awaits, little learner! 🚀'}
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Continue Card */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 flex items-center justify-between shadow-xl shadow-slate-200/50 dark:shadow-none border-2 border-cyan-100 dark:border-slate-700 mb-10 transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate(`/lesson/${continueLesson.lesson_id}`)}>
                    <div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Lesson</div>
                        <div className="font-black text-2xl text-slate-800 dark:text-white">
                            Lesson {continueLesson.lesson_id}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-bold">
                            {continueLesson.title[language] || continueLesson.title['en']}
                        </div>
                    </div>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-8 py-4 rounded-full font-black text-lg shadow-[0_6px_0_rgb(202,138,4)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2">
                        RESUME <Play size={20} fill="currentColor" />
                    </button>
                </div>

                {/* Phase List */}
                <div className="space-y-6">
                    {phases.map((phase) => {
                        if (phase.lessons.length === 0) return null;
                        return (
                            <PhaseAccordion
                                key={phase.id}
                                {...phase}
                                isExpanded={expandedPhaseId === phase.id}
                                onToggle={() => setExpandedPhaseId(expandedPhaseId === phase.id ? null : phase.id)}
                                progress={progress}
                                language={language}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;
