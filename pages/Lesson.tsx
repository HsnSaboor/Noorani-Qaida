
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
    LESSONS, TEXTS, fetchLessonContent,
    // 17 Makhraj Images organized by 5 main areas
    IMG_JAUF,
    IMG_THROAT_DEEP, IMG_THROAT_MIDDLE, IMG_THROAT_UPPER,
    IMG_TONGUE_BACK_QAF, IMG_TONGUE_BACK_KAAF, IMG_TONGUE_MIDDLE, IMG_TONGUE_SIDE_DAAD,
    IMG_TONGUE_TIP_LAAM, IMG_TONGUE_TIP_NOON, IMG_TONGUE_TIP_RA,
    IMG_TONGUE_TIP_UPPER_TEETH, IMG_TONGUE_TIP_TEETH_EDGE, IMG_TONGUE_TIP_WHISTLE,
    IMG_LIPS_BOTH, IMG_LIPS_FAA,
    IMG_NASAL,
    // Legacy exports for backward compatibility  
    IMG_GENERAL, IMG_THROAT, IMG_LIPS, IMG_TONGUE_TIP, IMG_TONGUE_BACK, IMG_TONGUE_SIDE
} from '../constants';
import { Lesson, LessonItem, LessonQuiz } from '../types';
import Quiz from '../components/Quiz';
import ArabicGlyph from '../components/ArabicGlyph';
import TajweedText from '../components/TajweedText';
import { ChevronLeft, ChevronRight, CheckCircle, ToggleLeft, ToggleRight, PlayCircle, X, PartyPopper, Book, Heart, Volume2, RotateCcw, Sparkles, Menu, SlidersHorizontal, Image as ImageIcon, Loader2, HelpCircle, Dumbbell, Star, BookOpen, Layers, Zap, BookMarked, Palette, Lightbulb, Info, ArrowLeft, Target, Gamepad2, Brain, Headphones, ChevronUp, Play, ArrowRight } from 'lucide-react';
import { playSuccessSound, mkAudio, normalizeArabic } from '../data/utils';
import ImageModal from '../components/ImageModal';
import MemoryGame from '../components/games/MemoryGame';
import AudioChallenge from '../components/games/AudioChallenge';
import { AnatomyLayout, ContextLayout, ComparisonLayout, getHighlightFromBodyPart } from '../components/InfoPanelLayouts';

// Makhraj descriptions for each letter - showing articulation point and body part used
const MAKHRAJ_DESCRIPTIONS: Record<string, { en: string; ur: string; fr: string; bodyPart: string }> = {
    'ا': { en: 'From the empty space (Jauf) - Open throat', ur: 'جوف سے - کھلے گلے سے', fr: "De l'espace vide (Jauf)", bodyPart: '🫁 Throat' },
    'ب': { en: 'Both lips pressed together', ur: 'دونوں ہونٹ ملانے سے', fr: 'Deux lèvres pressées', bodyPart: '👄 Lips' },
    'ت': { en: 'Tongue tip touches upper teeth', ur: 'زبان کی نوک اوپری دانتوں سے', fr: 'Bout de langue sur dents sup.', bodyPart: '👅 Tongue Tip' },
    'ث': { en: 'Tongue tip between teeth', ur: 'زبان کی نوک دانتوں کے درمیان', fr: 'Langue entre les dents', bodyPart: '👅 Tongue Tip' },
    'ج': { en: 'Middle of tongue to palate', ur: 'زبان کا درمیان تالو سے', fr: 'Milieu de la langue', bodyPart: '👅 Tongue Middle' },
    'ح': { en: 'Middle of throat', ur: 'گلے کے درمیان سے', fr: 'Milieu de la gorge', bodyPart: '🫁 Throat' },
    'خ': { en: 'Upper throat near palate', ur: 'گلے کی اوپری حصے سے', fr: 'Haut de la gorge', bodyPart: '🫁 Throat' },
    'د': { en: 'Tongue tip on upper teeth gum', ur: 'زبان کی نوک دانتوں کے مسوڑوں پر', fr: 'Bout de langue sur gencives', bodyPart: '👅 Tongue Tip' },
    'ذ': { en: 'Tongue tip between teeth', ur: 'زبان کی نوک دانتوں کے درمیان', fr: 'Langue entre les dents', bodyPart: '👅 Tongue Tip' },
    'ر': { en: 'Tongue tip curved back', ur: 'زبان کی نوک پیچھے مڑ کر', fr: 'Bout de langue courbé', bodyPart: '👅 Tongue Tip' },
    'ز': { en: 'Tongue tip near lower teeth', ur: 'زبان کی نوک نچلے دانتوں کے قریب', fr: 'Langue près des dents inf.', bodyPart: '👅 Tongue Tip' },
    'س': { en: 'Tongue tip whistles against teeth', ur: 'زبان کی نوک دانتوں سے سیٹی', fr: 'Sifflement contre les dents', bodyPart: '👅 Tongue Tip' },
    'ش': { en: 'Middle tongue lifts to palate', ur: 'زبان کا درمیان تالو تک', fr: 'Milieu de langue au palais', bodyPart: '👅 Tongue Middle' },
    'ص': { en: 'Tongue tip whistles (heavy)', ur: 'زبان کی نوک سیٹی (موٹا)', fr: 'Sifflement lourd', bodyPart: '👅 Tongue Tip' },
    'ض': { en: 'Tongue side presses molars', ur: 'زبان کا کنارہ داڑھوں سے', fr: 'Côté de langue aux molaires', bodyPart: '👅 Tongue Side' },
    'ط': { en: 'Tongue tip on gum (heavy)', ur: 'زبان کی نوک مسوڑوں پر (موٹا)', fr: 'Bout sur gencive (lourd)', bodyPart: '👅 Tongue Tip' },
    'ظ': { en: 'Tongue tip between teeth (heavy)', ur: 'دانتوں کے درمیان (موٹا)', fr: 'Entre les dents (lourd)', bodyPart: '👅 Tongue Tip' },
    'ع': { en: 'Middle of throat', ur: 'گلے کے درمیان سے', fr: 'Milieu de la gorge', bodyPart: '🫁 Throat' },
    'غ': { en: 'Upper throat (heavy)', ur: 'گلے کی اوپری حصے سے (موٹا)', fr: 'Haut de gorge (lourd)', bodyPart: '🫁 Throat' },
    'ف': { en: 'Lower lip on upper teeth', ur: 'نچلے ہونٹ اوپری دانتوں پر', fr: 'Lèvre inf. sur dents sup.', bodyPart: '👄 Lips' },
    'ق': { en: 'Back of tongue to soft palate', ur: 'زبان کی جڑ نرم تالو سے', fr: 'Arrière de langue au voile', bodyPart: '👅 Tongue Back' },
    'ك': { en: 'Back of tongue to hard palate', ur: 'زبان کی جڑ سخت تالو سے', fr: 'Arrière de langue au palais', bodyPart: '👅 Tongue Back' },
    'ل': { en: 'Tongue tip touches gum', ur: 'زبان کی نوک مسوڑوں سے', fr: 'Bout sur gencive', bodyPart: '👅 Tongue Tip' },
    'م': { en: 'Both lips together (nasal)', ur: 'دونوں ہونٹ (ناک سے)', fr: 'Deux lèvres (nasal)', bodyPart: '👄 Lips + 👃 Nose' },
    'ن': { en: 'Tongue tip to gum (nasal)', ur: 'زبان کی نوک (ناک سے)', fr: 'Bout de langue (nasal)', bodyPart: '👅 Tongue + 👃 Nose' },
    'و': { en: 'Both lips rounded', ur: 'دونوں ہونٹ گول', fr: 'Lèvres arrondies', bodyPart: '👄 Lips' },
    'ه': { en: 'Deep throat', ur: 'گلے کی گہرائی سے', fr: 'Fond de la gorge', bodyPart: '🫁 Throat' },
    'ء': { en: 'Deepest part of throat', ur: 'گلے کی سب سے گہرائی سے', fr: 'Le plus profond de la gorge', bodyPart: '🫁 Throat' },
    'ي': { en: 'Middle tongue to palate', ur: 'زبان کا درمیان تالو سے', fr: 'Milieu de langue au palais', bodyPart: '👅 Tongue Middle' },
};

