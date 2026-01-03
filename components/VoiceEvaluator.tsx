
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Check, Loader2, Play, Square, RefreshCcw, AlertCircle, BarChart2, Sparkles, X, MicOff, Lightbulb } from 'lucide-react';
import { normalizeArabic, getSimilarity, playSuccessSound, playErrorSound, initAudio } from '../data/utils';

interface VoiceEvaluatorProps {
  targetText: string;
  onSuccess: () => void;
  language: 'en' | 'ur' | string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Map of common articulation errors
const PHONETIC_TIPS: Record<string, { substitute: string[], tip: { en: string, ur: string, hi: string, es: string } }> = {
    'ق': { 
        substitute: ['ك', 'k'], 
        tip: { 
            en: "Make the 'Q' sound deep from the back of your throat, not like 'K'.", 
            ur: "'ق' کو حلق کی جڑ سے موٹا کر کے پڑھیں، 'ک' کی طرح نہیں۔", 
            hi: "'क़' की आवाज़ गले के पिछले हिस्से से निकालें, 'क' की तरह नहीं।",
            es: "Haz el sonido 'Q' profundo desde la parte posterior de la garganta, no como 'K'."
        } 
    },
    'ح': { 
        substitute: ['ه', 'ہ', 'h'], 
        tip: { 
            en: "Sharpen the 'Ha'. It comes from the middle of the throat, distinct from 'H'.", 
            ur: "'ح' کو وسط حلق سے نکالیں، یہ 'ہ' سے مختلف ہے۔", 
            hi: "'ह' को तेज़ करें। यह गले के बीच से आता है।",
            es: "Agudiza la 'Ha'. Viene del medio de la garganta, distinta de la 'H'."
        } 
    },
    'ع': { 
        substitute: ['ا', 'أ', 'a'], 
        tip: { 
            en: "Squeeze your throat for 'Ain. Don't just say 'Alif'.", 
            ur: "'ع' کے لیے حلق کو دبائیں، صرف الف نہ پڑھیں۔", 
            hi: "'ऐन' के लिए गले को दबाएं। सिर्फ 'अलिफ़' न कहें।",
            es: "Aprieta la garganta para 'Ain. No digas simplemente 'Alif'."
        } 
    },
    'ص': { 
        substitute: ['س', 's'], 
        tip: { 
            en: "Make the 'S' sound heavy and full (Saad), not light like Seen.", 
            ur: "'ص' کو موٹا اور پُر پڑھیں، سین کی طرح باریک نہیں۔", 
            hi: "'साद' की आवाज़ भारी और पूरी निकालें, 'सीन' की तरह हल्की नहीं।",
            es: "Haz el sonido 'S' pesado y lleno (Saad), no ligero como Seen."
        } 
    },
    'ض': { 
        substitute: ['د', 'd', 'z'], 
        tip: { 
            en: "Use the side of your tongue for Dad, it is heavy.", 
            ur: "'ض' کے لیے زبان کی کروٹ استعمال کریں، یہ موٹا حرف ہے۔", 
            hi: "'ज़ाद' के लिए अपनी जीभ के किनारे का उपयोग करें, यह भारी है।",
            es: "Usa el lado de la lengua para Dad, es pesado."
        } 
    },
    'ط': { 
        substitute: ['ت', 't'], 
        tip: { 
            en: "Make the 'T' sound heavy (Ta), stronger than normal Ta.", 
            ur: "'ط' کو موٹا پڑھیں، عام 'ت' سے مختلف۔", 
            hi: "'त' की आवाज़ भारी निकालें, सामान्य 'त' से मज़बूत।",
            es: "Haz el sonido 'T' pesado (Ta), más fuerte que la Ta normal."
        } 
    },
    'ظ': { 
        substitute: ['ز', 'ذ', 'z'], 
        tip: { 
            en: "Tip of tongue touching upper teeth, keep it heavy.", 
            ur: "زبان کی نوک اوپر کے دانتوں سے لگائیں اور موٹا پڑھیں۔", 
            hi: "जीभ की नोक को ऊपर के दांतों से छुएं और इसे भारी रखें।",
            es: "Punta de la lengua tocando los dientes superiores, mantenla pesada."
        } 
    },
    'ث': { 
        substitute: ['س', 's'], 
        tip: { 
            en: "Soft sound: Tip of tongue touching edge of upper teeth.", 
            ur: "نرم آواز: زبان کی نوک اوپر کے دانتوں کے کنارے سے لگائین۔", 
            hi: "नरम आवाज़: जीभ की नोक ऊपर के दांतों के किनारे को छुए।",
            es: "Sonido suave: Punta de la lengua tocando el borde de los dientes superiores."
        } 
    },
    'ذ': { 
        substitute: ['ز', 'z'], 
        tip: { 
            en: "Soft sound: Tip of tongue under upper teeth. Don't whistle.", 
            ur: "نرم آواز: سیٹی کی آواز نہیں آنی چاہیے۔", 
            hi: "नरम आवाज़: जीभ की नोक ऊपर के दांतों के नीचे। सीटी न बजाएं।",
            es: "Sonido suave: Punta de la lengua debajo de los dientes superiores. No silbes."
        } 
    }
};

const VoiceEvaluator: React.FC<VoiceEvaluatorProps> = ({ targetText, onSuccess, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'recording' | 'processing' | 'success' | 'error' | 'unsupported'>('idle');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [heardText, setHeardText] = useState<string>("");
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [specificHint, setSpecificHint] = useState<string | null>(null);
  
  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        setFeedback('unsupported');
        return;
    }

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'ar-SA';
      recognition.interimResults = true; // Enable real-time feedback
      recognition.maxAlternatives = 10;

      recognition.onstart = () => {
          setIsListening(true);
          setFeedback('recording');
          setSpecificHint(null);
      };

      recognition.onresult = (event: any) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        
        // Always update heard text for real-time feedback
        setHeardText(transcript);

        if (!result.isFinal) {
            return;
        }

        setFeedback('processing');
        let bestMatchScore = 0;
        let bestMatchText = "";
        
        const cleanTarget = normalizeArabic(targetText);

        // Iterate through all alternatives to find the best match
        for (let i = 0; i < result.length; i++) {
          const spokenText = result[i].transcript.trim();
          const cleanSpoken = normalizeArabic(spokenText);
          const score = getSimilarity(cleanTarget, cleanSpoken);
          
          if (score > bestMatchScore) {
            bestMatchScore = score;
            bestMatchText = spokenText;
          }
        }
        
        // Fallback: If no good match found in alternatives, check if the raw text contains the target or vice versa
        if (bestMatchScore < 0.6) {
             const spokenRaw = transcript.trim();
             const cleanSpokenRaw = normalizeArabic(spokenRaw);
             if (cleanSpokenRaw.includes(cleanTarget) || cleanTarget.includes(cleanSpokenRaw)) {
                 bestMatchScore = 0.8;
                 bestMatchText = spokenRaw;
             }
        }
        
        setHeardText(bestMatchText || transcript);
        setSimilarityScore(Math.round(bestMatchScore * 100));

        // Threshold: 0.60 (60% match is lenient for kids)
        if (bestMatchScore >= 0.60) {
          setFeedback('success');
          setSpecificHint(null);
          setShowConfetti(true);
          playSuccessSound();
          setTimeout(() => {
              setShowConfetti(false);
              onSuccess();
          }, 2000);
        } else {
          setFeedback('error');
          playErrorSound();
          generateSpecificFeedback(cleanTarget, normalizeArabic(bestMatchText || transcript));
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech error", e.error);
        if (e.error === 'no-speech') {
            setHeardText("No speech detected");
        } else if (e.error === 'not-allowed') {
            setHeardText("Access denied");
        } else {
            setHeardText("Try again");
        }
        setFeedback('error');
        setSimilarityScore(0);
        playErrorSound();
        setIsListening(false);
      };
      
      recognition.onend = () => {
          setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [targetText, onSuccess]);

  const generateSpecificFeedback = (target: string, spoken: string) => {
      // Analyze the target text for difficult letters
      for (const char of target) {
          const rule = PHONETIC_TIPS[char];
          if (rule) {
              // If the spoken text does NOT contain the correct char
              if (!spoken.includes(char)) {
                  // And check if it contains the common mistake substitute
                  const hasMistake = rule.substitute.some(sub => spoken.includes(sub));
                  if (hasMistake || spoken.length > 0) {
                      // Use correct language hint
                      let hint = rule.tip.en;
                      if (language === 'ur') hint = rule.tip.ur;
                      if (language === 'hi') hint = rule.tip.hi;
                      if (language === 'es') hint = rule.tip.es;
                      setSpecificHint(hint);
                      return; // Just show one hint at a time
                  }
              }
          }
      }
      setSpecificHint(null);
  };

  const startRecording = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (feedback === 'unsupported') return;

    initAudio(); // Initialize audio context on user interaction
    setFeedback('recording');
    setHeardText("");
    setSimilarityScore(0);
    setShowConfetti(false);
    setSpecificHint(null);
    
    // 1. Start Speech Recognition
    if (recognitionRef.current) {
        try {
            recognitionRef.current.start();
        } catch(e) { 
            console.error("Rec start error", e); 
            // If already started, stop and restart
            recognitionRef.current.stop();
            setTimeout(() => recognitionRef.current.start(), 200);
        }
    }
    
    // 2. Start Media Recorder for playback
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordedAudio(audioUrl);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
    } catch (err) {
        console.error("Mic access denied", err);
        // Even if media recorder fails (playback), we might still be able to use recognition
    }
  };

  const stopRecording = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
      }
      setIsListening(false);
  };

  const togglePlayback = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!recordedAudio) return;

      if (isPlayingRecorded) {
          recordedAudioRef.current?.pause();
          setIsPlayingRecorded(false);
      } else {
          if (!recordedAudioRef.current) recordedAudioRef.current = new Audio(recordedAudio);
          else recordedAudioRef.current.src = recordedAudio;
          
          recordedAudioRef.current.onended = () => setIsPlayingRecorded(false);
          recordedAudioRef.current.play();
          setIsPlayingRecorded(true);
      }
  };

  const getLabel = () => {
      if (language === 'ur') return 'آواز ٹیسٹ';
      if (language === 'bn') return 'কণ্ঠ পরীক্ষা';
      if (language === 'tr') return 'Ses Kontrolü';
      if (language === 'ru') return 'Проверка голоса';
      if (language === 'hi') return 'आवाज़ चेक';
      if (language === 'es') return 'Prueba de Voz';
      return 'Voice Check';
  };

  if (feedback === 'unsupported') {
      return (
          <div className="flex flex-col items-center gap-2 mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400">
              <MicOff size={24} />
              <p className="text-xs text-center font-bold">Voice features not supported on this browser.<br/>Try Chrome or Edge.</p>
          </div>
      );
  }

  return (
    <div 
        className={`
            relative flex flex-col items-center gap-3 mt-6 w-full max-w-xs mx-auto 
            p-5 rounded-[2rem] border-2 shadow-sm transition-all duration-500 overflow-hidden
            ${feedback === 'success' 
                ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 scale-105 ring-4 ring-green-100 dark:ring-green-900' 
                : (feedback === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900' : 'bg-slate-50/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700')
            }
        `}
        onClick={(e) => e.stopPropagation()} 
    >
      {/* Confetti Animation Layer */}
      {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
              <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-blob top-10 left-10"></div>
              <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-blob top-10 right-10 animation-delay-200"></div>
              <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-blob bottom-10 left-20 animation-delay-500"></div>
              <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-blob bottom-20 right-20 animation-delay-100"></div>
          </div>
      )}

      {/* Header / Score */}
      <div className="flex items-center justify-between w-full px-2 z-10">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Mic size={10} /> {getLabel()}
          </div>
          {similarityScore > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  similarityScore >= 60 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
              }`}>
                  {similarityScore >= 60 ? <Sparkles size={8} /> : null}
                  {similarityScore}% Match
              </span>
          )}
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-4 relative z-10">
          {/* Visualizer / Pulse Effect */}
          {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                  <div className="w-20 h-20 bg-brand rounded-full animate-ping"></div>
                  <div className="w-16 h-16 bg-brand rounded-full animate-pulse absolute"></div>
              </div>
          )}

          {/* Playback Button (Left) */}
          <button
            onClick={togglePlayback}
            disabled={!recordedAudio || isListening}
            className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${!recordedAudio ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}
                ${isPlayingRecorded ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 shadow-sm hover:shadow-md'}
            `}
          >
             {isPlayingRecorded ? <Square size={14} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>

          {/* Record Button (Center) */}
          <button
            onClick={isListening ? stopRecording : startRecording}
            className={`
              flex items-center justify-center w-16 h-16 rounded-full transition-all shadow-lg z-10
              ${isListening 
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100 dark:ring-red-900/50 scale-110' 
                  : 'bg-gradient-to-br from-brand to-brand-dark text-white hover:scale-105 active:scale-95 shadow-brand/30'}
              ${feedback === 'success' ? 'from-green-500 to-green-600 ring-4 ring-green-100 dark:ring-green-900/50 scale-110' : ''}
            `}
          >
            {isListening ? <Square size={24} fill="currentColor" /> : <Mic size={28} />}
          </button>

          {/* Status Icon (Right) */}
          <div className="w-10 h-10 flex items-center justify-center">
             {feedback === 'processing' && <Loader2 size={20} className="animate-spin text-brand" />}
             {feedback === 'success' && <Check size={28} className="text-green-600 dark:text-green-400 animate-bounce-short stroke-[3px]" />}
             {feedback === 'error' && <RefreshCcw size={20} className="text-orange-400 hover:text-orange-500 cursor-pointer transition-colors" onClick={startRecording} />}
          </div>
      </div>

      {/* Feedback Text Area */}
      <div className="text-center min-h-[2rem] w-full z-10 flex flex-col items-center justify-center">
        <div className="text-sm font-bold truncate px-2 transition-all">
            {feedback === 'recording' && <span className="text-red-500 animate-pulse">Listening...</span>}
            {feedback === 'processing' && <span className="text-brand flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Analyzing...</span>}
            {feedback === 'success' && <span className="text-green-600 dark:text-green-400 flex items-center gap-1">Excellent! <Sparkles size={14}/></span>}
            {feedback === 'error' && <span className="text-orange-500 dark:text-orange-400">Try Again</span>}
            {feedback === 'idle' && !recordedAudio && <span className="text-slate-400 dark:text-slate-500 text-xs">Tap mic to pronounce</span>}
        </div>
        
        {/* Specific Phonetic Hint */}
        {feedback === 'error' && specificHint && (
            <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-semibold p-3 rounded-xl border border-yellow-200 dark:border-yellow-700/50 flex items-start gap-2 text-left animate-in slide-in-from-bottom-2">
                <Lightbulb size={16} className="flex-shrink-0 mt-0.5" />
                <span>{specificHint}</span>
            </div>
        )}

        {/* Heard Text Feedback (Visible Effect) */}
        {heardText && !specificHint && (
            <div className={`
                mt-2 px-3 py-1.5 rounded-lg text-xs font-bold font-arabic max-w-full truncate border transition-all duration-300
                ${feedback === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                    : feedback === 'error'
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }
            `}>
                {feedback === 'recording' ? 'Hearing: ' : 'You said: '} "{heardText}"
            </div>
        )}
      </div>
    </div>
  );
};

export default VoiceEvaluator;
