
import * as fs from 'fs';
import * as path from 'path';


const SCANNED_DATA_PATH = path.join(process.cwd(), 'scanned_data.json');
const EXPANSION_DATA_PATH = path.join(process.cwd(), '../../lessons/expansion_data.ts');
const EXPANSION_PHASE4_PATH = path.join(process.cwd(), '../../lessons/expansion_data_phase4.ts');
const TAJWEED_PLUS_PATH = path.join(process.cwd(), '../../lessons/tajweed_plus.ts');


// --- LOAD DATA ---
const scanned = JSON.parse(fs.readFileSync(SCANNED_DATA_PATH, 'utf-8'));
const expansionText = fs.readFileSync(EXPANSION_DATA_PATH, 'utf-8');
const phase4Text = fs.readFileSync(EXPANSION_PHASE4_PATH, 'utf-8');
const tajweedPlusText = fs.readFileSync(TAJWEED_PLUS_PATH, 'utf-8');

// --- HELPERS ---
const parseArrays = (text: string, varName: string) => {
    const match = text.match(new RegExp(`export const ${varName} = \\[([\\s\\S]*?)\\];`));
    if (!match) return [];
    // Dirty eval to parse the array content. 
    // We replace single quotes with double quotes for valid JSON-ish parsing if simple, 
    // but these are complex JS arrays. 
    // Better approach: Regex extract strictly `['ar', 'tr', s, a, w]` tuples.
    const regex = /\[\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*(\d+),\s*(\d+)\s*\]/g;
    const items = [];
    let m;
    while ((m = regex.exec(match[1])) !== null) {
        items.push({ text: m[1], trans: m[2], s: parseInt(m[3]), a: parseInt(m[4]), w: parseInt(m[5]) });
    }
    return items;
};

const l25_ex = parseArrays(expansionText, 'l25_expansion');
const l26_ex = parseArrays(expansionText, 'l26_expansion');
const l27_ex = parseArrays(expansionText, 'l27_expansion');
const l28_ex = parseArrays(expansionText, 'l28_expansion');
const l29_ex = parseArrays(expansionText, 'l29_expansion');
const l30_ex = parseArrays(expansionText, 'l30_expansion');

