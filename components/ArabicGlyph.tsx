
import React, { useState } from 'react';
import { LessonItem } from '../types';
import { useAppContext } from '../context/AppContext';
import { Info, ImageOff, CheckCircle2, Heart, Dumbbell, ImageIcon } from 'lucide-react';
import TajweedText from './TajweedText';
import { normalizeArabic } from '../data/utils';
import ImageModal from './ImageModal';

interface ArabicGlyphProps {
  item: LessonItem;
  isPlaying: boolean;
  onPlay: (item: LessonItem) => void;
  onHover?: (item: LessonItem) => void;
  size?: 'small' | 'medium' | 'large';
  showDescriptionInline?: boolean;
  index?: number;
  isCorrect?: boolean;
  isSelected?: boolean;
  activeWordIndex?: number | null;
}

// Updated Vibrant/Pop Colors for Kids
const CARD_VARIANTS = [
  'bg-cyan-50 border-cyan-200 shadow-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800 dark:shadow-none',
  'bg-lime-50 border-lime-200 shadow-lime-100 dark:bg-lime-900/20 dark:border-lime-800 dark:shadow-none',
  'bg-fuchsia-50 border-fuchsia-200 shadow-fuchsia-100 dark:bg-fuchsia-900/20 dark:border-fuchsia-800 dark:shadow-none',
  'bg-amber-50 border-amber-200 shadow-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:shadow-none',
  'bg-violet-50 border-violet-200 shadow-violet-100 dark:bg-violet-900/20 dark:border-violet-800 dark:shadow-none',
  'bg-rose-50 border-rose-200 shadow-rose-100 dark:bg-rose-900/20 dark:border-rose-800 dark:shadow-none',
];

