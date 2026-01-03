
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// --- DATA DEFINITIONS ---

// Lesson 59: The Khatam
const l59_raw = [
    { text: "بِسۡمِ ٱللَّهِ", ref: "1:1", rule: "Tarqeeq (Light Lam)", translation: "In the name of Allah" },
    { text: "ٱلرَّحۡمَـٰنِ", ref: "1:1", rule: "Idgham Shamsi + Madd", translation: "The Entirely Merciful" },
    { text: "ٱلرَّحِيمِ", ref: "1:1", rule: "Madd Arid (2/4/6)", translation: "The Especially Merciful" },
    { text: "ٱلۡحَمۡدُ", ref: "1:2", rule: "Izhar Qamari", translation: "All Praise" },
    { text: "لِلَّهِ", ref: "1:2", rule: "Tarqeeq (Light Lam)", translation: "To Allah" },
    { text: "رَبِّ", ref: "1:2", rule: "Tafkheem (Heavy Ra)", translation: "Lord" },
    { text: "ٱلۡعَـٰلَمِينَ", ref: "1:2", rule: "Madd Arid (Stop)", translation: "Of the worlds" },
    { text: "ٱلرَّحۡمَـٰنِ", ref: "1:3", rule: "Hams (Ha)", translation: "The Entirely Merciful" },
    { text: "ٱلرَّحِيمِ", ref: "1:3", rule: "Madd Arid", translation: "The Especially Merciful" },
    { text: "مَـٰلِكِ", ref: "1:4", rule: "Madd Asli (2 counts)", translation: "Master" },
    { text: "يَوۡمِ", ref: "1:4", rule: "Leen (Waw)", translation: "Day" },
    { text: "ٱلدِّينِ", ref: "1:4", rule: "Madd Arid", translation: "Of Judgment" },
    { text: "إِيَّاكَ", ref: "1:5", rule: "Nabara (Press Ya)", translation: "You alone" },
    { text: "نَعۡبُدُ", ref: "1:5", rule: "Ain from throat", translation: "We worship" },
    { text: "وَإِيَّاكَ", ref: "1:5", rule: "Nabara (Press Ya)", translation: "And You alone" },
    { text: "نَسۡتَعِينُ", ref: "1:5", rule: "Madd Arid + Ishmam", translation: "We ask for help" },
    { text: "ٱهۡدِنَا", ref: "1:6", rule: "Hams (Ha)", translation: "Guide us" },
    { text: "ٱلصِّرَٰطَ", ref: "1:6", rule: "Tafkheem (Sad, Ra, Ta)", translation: "The Path" },
    { text: "ٱلۡمُسۡتَقِيمَ", ref: "1:6", rule: "Qalqala (Qaf)", translation: "The Straight" },
    { text: "صِرَٰطَ", ref: "1:7", rule: "Tafkheem", translation: "Path of" },
    { text: "ٱلَّذِينَ", ref: "1:7", rule: "Madd Asli", translation: "Those who" },
    { text: "أَنۡعَمۡتَ", ref: "1:7", rule: "Izhar (Nun)", translation: "You bestowed favor" },
    { text: "عَلَيۡهِمۡ", ref: "1:7", rule: "Leen (Ya)", translation: "Upon them" },
    { text: "غَيۡرِ", ref: "1:7", rule: "Leen + Heavy Ghain", translation: "Not of" },
    { text: "ٱلۡمَغۡضُوبِ", ref: "1:7", rule: "Heavy Ghain/Dad", translation: "Those evoking anger" },
    { text: "عَلَيۡهِمۡ", ref: "1:7", rule: "Izhar Shafawi", translation: "On them" },
    { text: "وَلَا", ref: "1:7", rule: "Madd Asli", translation: "And not" },
    { text: "ٱلضَّآلِّينَ", ref: "1:7", rule: "MADD LAZIM (6 Counts)", translation: "Those astray" },
    { text: "الٓمٓ", ref: "2:1", rule: "Madd Lazim Harfi (6+6)", translation: "Alif-Lam-Meem" },
    { text: "ذَٰلِكَ", ref: "2:2", rule: "Madd Asli", translation: "That" },
    { text: "ٱلۡكِتَـٰبُ", ref: "2:2", rule: "Madd Asli", translation: "Book" },
    { text: "لَا", ref: "2:2", rule: "Madd Asli", translation: "No" },
    { text: "رَيۡبَۛ", ref: "2:2", rule: "Leen + Stop Preference", translation: "Doubt" },
    { text: "فِيهِۛ", ref: "2:2", rule: "Madd Asli", translation: "In it" },
    { text: "هُدًى", ref: "2:2", rule: "Idgham (Tanween->Lam)", translation: "Guidance" },
    { text: "لِّلۡمُتَّقِينَ", ref: "2:2", rule: "Madd Arid", translation: "For the God-fearing" },
    { text: "ٱلَّذِينَ", ref: "2:3", rule: "Madd Asli", translation: "Those who" },
    { text: "يُؤۡمِنُونَ", ref: "2:3", rule: "Hamza Stop", translation: "Believe" },
    { text: "بِٱلۡغَيۡبِ", ref: "2:3", rule: "Leen (Ya)", translation: "In the Unseen" },
    { text: "وَيُقِيمُونَ", ref: "2:3", rule: "Madd Asli", translation: "And establish" },
    { text: "ٱلصَّلَوٰةَ", ref: "2:3", rule: "Heavy Lam", translation: "Prayer" },
    { text: "وَمِمَّا", ref: "2:3", rule: "Ghunnah (Meem)", translation: "And from what" },
    { text: "رَزَقۡنَـٰهُمۡ", ref: "2:3", rule: "Qalqala (Qaf)", translation: "We provided them" },
    { text: "يُنفِقُونَ", ref: "2:3", rule: "Ikhfa (Nun)", translation: "They spend" },
    { text: "أُوْلَـٰٓئِكَ", ref: "2:5", rule: "Madd Muttasil (4)", translation: "Those" },
    { text: "عَلَىٰ", ref: "2:5", rule: "Madd Asli", translation: "Upon" },
    { text: "هُدًى", ref: "2:5", rule: "Idgham (Tanween->Meem)", translation: "Guidance" },
    { text: "مِّن", ref: "2:5", rule: "Idgham (Nun->Ra)", translation: "From" },
    { text: "رَّبِّهِمۡ", ref: "2:5", rule: "Heavy Ra", translation: "Their Lord" },
    { text: "وَأُوْلَـٰٓئِكَ", ref: "2:5", rule: "Madd Muttasil", translation: "And those" },
    { text: "هُمُ", ref: "2:5", rule: "Izhar", translation: "They are" },
    { text: "ٱلۡمُفۡلِحُونَ", ref: "2:5", rule: "Hams (Fa) + Madd Arid", translation: "The Successful" }
];


