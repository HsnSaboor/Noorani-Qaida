
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Volume2, ImageOff, FolderOpen, Loader2, Dumbbell, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { fetchLessonContent, IMG_GENERAL, IMG_THROAT, IMG_LIPS, IMG_TONGUE_TIP, IMG_TONGUE_BACK, IMG_TONGUE_SIDE, IMG_JAUF } from '../constants';
import ArabicGlyph from '../components/ArabicGlyph';
import ImageModal from '../components/ImageModal';
import { LessonItem, LessonQuiz } from '../types';
import Quiz from '../components/Quiz';

const MakhrajGallery: React.FC = () => {
    const { language } = useAppContext();
    const [mode, setMode] = useState<'gallery' | 'quiz'>('gallery');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [alphabetItems, setAlphabetItems] = useState<LessonItem[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<LessonQuiz[]>([]);
    // Track loading state for content population
    const [isLoaded, setIsLoaded] = useState(false);

    // For ImageModal
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

    // Load Alphabet Lesson (Lesson 1) and Makhraj Masterclass (Lesson 45) asynchronously
    useEffect(() => {
        const loadContent = async () => {
            const [l1, l45] = await Promise.all([
                fetchLessonContent(1),
                fetchLessonContent(45) 
            ]);
            
            if (l1 && l1.items) {
                setAlphabetItems(l1.items);
            }
            if (l45 && l45.quiz) {
                // Shuffle questions
                setQuizQuestions([...l45.quiz].sort(() => Math.random() - 0.5));
            }
            setIsLoaded(true);
        };
        loadContent();
    }, []);

    // Explicitly define which letters go into which section by ID
    const GROUPS = {
        jauf: ['l1_alif'],
        throat: ['l1_hamza', 'l1_ha_h', 'l1_ain', 'l1_ha_s', 'l1_ghain', 'l1_kha'],
        lips: ['l1_fa', 'l1_waw', 'l1_ba', 'l1_meem'],
        tongueBack: ['l1_qaf', 'l1_kaf', 'l1_jeem', 'l1_sheen', 'l1_ya'], 
        tongueSide: ['l1_dad', 'l1_lam', 'l1_noon'],
        tongueTip: ['l1_ra', 'l1_ta', 'l1_dal', 'l1_toa', 'l1_za', 'l1_seen', 'l1_sad', 'l1_tha', 'l1_dhal', 'l1_zoa']
    };

    const getItems = (ids: string[]) => alphabetItems.filter(item => ids.includes(item.id));

    const sections = [
        {
            id: 'general',
            title: { en: 'Overview', ur: 'جائزہ', fr: 'Aperçu', es: 'Resumen' },
            desc: { en: 'A comprehensive map of all articulation points.', ur: 'حروف کے مخارج کا مکمل نقشہ۔', fr: 'Carte complète des points d\'articulation.', es: 'Un mapa completo de todos los puntos de articulación.' },
            img: IMG_GENERAL,
            items: []
        },
        {
            id: 'jauf',
            title: { en: 'The Body Cavity (Jauf)', ur: 'جوف (منہ کا خالی حصہ)', fr: 'Le Vide (Jauf)', es: 'La Cavidad Corporal (Jauf)' },
            desc: { en: 'Sound produced from the empty space of the mouth and throat (Vowels).', ur: 'آواز منہ اور حلق کے خالی حصے سے آتی ہے۔', fr: 'Son produit par l\'espace vide.', es: 'Sonido producido desde el espacio vacío de la boca y la garganta.' },
            img: IMG_JAUF,
            items: getItems(GROUPS.jauf)
        },
        {
            id: 'throat',
            title: { en: 'The Throat (Halq)', ur: 'حلق (Halq)', fr: 'La Gorge', es: 'La Garganta (Halq)' },
            desc: { en: 'Letters originating from the Deep, Middle, and Upper throat.', ur: 'حلق کے نچلے، درمیانے اور اوپر والے حصے سے ادا ہونے والے حروف۔', fr: 'Lettres de la gorge.', es: 'Letras originadas en la garganta profunda, media y superior.' },
            img: IMG_THROAT,
            items: getItems(GROUPS.throat)
        },
        {
            id: 'tongue-back',
            title: { en: 'Back/Mid Tongue', ur: 'زبان کی جڑ / درمیان', fr: 'Arrière de la langue', es: 'Lengua Posterior/Media' },
            desc: { en: 'Deepest part (Qaf, Kaf) and Middle (Jeem, Sheen, Ya) of the tongue.', ur: 'زبان کی جڑ اور درمیان والا حصہ۔', fr: 'Partie la plus profonde de la langue.', es: 'Parte más profunda (Qaf, Kaf) y Media (Jeem, Sheen, Ya) de la lengua.' },
            img: IMG_TONGUE_BACK,
            items: getItems(GROUPS.tongueBack)
        },
        {
            id: 'tongue-side',
            title: { en: 'Side/Edge of Tongue', ur: 'زبان کی کروٹ', fr: 'Côté de la langue', es: 'Lado/Borde de la Lengua' },
            desc: { en: 'Sides of the tongue touching the molars (Dad) or gums (Lam, Nun).', ur: 'زبان کی کروٹ جو اوپر کی داڑھوں سے لگتی ہے۔', fr: 'Côtés de la langue.', es: 'Lados de la lengua tocando los molares (Dad) o encías (Lam, Nun).' },
            img: IMG_TONGUE_SIDE,
            items: getItems(GROUPS.tongueSide)
        },
        {
            id: 'tongue-tip',
            title: { en: 'Tip of Tongue (Tarf)', ur: 'زبان کی نوک', fr: 'Bout de la langue', es: 'Punta de la Lengua (Tarf)' },
            desc: { en: 'The tip of the tongue touching teeth, gums, or palate.', ur: 'زبان کی نوک جو دانتوں یا مسوڑھوں سے لگتی ہے۔', fr: 'Le bout de la langue.', es: 'La punta de la lengua tocando dientes, encías o paladar.' },
            img: IMG_TONGUE_TIP,
            items: getItems(GROUPS.tongueTip)
        },
        {
            id: 'lips',
            title: { en: 'The Lips (Shafatain)', ur: 'ہونٹ (Shafatain)', fr: 'Les Lèvres', es: 'Los Labios (Shafatain)' },
            desc: { en: 'Letters articulated using one or both lips.', ur: 'وہ حروف جو ایک یا دونوں ہونٹوں سے ادا ہوتے ہیں۔', fr: 'Lettres des lèvres.', es: 'Letras articuladas usando uno o ambos labios.' },
            img: IMG_LIPS,
            items: getItems(GROUPS.lips)
        }
    ];

    const handlePlay = (item: LessonItem) => {
        if(playingId) return;
        setPlayingId(item.id);
        
        const audioSrc = item.audio?.main;
        if (!audioSrc) {
            setTimeout(() => setPlayingId(null), 500);
            return;
        }

        const audio = new Audio(audioSrc);
        audio.onended = () => setPlayingId(null);
        audio.onerror = () => setPlayingId(null);
        audio.play().catch(() => setPlayingId(null));
    };

    const isVideo = (path: string) => path.endsWith('.mp4') || path.endsWith('.webm');

    if (mode === 'quiz') {
        return (
            <div className={`max-w-4xl mx-auto p-4 sm:p-6 pb-24 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setMode('gallery')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Makhraj Quiz</h1>
                </div>
                {quizQuestions.length > 0 ? (
                    <Quiz 
                        questions={quizQuestions} 
                        onComplete={() => setMode('gallery')} 
                        onCancel={() => setMode('gallery')} 
                    />
                ) : (
                    <div className="text-center py-20">
                        {isLoaded ? (
                            <>
                                <p className="text-slate-400">No questions available.</p>
                                <button onClick={() => setMode('gallery')} className="mt-4 text-brand font-bold">Go Back</button>
                            </>
                        ) : (
                            <Loader2 className="animate-spin text-brand mx-auto" size={32} />
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`max-w-6xl mx-auto p-4 sm:p-6 pb-24 ${language === 'ur' ? 'rtl-text font-urdu' : 'font-sans'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-slate-800">Makhraj Guide</h1>
                        <p className="text-sm text-slate-500">Visual articulation points for Lesson 1-16</p>
                    </div>
                </div>
                <button 
                    onClick={() => setMode('quiz')}
                    className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                    <Dumbbell size={20} />
                    <span>Test Your Knowledge</span>
                </button>
            </div>

            <ImageModal
                isOpen={!!modalImage}
                onClose={() => setModalImage(null)}
                imageSrc={modalImage || ''}
                title={modalTitle}
            />

            <div className="grid gap-12 animate-in slide-in-from-bottom-4 duration-500">
                {sections.map((section, idx) => {
                    // Skip sections with no items unless it's the general overview OR if we are still loading (so we show skeleton if needed)
                    if (isLoaded && section.id !== 'general' && section.items.length === 0) return null;

                    return (
                        <section key={section.id} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand/20 to-brand-light"></div>
                             
                             <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Visual Side */}
                                <div className={`w-full ${section.id === 'general' ? 'md:w-full' : 'md:w-1/3'} flex flex-col gap-4`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-lg">
                                            {idx + 1}
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800">{section.title[language] || section.title.en}</h2>
                                    </div>
                                    
                                    <div className={`bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center ${section.id === 'general' ? 'h-80' : 'h-64'}`}>
                                        {isVideo(section.img) ? (
                                            <video 
                                                src={section.img} 
                                                controls 
                                                className="w-full h-full object-contain bg-black"
                                                poster={section.img.replace('.mp4', '.png')} 
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    src={section.img}
                                                    alt={section.id}
                                                    className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300 cursor-zoom-in"
                                                    loading="lazy"
                                                    onClick={() => {
                                                        setModalImage(section.img);
                                                        setModalTitle(section.title[language] || section.title.en);
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        e.currentTarget.nextElementSibling?.classList.add('flex');
                                                    }}
                                                />
                                                <div className="hidden w-full h-full flex-col items-center justify-center text-slate-400 p-6 text-center bg-slate-100/50">
                                                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                                        <ImageOff size={32} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600 mb-1">Image Not Found</span>
                                                    <code className="text-[10px] text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 font-mono mb-2 break-all">
                                                        {section.img}
                                                    </code>
                                                    <div className="text-[10px] text-brand font-medium flex items-center gap-1 bg-brand/10 px-2 py-1 rounded-full">
                                                        <FolderOpen size={10} />
                                                        Ensure file exists in /public
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <Info size={16} className="inline mr-2 text-brand mb-1" />
                                        {section.desc[language] || section.desc.en}
                                    </p>
                                </div>

                                {/* Letters Grid (Skip for General) */}
                                {section.id !== 'general' && (
                                    <div className="flex-1 w-full bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Volume2 size={16} /> Click to Listen
                                        </h3>
                                        
                                        {!isLoaded ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="aspect-square bg-slate-200 rounded-2xl opacity-50"></div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                                {section.items.map((item, i) => (
                                                    <div key={item.id} className="flex flex-col items-center gap-2 group">
                                                        <div className="transform transition-transform hover:-translate-y-1">
                                                            <ArabicGlyph 
                                                                item={item} 
                                                                isPlaying={playingId === item.id}
                                                                onPlay={handlePlay}
                                                                size="small"
                                                                index={i}
                                                            />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="block text-sm font-bold text-slate-700">{item.transliteration}</span>
                                                            <span className="text-[10px] text-slate-400 font-arabic">{item.text_ar}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                             </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default MakhrajGallery;