const ArabicGlyph: React.FC<ArabicGlyphProps> = React.memo(({ item, isPlaying, onPlay, onHover, size = 'medium', showDescriptionInline = false, index = 0, isCorrect = false, isSelected = false, activeWordIndex = null }) => {
  const { language, toggleBookmark, progress } = useAppContext();
  const [imgError, setImgError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const isBookmarked = progress.bookmarks.includes(item.id);

  const getMakhrajLabel = (makhraj: string | undefined) => {
    if (!makhraj) return '';

    // Full labels for short keywords
    const labels: Record<string, { en: string, ur: string, fr: string }> = {
      'throat': { en: 'Throat', ur: 'حلق', fr: 'Gorge' },
      'lips': { en: 'Lips', ur: 'ہونٹ', fr: 'Lèvres' },
      'tongue': { en: 'Tongue', ur: 'زبان', fr: 'Langue' },
      'nose': { en: 'Nose', ur: 'ناک', fr: 'Nez' },
      'jauf': { en: 'Jauf', ur: 'جوف', fr: 'Jauf' },
    };

    const lowerMakhraj = makhraj.toLowerCase();

    // Direct match for short keywords
    if (labels[lowerMakhraj]) {
      return labels[lowerMakhraj][language] || labels[lowerMakhraj]['en'];
    }

    // Extract from filepath (e.g., /makhraj_tongue_tip_laam.webp)
    if (makhraj.includes('/')) {
      const filename = makhraj.split('/').pop()?.replace('.webp', '').replace('.png', '') || '';
      // Extract articulation point from filename
      if (filename.includes('jauf')) return labels['jauf']?.[language] || 'Jauf';
      if (filename.includes('lips') || filename.includes('shafa')) return labels['lips']?.[language] || 'Lips';
      if (filename.includes('throat') || filename.includes('halq')) return labels['throat']?.[language] || 'Throat';
      if (filename.includes('tongue')) return labels['tongue']?.[language] || 'Tongue';
      if (filename.includes('nose') || filename.includes('nasal')) return labels['nose']?.[language] || 'Nasal';

      // Just return "Makhraj" as fallback instead of the long filename
      return language === 'ur' ? 'مخرج' : 'Makhraj';
    }

    // Truncate if still too long
    return makhraj.length > 10 ? makhraj.slice(0, 10) + '...' : makhraj;
  };

  const getSeparatedText = (text: string) => {
    // Logic to add space between letters but keep diacritics attached
    return text.replace(/([^\u064B-\u065F\u0670\u06D6-\u06ED\s])([\u064B-\u065F\u0670\u06D6-\u06ED]*)/g, '$1$2 ').trim();
  };

  const handleMouseEnter = () => {
    if (onHover) onHover(item);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(item);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(item.id);
  };

  const toggleImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImage(!showImage);
  }

  const variantClass = CARD_VARIANTS[index % CARD_VARIANTS.length];

  const id = item.id || '';
  const textLen = normalizeArabic(item.text_ar).length;
  // Check if text is very long (Full Ayah)
  const isLongText = textLen > 40;

  const isSingleLetterLesson = id.startsWith('l1_') || (textLen === 1 && !item.text_ar.includes(' '));
  // Exclude Lesson 10 from showing bottom row as it contains drill patterns (A-I-U)
  const showBottomRow = !id.startsWith('l10_') && !isSingleLetterLesson && (textLen > 1 || item.type !== 'single') && !item.text_ar.includes(' vs ') && !isLongText;

  // Detect "Heavy" (Strength) from description if not explicitly set
  const descriptionText = item.description
    ? (item.description[language] || item.description['en'])
    : '';
  const isHeavy = descriptionText?.toLowerCase().includes('heavy') || item.text_ar.match(/[خ ص ض غ ط ق ظ]/);

  const showDetails = showDescriptionInline || isPlaying || isSelected;

  // Tighter Height for smaller boxes (Reduced by ~20%)
  const defaultHeightClass = showBottomRow ? "h-40 sm:h-44" : "h-32 sm:h-36"; // Was h-64/56 -> h-52/44? No wait, original was h-48/56. Let's go h-40/44.
  const expandedHeightClass = showBottomRow ? "h-auto min-h-[14rem] sm:min-h-[16rem]" : "h-auto min-h-[9rem] sm:min-h-[11rem]";

  const heightClass = showDescriptionInline
    ? "min-h-[280px]"
    : (showDetails ? expandedHeightClass : defaultHeightClass);

  const containerClasses = showDescriptionInline
    ? `w-full ${heightClass} p-4 flex-col justify-start pt-6`
    : `w-full ${heightClass} p-3 flex flex-col items-center justify-center ${showBottomRow ? 'gap-1' : ''}`;

  // Typography Sizing (Reduced by ~1 step)
  let topTextClass = '';
  if (showDescriptionInline) {
    topTextClass = 'text-6xl sm:text-8xl mb-3 mt-1';
  } else {
    // Reduced scales
    if (textLen <= 2) topTextClass = 'text-6xl sm:text-7xl';       // Was 7xl/8xl
    else if (textLen <= 3) topTextClass = 'text-5xl sm:text-6xl';  // Was 6xl/7xl
    else if (textLen <= 6) topTextClass = 'text-4xl sm:text-5xl';  // Was 5xl/6xl
    else if (textLen <= 12) topTextClass = 'text-3xl sm:text-4xl'; // Was 4xl/5xl
    else if (isLongText) topTextClass = 'text-2xl font-bold leading-relaxed whitespace-nowrap'; // For marquee
    else topTextClass = 'text-2xl sm:text-3xl';                    // Was 3xl/4xl
  }

  const bottomTextClass = 'text-xl sm:text-2xl text-slate-500 dark:text-slate-400 opacity-80'; // Was 2xl/3xl
  const bottomText = getSeparatedText(item.text_ar);

  const cardBorderStyle = isCorrect
    ? 'border-4 border-green-400 bg-green-50 dark:bg-green-900/40 dark:border-green-500'
    : (isPlaying
      ? 'bg-brand text-white scale-105 shadow-2xl ring-4 ring-brand-light dark:ring-brand-dark border-transparent'
      : `${variantClass} border-2 hover:shadow-lg hover:-translate-y-2`);

  // Marquee Style for Long Text
  const marqueeStyle = isLongText ? {
    display: 'inline-block',
    paddingLeft: '100%',
    animation: 'marquee 15s linear infinite',
  } : {};

  return (
    <div
      className={`
        relative group cursor-pointer select-none perspective-1000
        will-change-transform
        ${showDescriptionInline ? 'w-full h-full' : ''}
        ${isPlaying || isCorrect || isSelected ? 'z-50' : 'z-auto'}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <ImageModal
        isOpen={showFullImageModal}
        onClose={() => setShowFullImageModal(false)}
        imageSrc={item.visual_aid?.src || ''}
        title={item.transliteration ? `Makhraj: ${item.transliteration}` : 'Makhraj'}
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
      `}</style>

      {/* Simple darkened backdrop for focus */}
      {(isPlaying) && (
        <div className="fixed inset-0 bg-black/20 z-[-1] animate-in fade-in duration-200 rounded-[3rem]" />
      )}

      {/* Success Badge - Bouncy and Big - MOVED TO TOP LEFT */}
      {isCorrect && (
        <div className="absolute -top-4 -left-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-xl animate-bounce-short border-4 border-white dark:border-slate-900">
          <CheckCircle2 size={28} strokeWidth={3} />
        </div>
      )}

      {/* Heavy Badge */}
      {isHeavy && !isLongText && (
        <div className="absolute -bottom-3 -right-3 z-40 bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg border-2 border-white text-xs font-bold uppercase tracking-wider flex items-center gap-1" title="Heavy Letter">
          <Dumbbell size={12} /> Heavy
        </div>
      )}

      {/* Visual Aid Toggle Button */}
      {item.visual_aid && (
        <button
          onClick={toggleImage}
          className={`absolute bottom-3 left-3 z-40 p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 bg-white/80 dark:bg-slate-800/80 text-brand border border-brand/20`}
          title="Show Articulation Point"
        >
          <ImageIcon size={18} strokeWidth={2.5} />
        </button>
      )}

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        className={`absolute top-3 right-3 z-40 p-2.5 rounded-full shadow-sm transition-all duration-200 active:scale-90 ${isBookmarked ? 'bg-red-500 text-white ring-4 ring-red-200 shadow-red-200' : 'bg-white/50 hover:bg-white text-slate-400 hover:text-red-500 border-2 border-transparent hover:border-slate-100'}`}
      >
        <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={3} />
      </button>

      {/* Image Overlay Modal-ish */}
      {showImage && item.visual_aid && (
        <div className="absolute inset-2 z-50 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center p-2 shadow-inner animate-in zoom-in duration-200" onClick={(e) => {
          e.stopPropagation();
          setShowFullImageModal(true);
        }}>
          <img
            src={item.visual_aid.src}
            alt="Makhraj"
            className="w-full h-full object-contain rounded-xl cursor-zoom-in"
            onError={() => setImgError(true)}
          />
          {imgError && <div className="text-xs text-red-400">Image failed</div>}
        </div>
      )}

      <div
        className={`
          flex items-center justify-center rounded-[2.5rem] transform-style-3d
          font-arabic font-bold relative overflow-hidden touch-manipulation
          transition-all duration-300 ease-out
          ${containerClasses}
          ${cardBorderStyle}
        `}
      >
        {/* Playful background circle */}
        <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-20 ${isPlaying ? 'bg-white' : 'bg-current'}`}></div>

        {/* TOP: THE FULL WORD (Connected) */}
        <div className={`relative z-10 rtl-text leading-relaxed ${topTextClass} transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md ${isPlaying ? 'animate-bounce-short drop-shadow-xl' : ''}`} dir="rtl">
          {item.text_ar.includes(' vs ') ? (
            <div className="flex items-center justify-center gap-2 sm:gap-4" dir="ltr">
              <TajweedText text={item.text_ar.split(' vs ')[0]} isPlaying={isPlaying} highlightedWordIndex={isPlaying ? activeWordIndex : null} />
              <span className="text-xl sm:text-2xl text-slate-300 dark:text-slate-600 font-sans font-black tracking-widest mt-2">VS</span>
              <TajweedText text={item.text_ar.split(' vs ')[1]} isPlaying={isPlaying} highlightedWordIndex={isPlaying ? activeWordIndex : null} />
            </div>
          ) : isLongText ? (
            <div className="w-full overflow-hidden whitespace-nowrap px-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div style={marqueeStyle}>
                <TajweedText text={item.text_ar} isPlaying={isPlaying} highlightedWordIndex={isPlaying ? activeWordIndex : null} />
              </div>
            </div>
          ) : (
            <TajweedText text={item.text_ar} isPlaying={isPlaying} highlightedWordIndex={isPlaying ? activeWordIndex : null} />
          )}
        </div>

        {/* BOTTOM: THE LETTERS (Separated) */}
        {showBottomRow && (
          <div className={`
                relative z-10 rtl-text leading-relaxed font-arabic transition-colors duration-300
                ${bottomTextClass} 
                border-t-2 border-black/5 dark:border-white/10 pt-3 w-full text-center mt-2
            `} dir="rtl">
            {bottomText}
          </div>
        )}

        {showDetails && (
          <div className={`z-10 w-full flex flex-col gap-3 items-center animate-in fade-in slide-in-from-bottom-2 mt-auto pt-4`}>

            {showDescriptionInline && item.transliteration && (
              <div className="bg-white/90 dark:bg-slate-800/90 px-6 py-2 rounded-full text-2xl font-bold font-sans tracking-wide text-slate-900 dark:text-white border-2 border-white/60 dark:border-slate-600 shadow-md text-center">
                {item.transliteration}
              </div>
            )}

            {item.makhraj && (
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${isPlaying ? 'bg-white/20 text-white border-2 border-white/30' : 'bg-white dark:bg-slate-700 text-brand dark:text-brand-light border-2 border-brand/20 dark:border-slate-600'}`}>
                <Info size={14} strokeWidth={3} />
                {getMakhrajLabel(item.makhraj)}
              </span>
            )}

            {showDescriptionInline && item.visual_aid?.src && !showImage && (
              <div className="w-full aspect-video bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-lg border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden cursor-zoom-in" onClick={(e) => {
                e.stopPropagation();
                setShowFullImageModal(true);
              }}>
                {!imgError ? (
                  <img
                    src={item.visual_aid.src}
                    alt="Makhraj"
                    className="w-full h-full object-contain rounded-2xl"
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 p-2 text-center w-full h-full bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <ImageOff size={32} />
                    <span className="text-[10px] font-mono mt-2 text-slate-400 dark:text-slate-500 break-all leading-tight">
                      {item.visual_aid.src.split('/').pop()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {descriptionText && (
              <div className={`text-center leading-relaxed px-4 py-2 rounded-2xl max-w-sm transition-all duration-300 ${isPlaying ? 'text-white font-bold bg-black/10 backdrop-blur-sm' : 'text-slate-600 dark:text-slate-300 font-medium'} ${language === 'ur' ? 'font-urdu text-lg' : 'font-sans text-sm'}`}>
                {descriptionText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default ArabicGlyph;
