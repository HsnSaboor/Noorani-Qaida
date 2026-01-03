
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// --- DATA DEFINITIONS ---

// Lesson 56: Gharib I (Imala & Tasheel)
const l56_raw = [
    { text: "وَقَالَ", ref: "11:41", rule: "Context", translation: "And he said" },
    { text: "ٱرْكَبُواْ", ref: "11:41", rule: "Context", translation: "Embark" },
    { text: "فِيهَا", ref: "11:41", rule: "Context", translation: "In it" },
    { text: "بِسْمِ ٱللَّهِ", ref: "11:41", rule: "Context", translation: "In name of Allah" },
    { text: "مَجْر۪اهَا", ref: "11:41", rule: "SAY: Maj-RAY-ha", translation: "Its course (Imala)" },
    { text: "وَمُرْسَاهَآ", ref: "11:41", rule: "Normal Alif", translation: "Its anchorage" },
    { text: "إِنَّ", ref: "11:41", rule: "Context", translation: "Indeed" },
    { text: "رَبِّي", ref: "11:41", rule: "Context", translation: "My Lord" },
    { text: "لَغَفُورٌ", ref: "11:41", rule: "Context", translation: "Forgiving" },
    { text: "رَّحِيمٌ", ref: "11:41", rule: "Context", translation: "Merciful" },
    { text: "وَلَوْ", ref: "41:44", rule: "Context", translation: "And if" },
    { text: "جَعَلْنَـٰهُ", ref: "41:44", rule: "Context", translation: "We made it" },
    { text: "قُرْءَانًا", ref: "41:44", rule: "Context", translation: "A Quran" },
    { text: "أَعْجَمِيًّا", ref: "41:44", rule: "Context", translation: "Foreign" },
    { text: "لَّقَالُواْ", ref: "41:44", rule: "Context", translation: "They would say" },
    { text: "لَوْلَا", ref: "41:44", rule: "Context", translation: "Why not" },
    { text: "فُصِّلَتْ", ref: "41:44", rule: "Context", translation: "Explained" },
    { text: "ءَايَـٰتُهُۥٓ", ref: "41:44", rule: "Context", translation: "Its verses" },
    { text: "ءَا۬عْجَمِيٌّ", ref: "41:44", rule: "SAY: A-a-jamiyyun", translation: "Foreign (Tasheel)" },
    { text: "وَعَرَبِيٌّ", ref: "41:44", rule: "Context", translation: "And Arab" },
    { text: "ءَأَنذَرْتَهُمْ", ref: "2:6", rule: "Hard Hamza (Normal)", translation: "Whether you warn" },
    { text: "أَأَنتَ", ref: "5:116", rule: "Hard Hamza (Normal)", translation: "Did you?" },
    { text: "أَأَلِدُ", ref: "11:72", rule: "Hard Hamza (Normal)", translation: "Shall I bear child?" },
    { text: "أَأَرْبَابٌ", ref: "12:39", rule: "Hard Hamza (Normal)", translation: "Are lords?" },
    { text: "ءَأَشْفَقْتُمْ", ref: "58:13", rule: "Hard Hamza (Normal)", translation: "Are you afraid?" },
    { text: "ءَأَمِنتُم", ref: "67:16", rule: "Hard Hamza (Normal)", translation: "Are you secure?" },
    { text: "ضُحَىٰهَا", ref: "91:1", rule: "Normal Alif (No Imala)", translation: "Its morning brightness" },
    { text: "تَلَىٰهَا", ref: "91:2", rule: "Normal Alif (No Imala)", translation: "Follows it" },
    { text: "جَلَّىٰهَا", ref: "91:3", rule: "Normal Alif (No Imala)", translation: "Reveals it" },
    { text: "يَغْشَىٰهَا", ref: "91:4", rule: "Normal Alif (No Imala)", translation: "Covers it" }
];