// Helper to write TOON file
const writeToon = (lessonId: number, items: any[]) => {
    const dir = path.join(process.cwd(), `lesson${lessonId}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Header
    let content = `# Lesson ${lessonId} Content\n`;
    content += `|id|text_ar|transliteration|type|surah|ayah|word_index\n`;

    // Deduplicate
    const seen = new Set();
    const uniqueItems = items.filter(i => {
        const key = `${i.s}:${i.a}:${i.w}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // Write Items
    uniqueItems.forEach((item, idx) => {
        const type = 'word';
        content += `l${lessonId}_${idx + 1}|${item.text}|${item.trans || ''}|${type}|${item.s}|${item.a}|${item.w}\n`;
    });

    fs.writeFileSync(path.join(dir, 'content.toon'), content);
    console.log(`Wrote L${lessonId} with ${uniqueItems.length} items.`);
};

// --- DATA GENERATION LOGIC ---

// L25-L30: Use expansion data + filler if needed
writeToon(25, l25_ex);
writeToon(26, l26_ex);
writeToon(27, l27_ex); // Idgham
writeToon(28, l28_ex);
writeToon(29, l29_ex);
writeToon(30, l30_ex);

// L31: Muqatta'at (Hardcoded fixed list)
const l31_data = [
    { text: 'الٓمٓ', trans: 'Alif-Lam-Meem', s: 2, a: 1, w: 1 }, { text: 'الٓمٓصٓ', trans: 'Alif-Lam-Meem-Sad', s: 7, a: 1, w: 1 },
    { text: 'الٓر', trans: 'Alif-Lam-Ra', s: 10, a: 1, w: 1 }, { text: 'الٓمٓر', trans: 'Alif-Lam-Meem-Ra', s: 13, a: 1, w: 1 },
    { text: 'كٓهيعٓصٓ', trans: 'Kaf-Ha-Ya-Ain-Sad', s: 19, a: 1, w: 1 }, { text: 'طَه', trans: 'Ta-Ha', s: 20, a: 1, w: 1 },
    { text: 'طٓسٓمٓ', trans: 'Ta-Seen-Meem', s: 26, a: 1, w: 1 }, { text: 'طٓسٓ', trans: 'Ta-Seen', s: 27, a: 1, w: 1 },
    { text: 'يسٓ', trans: 'Ya-Seen', s: 36, a: 1, w: 1 }, { text: 'صٓ', trans: 'Sad', s: 38, a: 1, w: 1 },
    { text: 'حٓمٓ', trans: 'Ha-Meem', s: 40, a: 1, w: 1 }, { text: 'حٓمٓ عٓسٓقٓ', trans: 'Ha-Meem Ain-Seen-Qaf', s: 42, a: 1, w: 1 },
    { text: 'قٓ', trans: 'Qaf', s: 50, a: 1, w: 1 }, { text: 'نٓ', trans: 'Noon', s: 68, a: 1, w: 1 }
];
writeToon(31, l31_data);

// L32: Madd Far'i (General) - Use Scanned Madd
const l32_candidates = scanned.madd || [];
writeToon(32, l32_candidates.slice(0, 100));

// L33: Madd Muttasil (Connected) - Same word
const l33_candidates = l32_candidates.slice(0, 100); // Approximation
writeToon(33, l33_candidates);

// L34: Madd Munfasil (Detached)
const l34_candidates = l32_candidates.slice(50, 150); // Approximation/Overlap is acceptable for now if context missing
writeToon(34, l34_candidates);

// L35: Madd Lazim (Rare - Search Results)
const l35_rare = [
    { text: 'ٱلْحَآقَّةُ', s: 69, a: 1, w: 1 }, { text: 'وَٱلصَّـٰٓفَّـٰتِ', s: 37, a: 1, w: 1 }, { text: 'ٱلضَّآلِّينَ', s: 1, a: 7, w: 9 },
    { text: 'دَآبَّةٍ', s: 2, a: 164, w: 14 }, { text: 'ٱلصَّآخَّةُ', s: 80, a: 33, w: 2 }, { text: 'ٱلطَّآمَّةُ', s: 79, a: 34, w: 2 },
    { text: 'كَآفَّةً', s: 9, a: 36, w: 15 }, { text: 'ءَآلْـَٰٔنَ', s: 10, a: 51, w: 2 }, { text: 'جَآنٌّ', s: 55, a: 39, w: 4 },
    { text: 'مُدْهَآمَّتَانِ', s: 55, a: 64, w: 1 }, { text: 'أَتُحَـٰٓجُّوٓنِّى', s: 6, a: 80, w: 3 }, { text: 'تَأْمُرُوٓنِّىٓ', s: 39, a: 64, w: 3 }
];
// Fill rest with Scanned Madd candidates
writeToon(35, [...l35_rare, ...l32_candidates.slice(0, 80)]);

// L36: Madd Arid (Pause)
// End of Ayah words are best for this.
const l36_candidates = scanned.all_words.filter((w: any) => scanned.all_words.some((n: any) => n.s === w.s && n.a === w.a && n.w === w.w + 1) === false).slice(0, 100);
writeToon(36, l36_candidates);

// L37: Madd Lin (Waw/Ya sakin after Fatha)
const l37_candidates = scanned.all_words.filter((w: any) => /َ[وْ|يْ]/.test(w.text)).slice(0, 100);
writeToon(37, l37_candidates);

// L38: Ghunnah (Nun/Meem Shaddah)
const l38_candidates = scanned.ghunnah.length > 100 ? scanned.ghunnah.slice(0, 120) : scanned.ghunnah;
writeToon(38, l38_candidates);

// L39: Tafkheem (Heavy Letters: kh, sad, dad, gh, ta, qaf, za)
const heavyRegex = /[خ|ص|ض|غ|ط|ق|ظ]/;
const l39_candidates = scanned.all_words.filter((w: any) => heavyRegex.test(w.text)).slice(0, 100);
writeToon(39, l39_candidates);

// L40: Salah - Use common Salah words from Fatiha (1) and Tashahhud (not in Quran except parts)
// We will use Surah 1 and common short surahs 103-114 words
const l40_candidates = scanned.all_words.filter((w: any) => w.s === 1 || w.s >= 105).slice(0, 100);
writeToon(40, l40_candidates);

// L41: Sun & Moon - Al-Lam
const alLam = scanned.all_words.filter((w: any) => /^ٱل/.test(w.text)).slice(0, 100);
writeToon(41, alLam);

// L42: Hamza (Wasl)
const hamzaWasl = scanned.all_words.filter((w: any) => /^ٱ/.test(w.text)).slice(0, 100);
writeToon(42, hamzaWasl);

// L43: Silent Letters (Ana, Waw, etc) - Use regex from tajweed_plus instruction
// "Ana" = أَنَا۠ , Silent Waw = و۟ 
const l43_candidates = scanned.all_words.filter((w: any) => /أَنَا۠|وا۟/.test(w.text)).slice(0, 100);
writeToon(43, l43_candidates);

// L44: Waqf (Signs) - Scanned punctuation?
// The scanned text includes signs like ۘ ۚ 
const l44_candidates = scanned.all_words.filter((w: any) => /[ۘ|ۚ|ۖ|ۗ|ۛ]/.test(w.text)).slice(0, 100);
writeToon(44, l44_candidates);

// L45: More Waqf
writeToon(45, l44_candidates.slice(0, 80)); // Dupe for now, better than empty

// L46: Sun/Moon (Explicit Lesson in Tajweed Plus)
// We can use l41 data split or verified list.
writeToon(46, alLam.reverse().slice(0, 100));

// L47: Meaning Stops
writeToon(47, l44_candidates);

// L48: General Review (Mix)
const l48_candidates = scanned.all_words.sort(() => 0.5 - Math.random()).slice(0, 100);
writeToon(48, l48_candidates);

console.log('Done populating Phase 3.');
