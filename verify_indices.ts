
import { file, write } from 'bun';

// Phrases to find (Rabbana + Baqarah)
// We need the entire verse usually.
// Strategy: Search for "Rabbana" and get a list of verses?
// Or search for specific Rabbana verses known (e.g. Rabbana atina fid-dunya).

// List of common Rabbana Duas (Text snippet to search):
const rabbanas = [
    { t: 'رَبَّنَا آتِنَا فِي الدُّنْيَا', tr: 'Rabbana Atina (2:201)' },
    { t: 'رَبَّنَا لَا تُؤَاخِذْنَا', tr: 'Rabbana La Tu-akhidhna (2:286)' },
    { t: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا', tr: 'Rabbana La Tuzigh Qulubana (3:8)' },
    { t: 'رَبَّنَا إِنَّنَا آمَنَّا', tr: 'Rabbana Innana Amanna (3:16)' },
    { t: 'رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ', tr: 'Rabbana Amanna Bima Anzalta (3:53)' },
    { t: 'رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ', tr: 'Rabbana Innaka Man Tudkhil (3:192)' },
    { t: 'رَبَّنَا ظَلَمْنَا', tr: 'Rabbana Zalamna (7:23)' },
    { t: 'رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ', tr: 'Rabbana La Taj-alna (7:47)' },
    { t: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا', tr: 'Rabbana Afrigh Alayna (7:126)' },
    { t: 'رَبَّنَا تَقَبَّلْ مِنَّا', tr: 'Rabbana Taqabbal Minna (2:127)' },
    { t: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا', tr: 'Rabbana Hab Lana (25:74)' },
    { t: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ', tr: 'Rabbana Ghfir Li (14:41)' },
    { t: 'رَبَّنَا آتِنَا مِن لَّدُنكَ', tr: 'Rabbana Atina Min Ladunka (18:10)' },
    { t: 'رَبَّنَا اصْرِفْ عَنَّا', tr: 'Rabbana Isrif Anna (25:65)' },
    { t: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ', tr: 'Rabbi Jalni Muqimas-Salati (14:40)' },
    { t: 'رَبِّ زِدْنِي عِلْمًا', tr: 'Rabbi Zidni Ilma (20:114)' },
    { t: 'رَبِّ اشْرَحْ لِي صَدْرِي', tr: 'Rabbi Ishrah Li Sadri (20:25)' },
    { t: 'آمَنَ الرَّسُولُ', tr: 'Amanar Rasul (2:285)' },
    { t: 'لَا يُكَلِّفُ اللَّهُ', tr: 'La Yukallifu (2:286)' }
];

async function fetchVerseWords(s: number, a: number) {
    const url = `https://api.quran.com/api/v4/verses/by_key/${s}:${a}?language=en&words=true`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.verse.words;
    } catch (e) {
        return null;
    }
}

async function searchAndGetInfo(item: { t: string, tr: string }) {
    const query = item.t;
    // Search first
    const searchUrl = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=1&language=en`;

    try {
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.search || !searchData.search.results || searchData.search.results.length === 0) {
            console.log(`// FAIL: ${item.tr} - No search results.`);
            return;
        }

        const result = searchData.search.results[0];
        const verseKey = result.verse_key; // "2:201"
        const [s, a] = verseKey.split(':').map(Number);

        // Fetch words to count them
        const words = await fetchVerseWords(s, a);
        if (words) {
            // We want to add the WHOLE verse or a segment? 
            // User says "maximum words from quran".
            // Let's output the Verse Key and Word Count to decide strategies.
            // Also getting the first word text to verification.
            console.log(`{ title: "${item.tr}", s: ${s}, a: ${a}, words: ${words.length}, startText: "${words[0].text_uthmani}" },`);
        }

    } catch (e) {
        console.error(`// ERROR ${item.tr}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 200));
}

async function run() {
    console.log("const duas_data = [");
    for (const item of rabbanas) {
        await searchAndGetInfo(item);
    }
    console.log("];");
}

run();
