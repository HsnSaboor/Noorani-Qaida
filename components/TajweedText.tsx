
import React from 'react';
// playTajweedTone removed from usage to prevent confusion

interface TajweedTextProps {
  text: string;
  isPlaying?: boolean;
  highlightedWordIndex?: number | null;
  className?: string;
}

// Tajweed Logic
const TAJWEED_RULES = {
  qalqala: 'قطبجد', // Red
  heavy: 'خصضغطقظ', // Blue
  throat: 'ءهعحغخ', // Green
  ghunna: 'من',     // Pink
};

const TajweedText: React.FC<TajweedTextProps> = React.memo(({ text, isPlaying = false, highlightedWordIndex = null, className = '' }) => {
  // If isPlaying is true and no specific word is highlighted, highlight the whole block.
  const highlightAll = isPlaying && highlightedWordIndex === null;

  return (
    <span className={`rtl-text font-arabic leading-relaxed ${className}`} dir="rtl">
      {text.split(' ').map((word, wIdx) => {
        const isHighlighted = highlightAll || highlightedWordIndex === wIdx;

        return (
          <span
            key={wIdx}
            className={`inline-block whitespace-nowrap mx-1 transition-all duration-300 ${isHighlighted ? 'scale-110' : ''}`}
          >
            {word.split('').map((char, cIdx) => {
              // Default color
              let colorClass = isHighlighted ? 'text-emerald-600 dark:text-emerald-400 font-extrabold drop-shadow-md brightness-110' : 'text-slate-800 dark:text-slate-200';

              // Check rules (only if not highlighted, or mix?)
              // User wants "golden hue", so if highlighted, amber is better.
              if (!isHighlighted) {
                if (TAJWEED_RULES.qalqala.includes(char)) {
                  colorClass = 'text-red-600 dark:text-red-400';
                }
                else if (TAJWEED_RULES.heavy.includes(char)) {
                  colorClass = 'text-blue-700 dark:text-blue-400';
                }
                else if (TAJWEED_RULES.throat.includes(char)) {
                  colorClass = 'text-emerald-600 dark:text-emerald-400';
                }
                else if (TAJWEED_RULES.ghunna.includes(char)) {
                  colorClass = 'text-pink-500 dark:text-pink-400';
                }

                // Diacritics (Harakat)
                const isDiacritic = /[\u064B-\u065F\u0670]/.test(char);
                if (isDiacritic) {
                  colorClass = 'text-slate-500 dark:text-slate-400';
                }
              } else {
                // Even if highlighted, preserve some rule colors but with higher contrast?
                // No, let's stick to a clear highlight for now.
              }

              return (
                <span key={cIdx} className={`${colorClass}`}>
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
});

export default TajweedText;