// Lesson 57: Gharib II (Ishmam, Naql, & Sad/Sin)
const l57_raw = [
    { text: "قَالُواْ", ref: "12:11", rule: "Context", translation: "They said" },
    { text: "يَـٰٓأَبَانَا", ref: "12:11", rule: "Context", translation: "O our father" },
    { text: "مَا لَكَ", ref: "12:11", rule: "Context", translation: "What is with you" },
    { text: "لَا", ref: "12:11", rule: "Context", translation: "Do not" },
    { text: "تَأۡمَنَّا", ref: "12:11", rule: "Round Lips on Nun!", translation: "Trust us (Ishmam)" },
    { text: "عَلَىٰ", ref: "12:11", rule: "Context", translation: "With" },
    { text: "يُوسُفَ", ref: "12:11", rule: "Context", translation: "Joseph" },
    { text: "بِئْسَ", ref: "49:11", rule: "Context", translation: "Wretched is" },
    { text: "ٱلِٱسْمُ", ref: "49:11", rule: "The Name", translation: "The name" },
    // "Bi'sa-lismu" is a merged reading, but for TOON we link the individual words if possible, or create a 'manual'
    { text: "بِئْسَ ٱلِٱسْمُ", ref: "49:11", rule: "READ: Bi'sa-lismu", translation: "Wretched is the name" },
    { text: "ٱلۡفُسُوقُ", ref: "49:11", rule: "Context", translation: "Disobedience" },
    { text: "بَعْدَ", ref: "49:11", rule: "Context", translation: "After" },
    { text: "ٱلْإِيمَـٰنِ", ref: "49:11", rule: "Context", translation: "Faith" },
    { text: "يَبْصُطُ", ref: "2:245", rule: "Read as SEEN (Bast)", translation: "Extends" },
    { text: "بَصْطَةً", ref: "7:69", rule: "Read as SEEN (Bast)", translation: "Stature" },
    { text: "ٱلْمُصَيْطِرُونَ", ref: "52:37", rule: "Read Sad OR Seen", translation: "Controllers" },
    { text: "بِمُصَيْطِرٍ", ref: "88:22", rule: "Read as SAD only", translation: "Controller" },
    { text: "ضَعْفٍ", ref: "30:54", rule: "Read Dad with Fatha/Damma", translation: "Weakness" },
    { text: "مِن", ref: "30:54", rule: "Context", translation: "From" },
    { text: "بَعْدِ", ref: "30:54", rule: "Context", translation: "After" },
    { text: "نُون", ref: "68:1", rule: "Izhar (Read Clear Nun)", translation: "Nun" },
    { text: "وَٱلْقَلَمِ", ref: "68:1", rule: "Context", translation: "And the pen" },
    { text: "يس", ref: "36:1", rule: "Izhar (Read Yaseen)", translation: "Ya-Seen" },
    { text: "وَٱلْقُرْءَانِ", ref: "36:2", rule: "Context", translation: "And the Quran" },
    { text: "طسٓ", ref: "27:1", rule: "Idgham (Ta-Seen-Meem)", translation: "Ta-Seen" },
    { text: "الٓمٓ", ref: "2:1", rule: "Idgham (Lam-Meem)", translation: "Alif-Lam-Meem" },
    { text: "قَوَارِيرَاْ", ref: "76:15", rule: "Drop Alif (if continue)", translation: "Crystal clear" },
    { text: "سَلَـٰسِلَاْ", ref: "76:4", rule: "Stop: La or Laa", translation: "Chains" },
    { text: "لَـٰكِنَّا۠", ref: "18:38", rule: "Drop Alif (if continue)", translation: "But He is" },
    { text: "ٱلظُّنُونَا۠", ref: "33:10", rule: "Drop Alif (if continue)", translation: "Assumptions" }
];