// Function to normalize Arabic text
const normalize = (text: string) => text.replace(/[^\u0600-\u06FF]/g, '');

interface ResultItem {
    s: number;
    a: number;
    w: number;
    text: string;
    status: string;
}

// Helper to fetch and resolve items
const processItems = async (items: any[], lessonId: string) => {
    console.log(`Processing ${lessonId} with ${items.length} items...`);
    const results: ResultItem[] = [];

    for (const item of items) {
        if (!item.ref.includes(':')) {
            results.push({ ...item, s: 0, a: 0, w: 0, status: 'manual' });
            continue;
        }

        const parts = item.ref.split(' ')[0].split(':');
        const surah = parseInt(parts[0]);
        const ayah = parseInt(parts[1]);

        const url = `http://api.alquran.cloud/v1/ayah/${surah}:${ayah}`;

        try {
            await new Promise(resolve => setTimeout(resolve, 150));
            const cmd = `curl -s --compressed "${url}"`;

            const jsonStr = await new Promise<string>((resolve, reject) => {
                exec(cmd, (err, stdout, stderr) => {
                    if (err) reject(err);
                    else resolve(stdout);
                });
            });

            let data;
            try {
                data = JSON.parse(jsonStr);
            } catch (jsonErr) {
                console.error(`JSON Parse Error for ${item.ref}`, jsonErr);
                results.push({ ...item, s: surah, a: ayah, w: 1, status: 'parse_error' });
                continue;
            }

            if (data.code !== 200) {
                console.error(`API Error for ${item.ref}: ${data.status}`);
                results.push({ ...item, s: surah, a: ayah, w: 1, status: 'fetch_error' });
                continue;
            }

            const ayahText: string = data.data.text;
            const words = ayahText.split(/\s+/);

            let idx = -1;

            // 1. Exact Match
            idx = words.findIndex((w: string) => w.includes(item.text) || item.text.includes(w));

            // 2. Normalized Match
            if (idx === -1) {
                const normTarget = normalize(item.text);
                const normWords = words.map((w: string) => normalize(w));
                idx = normWords.indexOf(normTarget);
            }

            if (idx !== -1) {
                results.push({ ...item, s: surah, a: ayah, w: idx + 1, status: 'ok' });
            } else {
                console.warn(`${lessonId}: Word not found in ${item.ref}: ${item.text}`);
                results.push({ ...item, s: surah, a: ayah, w: 1, status: 'not_found' });
            }

        } catch (e) {
            console.error(`Exception for ${item.ref}`, e);
            results.push({ ...item, s: surah, a: ayah, w: 1, status: 'error' });
        }
    }

    // Write Output
    let output = `# Lesson ${lessonId.replace('l', '')} Content\n|id|text_ar|transliteration|type|surah|ayah|word_index\n`;
    results.forEach((r, i) => {
        // Special handling for manual items
        if (r.status === 'manual') {
            output += `${lessonId}_${i + 1}|${r.text}||word|0|0|0\n`;
        } else {
            output += `${lessonId}_${i + 1}|${r.text}||word|${r.s}|${r.a}|${r.w}\n`;
        }
    });

    const outPath = path.join(process.cwd(), `lesson${lessonId.replace('l', '')}/content.toon`);
    if (!fs.existsSync(path.dirname(outPath))) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
    }
    fs.writeFileSync(outPath, output);
    console.log(`Written ${outPath}`);
};

const runAll = async () => {
    await processItems(l59_raw, 'l59');
};

runAll();