// --- Confetti Component ---
const Confetti = () => {
    const particles = Array.from({ length: 50 });
    return (
        <div className="fixed inset-0 pointer-events-none z-[120] overflow-hidden">
            {particles.map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full opacity-90"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        top: `-5vh`,
                        backgroundColor: ['#FFC107', '#FF5722', '#4CAF50', '#2196F3', '#9C27B0'][Math.floor(Math.random() * 5)],
                        animation: `confetti-fall ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}
            <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

// Skeleton Component
const LessonSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse mt-4" dir="rtl">
        {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full"></div>
            </div>
        ))}
    </div>
);

// Tajweed Legend Modal
const TajweedLegend: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={24} /></button>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Palette size={20} className="text-brand" /> Tajweed Key</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center font-bold font-arabic text-xl">ق</div>
                        <div><h4 className="font-bold text-red-700 dark:text-red-300">Qalqala (Echo)</h4><p className="text-xs text-red-600/80 dark:text-red-400/80">Bounce the sound when stopped.</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold font-arabic text-xl">ص</div>
                        <div><h4 className="font-bold text-blue-700 dark:text-blue-300">Heavy Letters</h4><p className="text-xs text-blue-600/80 dark:text-blue-400/80">Read with a full mouth.</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center font-bold font-arabic text-xl">ح</div>
                        <div><h4 className="font-bold text-green-700 dark:text-green-300">Throat Letters</h4><p className="text-xs text-green-600/80 dark:text-green-400/80">Articulated from the throat.</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-100 dark:border-pink-900/50">
                        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full flex items-center justify-center font-bold font-arabic text-xl">نّ</div>
                        <div><h4 className="font-bold text-pink-700 dark:text-pink-300">Ghunna (Nasal)</h4><p className="text-xs text-pink-600/80 dark:text-pink-400/80">Hold sound in the nose.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Lesson Rule Modal
const RuleModal: React.FC<{ isOpen: boolean; onClose: () => void; lesson: Lesson }> = ({ isOpen, onClose, lesson }) => {
    const { language } = useAppContext();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 w-full max-w-md relative shadow-2xl border-2 border-amber-200 dark:border-amber-700 animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={24} /></button>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center shadow-inner">
                        <Lightbulb size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Lesson Rule</h3>
                        <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {lesson.rule ? (lesson.rule[language] || lesson.rule['en']) : "Just listen and repeat! No specific rule for this lesson."}
                        </p>
                    </div>
                    <button onClick={onClose} className="mt-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

// Makhraj Drawer
const MakhrajDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = React.memo(({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl h-[80vh] relative shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><ImageIcon size={20} className="text-brand" /> Articulation Points</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <img src={IMG_GENERAL} alt="Makhraj General" className="w-full h-auto object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-700 bg-white" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {[
                            { title: 'Throat', img: IMG_THROAT },
                            { title: 'Lips', img: IMG_LIPS },
                            { title: 'Tongue Tip', img: IMG_TONGUE_TIP },
                            { title: 'Tongue Back', img: IMG_TONGUE_BACK },
                            { title: 'Tongue Side', img: IMG_TONGUE_SIDE },
                            { title: 'Jauf', img: IMG_JAUF }
                        ].map((m, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-center text-sm mb-2 text-slate-700 dark:text-slate-300">{m.title}</h4>
                                <img src={m.img} alt={m.title} className="w-full h-32 object-contain rounded-lg bg-slate-50 dark:bg-slate-900" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

// Reusable Lesson Content Component
const LessonPathContent: React.FC<{ currentId: number; onItemClick?: () => void }> = React.memo(({ currentId, onItemClick }) => {
    const navigate = useNavigate();
    const { progress, language } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const t = TEXTS;

    const sections = useMemo(() => [
        { id: 'p1', title: t.phase1Title[language], icon: <Layers size={18} />, lessons: LESSONS.filter(l => l.lesson_id <= 10) },
        { id: 'p2', title: t.phase2Title[language], icon: <Zap size={18} />, lessons: LESSONS.filter(l => l.lesson_id >= 11 && l.lesson_id <= 24) },
        { id: 'p3', title: t.phase3Title[language], icon: <Target size={18} />, lessons: LESSONS.filter(l => l.lesson_id >= 25 && l.lesson_id <= 48) },
        { id: 'p4', title: t.phase4Title[language], icon: <BookMarked size={18} />, lessons: LESSONS.filter(l => l.lesson_id >= 49 && l.lesson_id <= 68) },
        { id: 'p5', title: t.phase5Title[language], icon: <BookOpen size={18} />, lessons: LESSONS.filter(l => l.lesson_id >= 69) }
    ], [language]);

    useEffect(() => {
        if (containerRef.current) {
            const active = containerRef.current.querySelector('.active-lesson');
            if (active) active.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [currentId]);

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto p-0 pb-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {sections.map((section) => {
                if (section.lessons.length === 0) return null;
                return (
                    <div key={section.id} className="mb-6">
                        <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {section.icon} {section.title}
                        </div>
                        <div className="px-6 pt-4 relative">
                            <div className="absolute left-[39px] rtl:left-auto rtl:right-[39px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
                            {section.lessons.map((l) => {
                                const isCompleted = progress.completedLessons.includes(l.lesson_id);
                                const isCurrent = l.lesson_id === currentId;
                                return (
                                    <div key={l.lesson_id} onClick={() => { navigate(`/lesson/${l.lesson_id}`); if (onItemClick) onItemClick(); }} className={`relative flex items-center gap-4 mb-6 group cursor-pointer ${isCurrent ? 'active-lesson' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 border-2 ${isCurrent ? 'bg-brand text-white border-brand ring-4 ring-brand/20 scale-110' : (isCompleted ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-600')}`}>{isCompleted ? <CheckCircle size={14} /> : l.lesson_id}</div>
                                        <div className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${isCurrent ? 'bg-white dark:bg-slate-800 border-brand shadow-md transform rtl:-translate-x-1 translate-x-1' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-sm'}`}><div className="flex justify-between items-start"><h4 className={`font-bold text-sm leading-tight ${isCurrent ? 'text-brand' : 'text-slate-700 dark:text-slate-200'}`}>{l.title[language] || l.title['en']}</h4>{l.meta.difficulty && (<span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${l.meta.difficulty === 'Beginner' ? 'bg-blue-100 text-blue-700' : l.meta.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{l.meta.difficulty.substring(0, 3)}</span>)}</div></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

// Mobile Navigation Drawer for Lesson Path
const LessonNavDrawer: React.FC<{ isOpen: boolean; onClose: () => void; currentId: number }> = ({ isOpen, onClose, currentId }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="absolute top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left rtl:slide-in-from-right duration-300 flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><BookOpen size={20} className="text-brand" /> Lesson Path</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500"><X size={20} /></button>
                </div>
                <LessonPathContent currentId={currentId} onItemClick={onClose} />
            </div>
        </div>
    );
};

// ... LessonIntro Component (No Changes) ...
const LessonIntro: React.FC<{ lesson: Lesson, onStart: () => void }> = ({ lesson, onStart }) => {
    const { language } = useAppContext();
    const [isRuleExpanded, setIsRuleExpanded] = useState(false);

    // Bismillah Audio logic handled in parent to ensure it plays on start
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl p-8 sm:p-12 relative overflow-hidden border-4 border-white dark:border-slate-700">
                {/* Decorative blob */}
                <div className="absolute -top-20 -right-20 rtl:right-auto rtl:-left-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                    <div className="w-24 h-24 bg-brand text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-lg mb-2 transform rotate-3 rtl:-rotate-3">
                        {lesson.lesson_id}
                    </div>

                    <div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white font-arabic mb-3 leading-tight">
                            {lesson.title[language] || lesson.title['en']}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto leading-relaxed">
                            {lesson.description[language] || lesson.description['en']}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                        {lesson.objective && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border-2 border-blue-100 dark:border-blue-800 text-left rtl:text-right">
                                <h3 className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase text-xs tracking-widest mb-2">
                                    <Target size={16} /> Goal
                                </h3>
                                <p className="text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed">
                                    {lesson.objective[language] || lesson.objective['en']}
                                </p>
                            </div>
                        )}
                        {lesson.rule && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-3xl border-2 border-amber-100 dark:border-amber-800 text-left rtl:text-right">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black uppercase text-xs tracking-widest">
                                        <Lightbulb size={16} /> Key Rule
                                    </h3>
                                    {/* Only show "More" if text is long-ish */}
                                    {(lesson.rule[language] || lesson.rule['en']).length > 80 && (
                                        <button
                                            onClick={() => setIsRuleExpanded(!isRuleExpanded)}
                                            className="text-[10px] font-black text-amber-500 hover:text-amber-600 uppercase transition-colors"
                                        >
                                            {isRuleExpanded ? 'Less' : 'More'}
                                        </button>
                                    )}
                                </div>
                                <p className={`text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed ${!isRuleExpanded ? 'line-clamp-3' : ''}`}>
                                    {lesson.rule[language] || lesson.rule['en']}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{lesson.meta.estimated_minutes} Mins</span>
                        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{lesson.meta.difficulty}</span>
                        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{lesson.meta.item_count} Items</span>
                    </div>

                    <button
                        onClick={onStart}
                        className="mt-6 bg-brand hover:bg-brand-dark text-white text-xl font-black py-5 px-12 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 w-full sm:w-auto justify-center group"
                    >
                        <Play size={28} fill="currentColor" className="group-hover:scale-110 rtl:rotate-180 transition-transform" />
                        {TEXTS.startLesson[language] || "Start Lesson"}
                    </button>
                </div>
            </div>

            <Link to="/" className="mt-8 text-slate-400 font-bold hover:text-brand transition-colors flex items-center gap-2">
                <ArrowLeft size={20} className="rtl:rotate-180" /> Back to Home
            </Link>
        </div>
    );
};

const LessonPage: React.FC = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const { language, completeLesson, progress, toggleBookmark, addXp, markItemComplete, reciterId, setLastActiveLesson } = useAppContext();
    const t = TEXTS;

    const lessonId = parseInt(id || '1', 10);
    const metaLesson = useMemo(() => LESSONS.find(l => l.lesson_id === lessonId), [lessonId]);

    const nextLessonId = useMemo(() => {
        const idx = LESSONS.findIndex(l => l.lesson_id === lessonId);
        return idx !== -1 && idx < LESSONS.length - 1 ? LESSONS[idx + 1].lesson_id : null;
    }, [lessonId]);

    const prevLessonId = useMemo(() => {
        const idx = LESSONS.findIndex(l => l.lesson_id === lessonId);
        return idx > 0 ? LESSONS[idx - 1].lesson_id : null;
    }, [lessonId]);

    // --- State ---
    const [activeTab, setActiveTab] = useState<'study' | 'qa' | 'exercise' | 'makhraj'>('study');
    const [hasStarted, setHasStarted] = useState(false);
    const [playingItemId, setPlayingItemId] = useState<string | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
    const [lastPlayedItemId, setLastPlayedItemId] = useState<string | null>(null);
    const [isLessonCompletedState, setIsLessonCompletedState] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [shuffledQuiz, setShuffledQuiz] = useState<LessonQuiz[]>([]);
    const [exerciseMode, setExerciseMode] = useState<'none' | 'memory' | 'audio'>('none');

    const [showSettings, setShowSettings] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [showMakhraj, setShowMakhraj] = useState(false);
    const [showTajweedLegend, setShowTajweedLegend] = useState(false);
    const [showRuleModal, setShowRuleModal] = useState(false); // New Rule Modal State

    // For ImageModal
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

    const [playbackSpeed, setPlaybackSpeed] = useState(() => parseFloat(localStorage.getItem('setting-speed') || '1'));
    const [autoPlay, setAutoPlay] = useState(() => localStorage.getItem('setting-autoplay') === 'true');
    const [repeatCount, setRepeatCount] = useState(() => {
        const saved = localStorage.getItem('setting-repeat');
        return saved ? Math.max(1, parseInt(saved)) : 1;
    });
    const [spellingMode, setSpellingMode] = useState(() => localStorage.getItem('setting-spelling') === 'true');

    useEffect(() => localStorage.setItem('setting-speed', String(playbackSpeed)), [playbackSpeed]);
    useEffect(() => localStorage.setItem('setting-autoplay', String(autoPlay)), [autoPlay]);
    useEffect(() => localStorage.setItem('setting-repeat', String(repeatCount)), [repeatCount]);
    useEffect(() => localStorage.setItem('setting-spelling', String(spellingMode)), [spellingMode]);

    const [correctItems, setCorrectItems] = useState<string[]>([]);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const [lesson, setLesson] = useState<Lesson | null>(metaLesson || null);
    const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [visibleCount, setVisibleCount] = useState(40);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const autoPlayTimeoutRef = useRef<number | null>(null);
    const playbackIdRef = useRef<number>(0);
    const lessonItemsRef = useRef<LessonItem[]>([]);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Memoize game items to prevent game reset during parent re-renders
    // Memoize game items to prevent game reset during parent re-renders
    const gameItems = useMemo(() => {
        if (lessonItems.length === 0) return [];
        let items = [...lessonItems];
        // If too few items for games, duplicate them to ensure variety
        while (items.length < 12 && items.length > 0) {
            items = [...items, ...items.map(i => ({ ...i, id: i.id + '_copy' }))];
        }
        return items.slice(0, 16);
    }, [lessonItems]);

    useEffect(() => {
        if (playingItemId && autoPlay && itemRefs.current.has(playingItemId)) {
            const timer = setTimeout(() => {
                const element = itemRefs.current.get(playingItemId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [playingItemId, autoPlay]);

    // Infinite Scroll Callback Ref
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingContent) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleCount(prev => Math.min(prev + 40, lessonItemsRef.current.length));
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (node) observerRef.current.observe(node);
    }, [isLoadingContent]);

    // ... (Audio play methods remain the same) ...
    const stopAudio = useCallback(() => {
        playbackIdRef.current++;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
            autoPlayTimeoutRef.current = null;
        }
        setPlayingItemId(null);
        setActiveWordIndex(null);
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }, []);

    const playTTS = (text: string | undefined): Promise<void> => {
        return new Promise((resolve) => {
            if (!text || !('speechSynthesis' in window)) {
                resolve();
                return;
            }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = playbackSpeed * 0.9;

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();

            window.speechSynthesis.speak(utterance);
        });
    };

    const playAudioFile = (url: string | null | undefined, fallbackText?: string): Promise<void> => {
        return new Promise((resolve) => {
            // Identify Quranic or WBW sources
            const isQuranicSource = url && (url.includes('everyayah.com') || url.includes('qurancdn.com') || url.includes('audio.qurancdn'));

            if (!url) {
                if (!isQuranicSource) playTTS(fallbackText).then(resolve);
                else resolve(); // Skip TTS for strictly Quranic words if audio missing
                return;
            }

            let finalUrl = url;
            if (finalUrl.includes('everyayah.com/data/Alafasy_128kbps') && reciterId && reciterId !== 'Alafasy_128kbps') {
                finalUrl = finalUrl.replace('Alafasy_128kbps', reciterId);
            }

            if (!audioRef.current) audioRef.current = new Audio();
            const audio = audioRef.current;
            audio.src = finalUrl;
            audio.playbackRate = playbackSpeed;
            audio.crossOrigin = 'anonymous';

            audio.onended = () => resolve();
            audio.onerror = () => {
                // STRICT: If it's a Quranic source, DO NOT fallback to TTS as pronunciation will be wrong.
                if (!isQuranicSource) {
                    playTTS(fallbackText).then(resolve);
                } else {
                    console.warn("Quranic audio failed, skipping TTS fallback.");
                    resolve();
                }
            };

            audio.play().catch((e) => {
                if (!isQuranicSource) {
                    playTTS(fallbackText).then(resolve);
                } else {
                    resolve();
                }
            });
        });
    };

    useEffect(() => {
        setLastActiveLesson(lessonId);

        setHasStarted(false);
        setIsLessonCompletedState(progress.completedLessons.includes(lessonId));
        setActiveTab('study');
        setExerciseMode('none');
        setPlayingItemId(null);
        setSelectedItemId(null);
        setLastPlayedItemId(null);
        setActiveWordIndex(null);
        setShowConfetti(false);
        setShowInstructions(true);
        setCorrectItems([]);
        stopAudio();
        setVisibleCount(40);
        setLesson(metaLesson || null);
        setLessonItems([]);
        lessonItemsRef.current = [];
        itemRefs.current.clear();
        setIsLoadingContent(true);

        const loadContent = async () => {
            const loadedLesson = await fetchLessonContent(lessonId);
            if (!loadedLesson) { setIsLoadingContent(false); return; }
            setLesson(loadedLesson);
            if (loadedLesson) {
                // Play Bismillah audio for lessons 5+ except special ones
                // Bismillah moved to onStart

                setLesson(loadedLesson);

                // --- Generate/Refine Quiz Questions (Minimum 10) ---
                let quizPool = loadedLesson.quiz ? [...loadedLesson.quiz] : [];

                // If pool is small, generate questions from lesson items
                if (quizPool.length < 10 && loadedLesson.items && loadedLesson.items.length > 0) {
                    const items = loadedLesson.items.filter(i => i.text_ar && (i.audio?.main || i.words?.length));
                    const shuffledItems = [...items].sort(() => Math.random() - 0.5);

                    // Add items as "Identification" questions until we have at least 15 in pool
                    for (let i = 0; i < shuffledItems.length && quizPool.length < 15; i++) {
                        const item = shuffledItems[i];
                        const otherItems = items.filter(oi => oi.id !== item.id).sort(() => Math.random() - 0.5).slice(0, 3);

                        if (otherItems.length >= 2) {
                            quizPool.push({
                                id: `gen_${item.id}`,
                                type: 'audio',
                                question: { en: "Listen and identify the correct sound:", ur: "آواز سنیں اور درست حرف پہچانیں:", fr: "Écoutez et identifiez le son:" },
                                options: [item.text_ar, ...otherItems.map(oi => oi.text_ar)].sort(() => Math.random() - 0.5),
                                correct: item.text_ar,
                                audio: item.audio?.main || (item.words && item.words[0]?.audio)
                            });
                        }
                    }
                }

                if (quizPool.length > 0) {
                    const QUESTIONS_PER_SESSION = Math.min(quizPool.length, 10);
                    const fullPoolShuffled = [...quizPool].sort(() => Math.random() - 0.5);
                    setShuffledQuiz(fullPoolShuffled.slice(0, QUESTIONS_PER_SESSION).map(q => ({
                        ...q, options: [...q.options].sort(() => Math.random() - 0.5)
                    })));
                } else {
                    setShuffledQuiz([]);
                }

                setLessonItems(loadedLesson.items || []);
                lessonItemsRef.current = loadedLesson.items || [];
                setIsLoadingContent(false);
            }
        };
        loadContent();
        window.scrollTo(0, 0);
        return () => { stopAudio(); };
    }, [lessonId, progress.completedLessons, metaLesson, stopAudio]);

    const handlePlayItem = useCallback(async (item: LessonItem, specificWordIndex: number = -1) => {
        stopAudio();
        const currentRunId = playbackIdRef.current;

        setPlayingItemId(item.id);
        setSelectedItemId(item.id);
        setLastPlayedItemId(item.id);

        const getAudioSrc = (wordItem: any, index: number = -1) => {
            // Priority 1: Explicit audio path provided (Pre-calculated and usually correct)
            if (wordItem?.audio?.main) return wordItem.audio.main;
            if (wordItem?.audio && typeof wordItem.audio === 'string') return wordItem.audio;
            if (typeof wordItem === 'string' && wordItem.includes('/')) return wordItem;

            // Priority 2: WBW API if Lesson 5+ and have metadata (Fallback)
            if (lessonId >= 5 && item.surah && item.ayah) {
                // Fix: Ensure 3-digit padding and correct word index offset
                const s = String(item.surah).padStart(3, '0');
                const a = String(item.ayah).padStart(3, '0');
                const baseIndex = item.wordIndex || 1;
                const finalIndex = baseIndex + (index !== -1 ? index : 0);
                const w = String(finalIndex).padStart(3, '0');
                return `https://audio.qurancdn.com/wbw/${s}_${a}_${w}.mp3`;
            }

            // Fallback
            return wordItem?.audio || wordItem;
        };

        const playSequence = async () => {
            const validRepeat = (lessonId <= 2) ? 1 : Math.max(1, Math.min(5, repeatCount));

            if (specificWordIndex !== -1 && item.words && item.words[specificWordIndex]) {
                setActiveWordIndex(specificWordIndex);
                await playAudioFile(getAudioSrc(item.words[specificWordIndex], specificWordIndex), item.words[specificWordIndex].text);
                if (playbackIdRef.current === currentRunId) {
                    setPlayingItemId(null);
                    setActiveWordIndex(null);
                }
                return;
            }

            for (let r = 0; r < validRepeat; r++) {
                if (playbackIdRef.current !== currentRunId) return;

                if (item.words && item.words.length > 0) {
                    for (let i = 0; i < item.words.length; i++) {
                        if (playbackIdRef.current !== currentRunId) return;
                        setActiveWordIndex(i);
                        await new Promise(res => setTimeout(res, 0));
                        await playAudioFile(getAudioSrc(item.words[i], i), item.words[i].text);
                    }
                } else {
                    await playAudioFile(getAudioSrc(item.audio?.main), item.text_ar);
                }
                if (r < validRepeat - 1) await new Promise(res => setTimeout(res, 300));
            }

            if (playbackIdRef.current === currentRunId) {
                setPlayingItemId(null);
                setActiveWordIndex(null);
                markItemComplete(item.id);
                setCorrectItems(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
                if (autoPlay) {
                    const items = lessonItemsRef.current;
                    const idx = items.findIndex(i => i.id === item.id);
                    if (idx !== -1 && idx < items.length - 1) {
                        autoPlayTimeoutRef.current = window.setTimeout(() => playNextRef.current(items[idx + 1]), 2000);
                    } else {
                        setAutoPlay(false);
                    }
                }
            }
        };
        playSequence();
    }, [repeatCount, autoPlay, playbackSpeed, stopAudio, lessonId, markItemComplete, reciterId, spellingMode]);

    const playNextRef = useRef(handlePlayItem);
    useEffect(() => { playNextRef.current = handlePlayItem; }, [handlePlayItem]);

    const handleCompleteLesson = () => {
        if (!isLessonCompletedState) {
            completeLesson(lessonId);
            setIsLessonCompletedState(true);
            setShowConfetti(true);
            playSuccessSound();
        } else {
            setShowConfetti(true);
        }
    };

    const handleReplayLast = () => {
        if (!lastPlayedItemId) return;
        const item = lessonItemsRef.current.find(i => i.id === lastPlayedItemId);
        if (item) handlePlayItem(item);
    };

    const activeItem = useMemo(() => lessonItems.find(i => i.id === selectedItemId), [selectedItemId, lessonItems]);
    const activeWordDetails = useMemo(() => {
        if (!activeItem || activeWordIndex === null || !activeItem.words || !activeItem.words[activeWordIndex]) return null;
        return activeItem.words[activeWordIndex];
    }, [activeItem, activeWordIndex]);

    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
    const onTouchEnd = () => {
        if (showMakhraj || showNav || showTajweedLegend || showRuleModal || !touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance && isLessonCompletedState && nextLessonId) navigate(`/lesson/${nextLessonId}`);
        if (distance < -minSwipeDistance && prevLessonId) navigate(`/lesson/${prevLessonId}`);
    };

    if (!lesson) return <div className="p-10 text-center">Lesson Not Found</div>;

    if (!hasStarted) {
        return <LessonIntro lesson={lesson} onStart={() => {
            setHasStarted(true);
            // Play introductory Bismillah
            playAudioFile('/audio/bismillah.mp3').catch(e => console.warn("Bismillah audio failed", e));
        }} />;
    }

    const visibleItems = lessonItems.slice(0, visibleCount);
    const showLoadMore = visibleCount < lessonItems.length;

    const totalLessonItems = lessonItems.length;
    const completedLessonItemsCount = lessonItems.filter(item => progress.completedItems.includes(item.id)).length;
    const lessonProgressPercent = totalLessonItems > 0 ? (completedLessonItemsCount / totalLessonItems) * 100 : 0;

    return (
        <div
            className={`max-w-7xl mx-auto p-4 pb-48 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
            <MakhrajDrawer isOpen={showMakhraj} onClose={() => setShowMakhraj(false)} />
            <TajweedLegend isOpen={showTajweedLegend} onClose={() => setShowTajweedLegend(false)} />
            <LessonNavDrawer isOpen={showNav} onClose={() => setShowNav(false)} currentId={lessonId} />
            {/* Pass the actual lesson object to the Rule Modal */}
            <RuleModal isOpen={showRuleModal} onClose={() => setShowRuleModal(false)} lesson={lesson} />

            <ImageModal
                isOpen={!!modalImage}
                onClose={() => setModalImage(null)}
                imageSrc={modalImage || ''}
                title={modalTitle}
            />

            {showConfetti && (
                <>
                    <Confetti />
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl border-4 border-yellow-400 text-center max-w-sm w-full mx-4 transform transition-all scale-100 relative overflow-hidden">
                            {/* Background Glows */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand/20 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <PartyPopper size={72} className="mx-auto text-yellow-500 mb-6 animate-bounce drop-shadow-md" />
                                <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Lesson Complete!</h2>

                                <div className="flex justify-center items-center gap-2 mb-8 bg-yellow-100 dark:bg-yellow-900/40 py-2 px-5 rounded-full mx-auto w-fit border border-yellow-200 dark:border-yellow-700">
                                    <Star className="fill-yellow-500 text-yellow-500" size={24} />
                                    <span className="font-black text-yellow-800 dark:text-yellow-400 text-lg">+50 XP</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            if (nextLessonId) navigate(`/lesson/${nextLessonId}`);
                                            else navigate('/dashboard');
                                        }}
                                        className="bg-brand hover:bg-brand-dark text-white text-lg font-black py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Next Lesson <ArrowRight size={24} className="rtl:rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => setShowConfetti(false)}
                                        className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-2xl transition-all active:scale-95"
                                    >
                                        Stay Here
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="flex gap-8 items-start">
                <aside className="hidden lg:flex w-80 sticky top-24 h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-col flex-shrink-0">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><BookOpen size={20} className="text-brand" /> Lesson Path</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">{progress.completedLessons.length}/{LESSONS.length} Completed</p>
                    </div>
                    <LessonPathContent currentId={lessonId} />
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-4 z-40 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-3 mb-6 flex flex-col transition-all gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-4 px-2 pt-2">
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <button onClick={(e) => { e.stopPropagation(); setShowNav(true) }} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors active:scale-95 lg:hidden bg-slate-50 dark:bg-slate-800/50"><Menu size={24} /></button>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Lesson {lessonId}</span>
                                    <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-none group-hover:text-brand transition-colors flex items-center gap-2">
                                        {lesson.title[language]}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowRuleModal(true)} className="p-2.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-500 transition-colors bg-amber-50 dark:bg-amber-900/20" title="Lesson Rule"><Lightbulb size={20} fill="currentColor" /></button>
                                <button onClick={() => setShowTajweedLegend(true)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"><Palette size={20} /></button>
                                <button onClick={() => setShowSettings(!showSettings)} className={`p-2.5 rounded-full transition-all ${showSettings ? 'bg-brand text-white' : 'hover:bg-slate-100 text-slate-600'}`}><SlidersHorizontal size={20} /></button>
                            </div>
                        </div>

                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mx-1">
                            <button onClick={() => setActiveTab('study')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'study' ? 'bg-white dark:bg-slate-700 text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                                <Book size={16} /> Learn
                            </button>
                            <button onClick={() => setActiveTab('exercise')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'exercise' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                                <Gamepad2 size={16} /> Practice
                            </button>
                            <button onClick={() => setActiveTab('qa')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'qa' ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                                <Brain size={16} /> Quiz
                            </button>
                            <button onClick={() => setActiveTab('makhraj')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'makhraj' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                                <ImageIcon size={16} /> Makhraj
                            </button>
                        </div>

                        <div className="px-2 pb-1">
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                                <div className="bg-brand h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(14,165,233,0.6)]" style={{ width: `${lessonProgressPercent}%` }} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                                <span>{completedLessonItemsCount}/{totalLessonItems} mastered</span>
                                <span>{Math.round(lessonProgressPercent)}%</span>
                            </div>
                        </div>
                    </div>

                    {showSettings && activeTab === 'study' && (
                        <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm animate-in slide-in-from-top-2">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase w-16">Speed</span>
                                        <div className="flex gap-1">
                                            {[0.75, 1, 1.25].map(s => <button key={s} onClick={() => setPlaybackSpeed(s)} className={`px-2 py-1 rounded text-xs transition-colors ${playbackSpeed === s ? 'bg-brand text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{s}x</button>)}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setAutoPlay(!autoPlay)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${autoPlay ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400'}`}
                                    >
                                        <PlayCircle size={14} className={autoPlay ? "fill-emerald-500 text-emerald-500" : ""} />
                                        Auto Play: {autoPlay ? "ON" : "OFF"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase w-16">Mode</span>
                                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                        <button
                                            onClick={() => setSpellingMode(false)}
                                            className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${!spellingMode ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}
                                        >
                                            Flow (Rawan)
                                        </button>
                                        <button
                                            onClick={() => setSpellingMode(true)}
                                            className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${spellingMode ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}
                                        >
                                            Spelling (Hijje)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'study' && (
                            isLoadingContent ? (
                                <LessonSkeleton />
                            ) : (
                                <>
                                    {/* Integrated Lesson Info */}
                                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {lesson.description && (
                                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/50">
                                                <h3 className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2">
                                                    <Info size={14} /> Description
                                                </h3>
                                                <p className="text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed">
                                                    {lesson.description[language] || lesson.description['en']}
                                                </p>
                                            </div>
                                        )}
                                        {lesson.rule && (
                                            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-800/50">
                                                <h3 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black uppercase text-[10px] tracking-widest mb-2">
                                                    <Lightbulb size={14} /> Rule
                                                </h3>
                                                <p className="text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed">
                                                    {lesson.rule[language] || lesson.rule['en']}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Special Audio Player for Lesson 54 (Names of Allah) */}
                                    {lessonId === 54 && (
                                        <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl animate-in zoom-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/30">
                                                        <Headphones size={32} className="text-white" />
                                                    </div>
                                                    <div className="text-center sm:text-left rtl:text-right">
                                                        <h3 className="text-xl font-black mb-1">Listen to All 99 Names</h3>
                                                        <p className="text-emerald-100 text-sm font-medium">Beautiful recitation with melody</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (playingItemId === 'l54_full') {
                                                            stopAudio();
                                                        } else {
                                                            stopAudio();
                                                            setPlayingItemId('l54_full');
                                                            playAudioFile('/audio/lesson54/Allah-names.mp3', 'Names of Allah');
                                                        }
                                                    }}
                                                    className="bg-white text-emerald-600 hover:bg-emerald-50 py-3 px-8 rounded-xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 min-w-[160px] justify-center"
                                                >
                                                    {playingItemId === 'l54_full' ? (
                                                        <>
                                                            <div className="flex gap-1 items-center h-4">
                                                                <span className="w-1 h-3 bg-emerald-600 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite]"></span>
                                                                <span className="w-1 h-5 bg-emerald-600 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite_0.1s]"></span>
                                                                <span className="w-1 h-3 bg-emerald-600 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]"></span>
                                                            </div>
                                                            Pause
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlayCircle size={24} fill="currentColor" />
                                                            Play Audio
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <style>{`
                                                @keyframes music-bar {
                                                    0%, 100% { height: 8px; }
                                                    50% { height: 20px; }
                                                }
                                            `}</style>
                                        </div>
                                    )}

                                    {lesson.meta.layout === 'list' ? (
                                        <div className="space-y-3" dir="rtl">
                                            {visibleItems.map((item, index) => {
                                                const isPlaying = playingItemId === item.id;
                                                const isCompleted = progress.completedItems.includes(item.id);
                                                const isBookmarked = progress.bookmarks.includes(item.id);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        ref={(el) => { if (el) itemRefs.current.set(item.id, el); else itemRefs.current.delete(item.id); }}
                                                        className={`bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all duration-300 ${isCompleted ? 'border-green-400 shadow-sm' : (isPlaying ? 'border-amber-300 shadow-lg ring-4 ring-amber-100 dark:ring-amber-900 scale-[1.01] z-10' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')}`}
                                                    >
                                                        <div className="p-6 cursor-pointer relative overflow-hidden group touch-manipulation" onClick={() => handlePlayItem(item)}>
                                                            {isCompleted && <CheckCircle className="absolute top-4 left-4 text-green-500" size={24} />}
                                                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }} className={`absolute top-4 left-12 p-1.5 rounded-full z-20 transition-colors ${isBookmarked ? 'text-red-500' : 'text-slate-300 hover:text-red-400'}`}><Heart size={20} fill={isBookmarked ? "currentColor" : "none"} /></button>

                                                            <div className="flex flex-col items-center text-center gap-4 relative z-10">
                                                                <div className="text-3xl sm:text-5xl font-arabic font-bold text-slate-800 dark:text-white leading-loose flex flex-wrap justify-center gap-x-2 w-full rtl-text" dir="rtl">
                                                                    {item.words && item.words.length > 0 ? (
                                                                        item.words.map((w, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                onClick={(e) => { e.stopPropagation(); handlePlayItem(item, idx); }}
                                                                                className={`transition-all duration-200 rounded px-1 -mx-1 inline-block cursor-pointer hover:text-brand ${isPlaying && activeWordIndex === idx ? 'bg-orange-100 dark:bg-orange-900 text-amber-900 dark:text-amber-100 scale-110 font-extrabold shadow-sm transform' : ''}`}
                                                                            >
                                                                                <TajweedText text={w.text} isPlaying={false} highlightedWordIndex={null} className="dark:text-white" />
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <TajweedText text={item.text_ar} isPlaying={isPlaying} highlightedWordIndex={isPlaying ? activeWordIndex : null} className="dark:text-white" />
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col sm:flex-row items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500" dir="ltr">
                                                                    <div className="flex items-center gap-2">
                                                                        {lessonId !== 54 && <span className="bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded uppercase tracking-wider text-xs">{index + 1}</span>}
                                                                        <span className="text-center">{item.transliteration}</span>
                                                                    </div>
                                                                </div>
                                                                {item.description && (
                                                                    <div className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 w-full text-center">
                                                                        {item.description[language] || item.description['en']}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={`absolute top-4 right-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity ${isPlaying ? 'opacity-100' : ''}`}>{isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <PlayCircle size={24} />}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-fr" dir="rtl">
                                            {visibleItems.map((item, index) => {
                                                const isCompleted = progress.completedItems.includes(item.id);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        ref={(el) => { if (el) itemRefs.current.set(item.id, el); else itemRefs.current.delete(item.id); }}
                                                        className={`relative transition-all duration-300 z-auto`}
                                                    >
                                                        <ArabicGlyph
                                                            item={item}
                                                            isPlaying={playingItemId === item.id}
                                                            activeWordIndex={playingItemId === item.id ? activeWordIndex : null}
                                                            onPlay={handlePlayItem}
                                                            index={index}
                                                            size={lesson?.meta.layout === 'list' ? 'small' : 'medium'}
                                                            isCorrect={isCompleted}
                                                            isSelected={selectedItemId === item.id}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* Infinite Scroll Loading Area */}
                                    <div ref={lastElementRef} className="h-32 w-full flex flex-col items-center justify-center p-4 mt-8 gap-2">
                                        {showLoadMore && (
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-bold animate-pulse">
                                                <Loader2 className="animate-spin" size={20} />
                                                Loading more...
                                            </div>
                                        )}
                                        {showLoadMore && <button onClick={() => setVisibleCount(c => c + 40)} className="text-brand text-xs underline font-bold">Load manually</button>}
                                    </div>

                                    {lessonProgressPercent > 80 && (
                                        <div className="mt-8 flex justify-center pb-20">
                                            <button
                                                onClick={handleCompleteLesson}
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-3 animate-in zoom-in"
                                            >
                                                <CheckCircle size={24} />
                                                Complete Lesson
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        )}

                        {activeTab === 'exercise' && (
                            <div className="mt-4 min-h-[50vh]">
                                {exerciseMode === 'none' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setExerciseMode('memory')}
                                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left rtl:text-right group"
                                        >
                                            <div className="bg-indigo-100 dark:bg-indigo-900 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-300 mb-4 group-hover:scale-110 transition-transform">
                                                <Brain size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Memory Match</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Match the Arabic text with its sound or English name.</p>
                                        </button>

                                        <button
                                            onClick={() => setExerciseMode('audio')}
                                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-emerald-100 dark:border-emerald-900 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left rtl:text-right group"
                                        >
                                            <div className="bg-emerald-100 dark:bg-emerald-900 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
                                                <Headphones size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Audio Challenge</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Listen to the sound and pick the correct letter.</p>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <button onClick={() => setExerciseMode('none')} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-brand font-bold text-sm"><ArrowLeft size={16} className="rtl:rotate-180" /> Back to Games</button>
                                        {exerciseMode === 'memory' && (
                                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-lg border border-slate-100 dark:border-slate-700 min-h-[60vh]">
                                                <MemoryGame items={gameItems} onClose={() => setExerciseMode('none')} />
                                            </div>
                                        )}
                                        {exerciseMode === 'audio' && (
                                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-lg border border-slate-100 dark:border-slate-700 min-h-[60vh]">
                                                <AudioChallenge items={gameItems} onClose={() => setExerciseMode('none')} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'qa' && (
                            <div className="mt-4">
                                {shuffledQuiz.length > 0 ? (
                                    <Quiz
                                        questions={shuffledQuiz}
                                        onComplete={() => {
                                            playSuccessSound();
                                            setShowConfetti(true);
                                            setTimeout(() => setActiveTab('study'), 2000);
                                        }}
                                        onCancel={() => setActiveTab('study')}
                                    />
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <HelpCircle className="mx-auto text-slate-300 mb-4" size={48} />
                                        <p className="text-slate-400 font-bold">No quiz available for this lesson yet.</p>
                                        <button onClick={() => setActiveTab('study')} className="mt-4 text-brand font-bold text-sm hover:underline">Go back to study</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'makhraj' && (
                            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                        <ImageIcon size={24} className="text-purple-500" /> The 17 Makhārij
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Articulation points organized by the 5 main regions</p>

                                    {/* 1. AL-JAUF - Oral Cavity (1 Makhraj) */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-blue-500 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">1</span>
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Al-Jauf <span className="font-arabic text-blue-600 dark:text-blue-400">(الجوف)</span></h4>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-2xl border border-blue-100 dark:border-slate-700">
                                            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-2 font-arabic">ا و ي</p>
                                            <img
                                                src={IMG_JAUF}
                                                alt="Al-Jauf"
                                                className="w-full max-w-md mx-auto h-48 object-contain rounded-xl bg-white cursor-zoom-in hover:opacity-95 transition-opacity"
                                                loading="lazy"
                                                onClick={() => {
                                                    setModalImage(IMG_JAUF);
                                                    setModalTitle('Al-Jauf (The Body Cavity)');
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* 2-4. AL-HALQ - Throat (3 Makhārij) */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">2-4</span>
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Al-Ḥalq <span className="font-arabic text-red-600 dark:text-red-400">(الحلق)</span> - Throat</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 2, name: 'Aqsal-ul-Halq', arabic: 'أقصى الحلق', letters: 'ء ه', img: IMG_THROAT_DEEP },
                                                { id: 3, name: 'Wasat-ul-Halq', arabic: 'وسط الحلق', letters: 'ع ح', img: IMG_THROAT_MIDDLE },
                                                { id: 4, name: 'Adnal-ul-Halq', arabic: 'أدنى الحلق', letters: 'غ خ', img: IMG_THROAT_UPPER },
                                            ].map((m) => (
                                                <div key={m.id} className="bg-red-50 dark:bg-slate-900 p-3 rounded-2xl border border-red-100 dark:border-slate-700">
                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                        <span className="bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">{m.id}</span>
                                                        <h5 className="font-bold text-center text-sm text-slate-700 dark:text-slate-300">{m.name}</h5>
                                                    </div>
                                                    <p className="text-xs text-center text-red-600 dark:text-red-400 font-arabic mb-1">{m.arabic}</p>
                                                    <p className="text-xs text-center text-slate-400 mb-2 font-arabic">{m.letters}</p>
                                                    <img
                                                        src={m.img}
                                                        alt={m.name}
                                                        className="w-full h-36 object-contain rounded-xl bg-white cursor-zoom-in hover:opacity-95 transition-opacity"
                                                        loading="lazy"
                                                        onClick={() => {
                                                            setModalImage(m.img);
                                                            setModalTitle(`${m.name} - ${m.arabic}`);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 5-14. AL-LISĀN - Tongue (10 Makhārij) */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">5-14</span>
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Al-Lisān <span className="font-arabic text-green-600 dark:text-green-400">(اللسان)</span> - Tongue</h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {[
                                                { id: 5, name: 'Aqsal-ul-Lisaan (Qaaf)', arabic: 'أقصى اللسان (ق)', letters: 'ق', img: IMG_TONGUE_BACK_QAF },
                                                { id: 6, name: 'Aqsal-ul-Lisaan (Kaaf)', arabic: 'أقصى اللسان (ك)', letters: 'ك', img: IMG_TONGUE_BACK_KAAF },
                                                { id: 7, name: 'Wasat-ul-Lisaan', arabic: 'وسط اللسان', letters: 'ج ش ي', img: IMG_TONGUE_MIDDLE },
                                                { id: 8, name: 'Haafat-ul-Lisaan', arabic: 'حافة اللسان', letters: 'ض', img: IMG_TONGUE_SIDE_DAAD },
                                                { id: 9, name: 'Taraf (Laam)', arabic: 'طرف اللسان (ل)', letters: 'ل', img: IMG_TONGUE_TIP_LAAM },
                                                { id: 10, name: 'Taraf (Noon)', arabic: 'طرف اللسان (ن)', letters: 'ن', img: IMG_TONGUE_TIP_NOON },
                                                { id: 11, name: 'Taraf (Raa)', arabic: 'طرف اللسان (ر)', letters: 'ر', img: IMG_TONGUE_TIP_RA },
                                                { id: 12, name: 'Taraf + Usool', arabic: 'طرف اللسان مع أصول الثنايا', letters: 'ط د ت', img: IMG_TONGUE_TIP_UPPER_TEETH },
                                                { id: 13, name: 'Taraf + Atrāf', arabic: 'طرف اللسان مع أطراف الثنايا', letters: 'ص ز س', img: IMG_TONGUE_TIP_WHISTLE },
                                                { id: 14, name: 'Taraf + Atrāf (ظذث)', arabic: 'طرف اللسان مع أطراف الثنايا', letters: 'ظ ذ ث', img: IMG_TONGUE_TIP_TEETH_EDGE },
                                            ].map((m) => (
                                                <div key={m.id} className="bg-green-50 dark:bg-slate-900 p-2 rounded-xl border border-green-100 dark:border-slate-700">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <span className="bg-green-500 text-white w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center">{m.id}</span>
                                                        <h5 className="font-bold text-center text-[10px] text-slate-700 dark:text-slate-300 truncate">{m.name}</h5>
                                                    </div>
                                                    <p className="text-[9px] text-center text-green-600 dark:text-green-400 font-arabic truncate">{m.arabic}</p>
                                                    <p className="text-xs text-center text-slate-400 font-arabic">{m.letters}</p>
                                                    <img
                                                        src={m.img}
                                                        alt={m.name}
                                                        className="w-full h-24 object-contain rounded-lg bg-white mt-1 cursor-zoom-in hover:opacity-95 transition-opacity"
                                                        loading="lazy"
                                                        onClick={() => {
                                                            setModalImage(m.img);
                                                            setModalTitle(`${m.name} - ${m.arabic}`);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 15-16. ASH-SHAFĀTAYN - Lips (2 Makhārij) */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">15-16</span>
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Ash-Shafātayn <span className="font-arabic text-pink-600 dark:text-pink-400">(الشفتان)</span> - Lips</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { id: 15, name: 'Ash-Shafataan (Faa)', arabic: 'الشفتان (ف)', letters: 'ف', img: IMG_LIPS_FAA },
                                                { id: 16, name: 'Ash-Shafataan', arabic: 'الشفتان', letters: 'ب م و', img: IMG_LIPS_BOTH },
                                            ].map((m) => (
                                                <div key={m.id} className="bg-pink-50 dark:bg-slate-900 p-3 rounded-2xl border border-pink-100 dark:border-slate-700">
                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                        <span className="bg-pink-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">{m.id}</span>
                                                        <h5 className="font-bold text-center text-sm text-slate-700 dark:text-slate-300">{m.name}</h5>
                                                    </div>
                                                    <p className="text-xs text-center text-pink-600 dark:text-pink-400 font-arabic mb-1">{m.arabic}</p>
                                                    <p className="text-xs text-center text-slate-400 mb-2 font-arabic">{m.letters}</p>
                                                    <img
                                                        src={m.img}
                                                        alt={m.name}
                                                        className="w-full h-36 object-contain rounded-xl bg-white cursor-zoom-in hover:opacity-95 transition-opacity"
                                                        loading="lazy"
                                                        onClick={() => {
                                                            setModalImage(m.img);
                                                            setModalTitle(`${m.name} - ${m.arabic}`);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 17. AL-KHAYASHĪM - Nasal Cavity (1 Makhraj) */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-amber-500 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">17</span>
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200">Al-Khayashim <span className="font-arabic text-amber-600 dark:text-amber-400">(الخيشوم)</span> - Nasal</h4>
                                        </div>
                                        <div className="bg-amber-50 dark:bg-slate-900 p-4 rounded-2xl border border-amber-100 dark:border-slate-700">
                                            <p className="text-xs text-center text-amber-600 dark:text-amber-400 font-arabic mb-1">الخيشوم</p>
                                            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-2">Ghunnah - ن م with shaddah</p>
                                            <img
                                                src={IMG_NASAL}
                                                alt="Al-Khayashim"
                                                className="w-full max-w-md mx-auto h-48 object-contain rounded-xl bg-white cursor-zoom-in hover:opacity-95 transition-opacity"
                                                loading="lazy"
                                                onClick={() => {
                                                    setModalImage(IMG_NASAL);
                                                    setModalTitle('Al-Khayashim (Nasal Cavity)');
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTTOM NAVIGATION BAR */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-3 z-40 flex justify-between items-center pb-safe safe-area-inset-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => prevLessonId && navigate(`/lesson/${prevLessonId}`)}
                    disabled={!prevLessonId}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 font-extrabold transition-all active:scale-95"
                >
                    <ChevronLeft size={24} strokeWidth={3} className="rtl:rotate-180" />
                </button>

                <button
                    onClick={() => setShowNav(true)}
                    className="flex flex-col items-center justify-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-brand transition-colors"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-brand">All Lessons</span>
                </button>

                <button
                    onClick={() => nextLessonId && navigate(`/lesson/${nextLessonId}`)}
                    disabled={!nextLessonId}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand/10 hover:bg-brand/20 text-brand dark:text-brand-light font-extrabold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    <ChevronRight size={24} strokeWidth={3} className="rtl:rotate-180" />
                </button>
            </div>

            {/* DETAILS PANEL (Context Aware) - Only show in Study Mode */}
            {activeTab === 'study' && (
                <div className={`fixed bottom-0 left-0 w-full lg:w-80 bg-white dark:bg-slate-900 border-t border-r border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out ${selectedItemId ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-6">
                        {activeItem && (
                            <>
                                {/* Header Row */}
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
                                        <Info size={16} className="text-brand" />
                                        {activeWordDetails ? 'Word Analysis' : 'Letter Details'}
                                    </h3>
                                    <button onClick={() => setSelectedItemId(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Phase-Based Layout */}
                                {(() => {
                                    // Determine phase from lessonId
                                    const phase = lessonId <= 10 ? 1 : lessonId <= 24 ? 2 : lessonId <= 48 ? 3 : lessonId <= 59 ? 4 : 5;

                                    // Get makhraj highlight ID for the active item
                                    const firstLetter = normalizeArabic(activeItem.text_ar).replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').charAt(0);
                                    const makhrajInfo = MAKHRAJ_DESCRIPTIONS[firstLetter];
                                    const highlightId = makhrajInfo ? getHighlightFromBodyPart(makhrajInfo.bodyPart) : 'tongue-tip';

                                    // Prepare item with makhraj highlight
                                    const enhancedItem = {
                                        ...activeItem,
                                        makhrajHighlightId: highlightId,
                                    };

                                    // Use Context Layout for Phase 5 (Surahs with translations)
                                    if (phase >= 5) {
                                        return (
                                            <ContextLayout
                                                item={enhancedItem}
                                                language={language}
                                                onReplay={handleReplayLast}
                                                onSlowReplay={() => {
                                                    // Slow playback at 0.5x
                                                    if (activeItem.audio?.main) {
                                                        const audio = new Audio(activeItem.audio.main);
                                                        audio.playbackRate = 0.5;
                                                        audio.play();
                                                    }
                                                }}
                                            />
                                        );
                                    }

                                    // Use Comparison Layout for comparison type items (e.g., "ء vs ع")
                                    if (activeItem.type === 'comparison' || activeItem.text_ar.includes('vs')) {
                                        return (
                                            <ComparisonLayout
                                                item={enhancedItem}
                                                language={language}
                                                onReplay={handleReplayLast}
                                                onSlowReplay={() => {
                                                    if (activeItem.audio?.main) {
                                                        const audio = new Audio(activeItem.audio.main);
                                                        audio.playbackRate = 0.5;
                                                        audio.play();
                                                    }
                                                }}
                                            />
                                        );
                                    }

                                    // Use Anatomy Layout for Phases 1-4 (Learning articulation)
                                    return (
                                        <AnatomyLayout
                                            item={enhancedItem}
                                            language={language}
                                            onReplay={handleReplayLast}
                                            onSlowReplay={() => {
                                                // Slow playback at 0.5x
                                                if (activeItem.audio?.main) {
                                                    const audio = new Audio(activeItem.audio.main);
                                                    audio.playbackRate = 0.5;
                                                    audio.play();
                                                }
                                            }}
                                        />
                                    );
                                })()}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonPage;