// Lesson 58: Advanced Waqf (Rawm & Ishmam)
const l58_raw = [
    { text: "ٱلْعَـٰلَمِينَ", ref: "1:2", rule: "Stop: Sukoon ONLY", translation: "The Worlds" },
    { text: "ٱلْمُسْتَقِيمَ", ref: "1:6", rule: "Stop: Sukoon ONLY", translation: "The Straight" },
    { text: "ٱلْفَلَقِ", ref: "113:1", rule: "Stop: Qalqala ONLY", translation: "Daybreak" },
    { text: "حَسَدَ", ref: "113:5", rule: "Stop: Qalqala ONLY", translation: "Envies" },
    { text: "أَبَدًا", ref: "4:57", rule: "Stop: Alif (Abada)", translation: "Forever" },
    { text: "وَكِيلًا", ref: "4:81", rule: "Stop: Alif (Wakila)", translation: "Guardian" },
    { text: "غَفُورًا", ref: "4:96", rule: "Stop: Alif (Ghafura)", translation: "Forgiving" },
    { text: "رَحِيمًا", ref: "4:96", rule: "Stop: Alif (Rahima)", translation: "Merciful" },
    { text: "خَافِيَةٌ", ref: "69:18", rule: "Stop: Ha (Khafiyah)", translation: "Secret" },
    { text: "رَاضِيَةٌ", ref: "69:21", rule: "Stop: Ha (Radiyah)", translation: "Pleasant" },
    { text: "ٱلرَّحِيمِ", ref: "1:1", rule: "Sukoon OR Rawm", translation: "The Merciful" },
    { text: "ٱلدِّينِ", ref: "1:4", rule: "Sukoon OR Rawm", translation: "Judgment" },
    { text: "ٱلْفَجْرِ", ref: "89:1", rule: "Sukoon OR Rawm", translation: "The Dawn" },
    { text: "وَلَيَالٍ", ref: "89:2", rule: "Sukoon OR Rawm", translation: "Nights" },
    { text: "وَٱلْوَتْرِ", ref: "89:3", rule: "Sukoon OR Rawm", translation: "The Odd" },
    { text: "حِجْرٍ", ref: "89:5", rule: "Sukoon OR Rawm", translation: "Rational" },
    { text: "بِٱلْوَادِ", ref: "89:9", rule: "Sukoon OR Rawm", translation: "The Valley" },
    { text: "فَسَادًا", ref: "89:12", rule: "No Rawm (Fatha)", translation: "Corruption" },
    { text: "وَثَاقَهُۥ", ref: "89:26", rule: "Sukoon OR Rawm", translation: "His binding" },
    { text: "رَاضِيَةً", ref: "89:28", rule: "No Rawm (Ta Marbuta)", translation: "Well-pleased" },
    { text: "نَسْتَعِينُ", ref: "1:5", rule: "Sukoon, Rawm, Ishmam", translation: "We ask help" },
    { text: "أَحَدٌ", ref: "112:1", rule: "Sukoon, Rawm, Ishmam", translation: "One" },
    { text: "ٱلصَّمَدُ", ref: "112:2", rule: "Sukoon, Rawm, Ishmam", translation: "Eternal" },
    { text: "كُفُوًا", ref: "112:4", rule: "No Rawm (Fatha)", translation: "Equivalent" },
    { text: "حَقٌّ", ref: "51:19", rule: "Sukoon, Rawm, Ishmam", translation: "Right" },
    { text: "مَعْلُومٌ", ref: "51:19", rule: "Sukoon, Rawm, Ishmam", translation: "Known" },
    { text: "ٱلذِّكْرَىٰ", ref: "51:55", rule: "No Rawm (Alif)", translation: "Reminder" },
    { text: "ٱلْمَتِينُ", ref: "51:58", rule: "Sukoon, Rawm, Ishmam", translation: "The Firm" },
    { text: "كَأَمْثَالِ", ref: "56:23", rule: "Sukoon OR Rawm", translation: "Like likenesses" },
    { text: "ٱللُّؤْلُؤِ", ref: "56:23", rule: "Sukoon OR Rawm", translation: "Pearls" },
    { text: "ٱلْمَكْنُونِ", ref: "56:23", rule: "Sukoon OR Rawm", translation: "Hidden" },
    { text: "يَعْلَمُ", ref: "2:255", rule: "Sukoon, Rawm, Ishmam", translation: "He knows" },
    { text: "وَٱللَّهُ", ref: "2:282", rule: "Sukoon, Rawm, Ishmam", translation: "And Allah" },
    { text: "شَهَادَةً", ref: "2:283", rule: "No Rawm (Ta Marbuta)", translation: "Testimony" },
    { text: "أَثِمٌ", ref: "2:283", rule: "Sukoon, Rawm, Ishmam", translation: "Sinful" }
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
    await processItems(l56_raw, 'l56');
    await processItems(l57_raw, 'l57');
    await processItems(l58_raw, 'l58');
};

runAll();
