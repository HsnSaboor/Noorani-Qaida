
import { LessonItem } from '../types';

// Audio Base Paths
export const AUDIO_BASE = "/audio";
// Quran.com WBW Audio (Wisam Sharieff is the standard for WBW)
// Format: {surah_id_3digits}_{ayah_id_3digits}_{word_id_3digits}.mp3
export const QURAN_WBW_BASE = "https://audio.qurancdn.com/wbw"; 

export const mkAudio = (lesson: number, name: string) => `${AUDIO_BASE}/lesson${lesson}/${name}.mp3`;

export const mkQuranAudio = (surah: number, ayah: number, reciterId?: string) => {
    const s = surah.toString().padStart(3, '0');
    const a = ayah.toString().padStart(3, '0');
    // Default to Alafasy if no reciter provided, but allow override
    const reciter = reciterId || 'Alafasy_128kbps';
    return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
};

// Generate Word-by-Word Audio URL (Surah_Ayah_WordID.mp3)
// e.g. 001_001_001.mp3
export const mkWBWAudio = (surah: number, ayah: number, word: number) => {
    const s = String(surah).padStart(3, '0');
    const a = String(ayah).padStart(3, '0');
    const w = String(word).padStart(3, '0');
    return `${QURAN_WBW_BASE}/${s}_${a}_${w}.mp3`;
};

// Helper to normalize Arabic text
export const normalizeArabic = (text: string): string => {
    if (!text) return "";
    let normalized = text.normalize("NFKC");
    
    // Remove Tashkeel (Diacritics) - Extended range for Quranic marks
    normalized = normalized.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u06E5\u06E6\u06E2\u06E0\u06E1\u06E3\u06E4\u06E8\u06EA\u06EB\u06EC\u06ED\u06E7\u06E9]/g, '');
    
    // Normalize Alef variants to bare Alif
    normalized = normalized.replace(/[أإآٱ]/g, 'ا');
    
    // Normalize Ta Marbuta to Ha
    normalized = normalized.replace(/ة/g, 'ه');
    
    // Normalize Ya variants
    normalized = normalized.replace(/[ىيئ]/g, 'ي');
    
    // Normalize Kaf variants
    normalized = normalized.replace(/[كڪ]/g, 'ك');

    // Normalize He variants
    normalized = normalized.replace(/[هہ]/g, 'ه');

    return normalized.trim();
};

// Levenshtein Distance for Fuzzy Matching
export const getSimilarity = (s1: string, s2: string): number => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
}

function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export const mapRawItems = (lessonId: number, type: string, rawData: [string, string][], startIndex = 0): LessonItem[] => {
    return rawData.map(([ar, en], idx) => ({
        id: `l${lessonId}_${startIndex + idx}`,
        type,
        text_ar: ar,
        transliteration: en,
        // Default to local audio if no specific mapping logic is applied
        audio: { main: mkAudio(lessonId, `word_${startIndex + idx}`) },
        words: [{
            text: ar,
            audio: mkAudio(lessonId, `word_${startIndex + idx}`),
            transliteration: en
        }]
    }));
};

// Sound Synthesis Utilities
let audioCtx: AudioContext | null = null;

export const initAudio = () => {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.warn("Audio resume failed", e));
    }
    return audioCtx;
};

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number, vol: number = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
};

export const playSuccessSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Success Chime
    createOscillator(ctx, 'sine', 523.25, now, 0.6, 0.2);       
    createOscillator(ctx, 'sine', 659.25, now + 0.1, 0.6, 0.2); 
    createOscillator(ctx, 'sine', 783.99, now + 0.2, 0.6, 0.2); 
    createOscillator(ctx, 'sine', 1046.50, now + 0.3, 0.8, 0.1); 
};

export const playErrorSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Error Buzz
    createOscillator(ctx, 'sawtooth', 150, now, 0.3, 0.1);
    createOscillator(ctx, 'sawtooth', 100, now + 0.1, 0.3, 0.1);
};
