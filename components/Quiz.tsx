
import React, { useState, useEffect, useRef } from 'react';
import { LessonQuiz } from '../types';
import { TEXTS } from '../constants';
import { useAppContext } from '../context/AppContext';
import { playSuccessSound, playErrorSound } from '../data/utils';
import { Volume2, Check, X, RefreshCw, ArrowRight } from 'lucide-react';

interface QuizProps {
  questions: LessonQuiz[];
  onComplete: () => void;
  onCancel: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onCancel }) => {
  const { language } = useAppContext();
  const t = TEXTS;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selection, setSelection] = useState<{ qIndex: number; opt: string | object } | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentQuestion = questions[currentQuestionIndex];

  // Helper to get text from option (can be string or translation object)
  const getOptionText = (option: string | { [key: string]: string | undefined }) => {
    if (typeof option === 'string') return option;
    return option[language] || option['en'] || '';
  };

  // Helper to compare options for correctness
  const isCorrectOption = (option: string | { [key: string]: string | undefined }) => {
    const correctAnswer = currentQuestion.correct;
    if (typeof option === 'string' && typeof correctAnswer === 'string') {
      return option === correctAnswer;
    }
    if (typeof option === 'object' && typeof correctAnswer === 'object') {
      return getOptionText(option) === getOptionText(correctAnswer);
    }
    // Mixed types - compare text values
    return getOptionText(option) === getOptionText(correctAnswer as any);
  };

  useEffect(() => {
    if (!selection) {
      const timer = setTimeout(() => {
        playTargetSound();
      }, 500);
      return () => {
        clearTimeout(timer);
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    }
  }, [currentQuestionIndex]);

  const playTargetSound = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    // First try question audio if it's explicitly provided
    if (currentQuestion.audio) {
      try {
        const audio = new Audio(currentQuestion.audio);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          // If specific audio fails, try TTS for the question text
          playTTS(currentQuestion.question[language] || currentQuestion.question['en']);
        };
        await audio.play();
        return;
      } catch (e) {
        console.warn("Quiz audio play failed:", e);
      }
    }

    // Fallback: TTS the question text so the child knows what to do
    const questionText = currentQuestion.question[language] || currentQuestion.question['en'];
    playTTS(questionText);
  };

  const playTTS = (text: string | undefined) => {
    if (!text) {
      setIsPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Detect if text is Arabic
      const isArabic = /[\u0600-\u06FF]/.test(text);
      if (isArabic) {
        utterance.lang = 'ar-SA';
      } else {
        utterance.lang = language === 'ur' ? 'ur-PK' : language === 'fr' ? 'fr-FR' : 'en-US';
      }

      utterance.rate = 0.9; // Slightly slower for kids
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const handleNext = () => {
    setSelection(null);
    setIsCorrect(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleOptionSelect = (option: string | { [key: string]: string | undefined }) => {
    if (selection) return;

    const optionText = getOptionText(option);
    // Play option TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(optionText);
      const isArabic = /[\u0600-\u06FF]/.test(optionText);
      u.lang = isArabic ? 'ar-SA' : (language === 'ur' ? 'ur-PK' : language === 'fr' ? 'fr-FR' : 'en-US');
      window.speechSynthesis.speak(u);
    }

    setSelection({ qIndex: currentQuestionIndex, opt: option });
    const correct = isCorrectOption(option);
    setIsCorrect(correct);

    if (correct) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 sm:p-10 max-w-2xl mx-auto text-center transition-colors`}
      // STOP PROPAGATION to prevent parent page swipes
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-brand h-full transition-all duration-500"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div key={currentQuestionIndex} className="animate-in fade-in slide-in-from-right duration-300">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t.quizTitle[language] || t.quizTitle['en']}</h2>

        <div className="mb-6 flex flex-col items-center justify-center gap-4">
          {currentQuestion.visual ? (
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-white">
              <img
                src={currentQuestion.visual}
                alt="Visual Prompt"
                className="w-full h-48 object-contain"
              />
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); playTargetSound(); }}
              className={`
                        w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg
                        ${isPlaying ? 'bg-brand scale-110 ring-4 ring-brand-light dark:ring-brand-dark' : 'bg-brand text-white hover:bg-brand-dark hover:scale-105'}
                        cursor-pointer
                    `}
              title="Play Question Audio"
            >
              <Volume2 size={40} className="text-white" />
            </button>
          )}
        </div>

        <p className="text-slate-500 dark:text-slate-300 mb-8 text-lg font-medium px-4 leading-relaxed">
          {currentQuestion.question[language] || currentQuestion.question['en']}
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {currentQuestion.options.map((option, idx) => {
            const optionText = getOptionText(option);
            const isSelected = selection?.qIndex === currentQuestionIndex && getOptionText(selection?.opt as any) === optionText;

            let stateStyles = 'bg-white dark:bg-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white';

            if (isSelected) {
              stateStyles = isCorrect
                ? 'ring-4 ring-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-slate-900 dark:text-white'
                : 'ring-4 ring-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-slate-900 dark:text-white';
            } else if (selection && isCorrectOption(option)) {
              stateStyles = 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300 opacity-70';
            } else if (selection) {
              stateStyles = 'opacity-40 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 grayscale cursor-not-allowed';
            }

            return (
              <button
                key={`${currentQuestionIndex}-${idx}`}
                onClick={(e) => { e.stopPropagation(); handleOptionSelect(option); }}
                disabled={selection !== null}
                className={`
                    relative rounded-xl transition-all duration-200 cursor-pointer min-w-[6rem] p-4 flex items-center justify-center
                    ${stateStyles}
                  `}
              >
                <span className="font-arabic text-3xl font-bold">{optionText}</span>

                {isSelected && isCorrect && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-md animate-bounce-short">
                    <Check size={16} />
                  </div>
                )}
                {isSelected && !isCorrect && (
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md animate-bounce-short">
                    <X size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-16 flex items-center justify-center gap-4">
        {selection ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="bg-brand text-white text-lg font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 animate-in slide-in-from-bottom-2"
          >
            Next <ArrowRight size={24} />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-semibold"
          >
            Cancel Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
