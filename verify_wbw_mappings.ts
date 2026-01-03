/**
 * WBW Mapping Verification & Correction Script - Full Version
 * 
 * This script processes all lesson data arrays, verifies them against
 * the Quran.com API, and generates corrected TypeScript code.
 * 
 * Usage: npx ts-node verify_wbw_mappings.ts > corrected_data.ts
 */

// Normalize Arabic text for comparison
function normalizeArabic(text: string): string {
    if (!text) return "";
    let normalized = text.normalize("NFKC");

    // Remove Tashkeel (Diacritics)
    normalized = normalized.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u06E5\u06E6\u06E2\u06E0\u06E1\u06E3\u06E4\u06E8\u06EA\u06EB\u06EC\u06ED\u06E7\u06E9]/g, '');

    // Normalize Alef variants
    normalized = normalized.replace(/[أإآٱ]/g, 'ا');
    normalized = normalized.replace(/ة/g, 'ه');
    normalized = normalized.replace(/[ىيئ]/g, 'ي');
    normalized = normalized.replace(/[كڪ]/g, 'ك');
    normalized = normalized.replace(/[هہ]/g, 'ه');

    return normalized.trim();
}

interface WordInfo {
    position: number;
    text_uthmani: string;
    audio_url: string | null;
}

interface VerseInfo {
    verse_key: string;
    words: WordInfo[];
}

const verseCache: Map<string, VerseInfo | null> = new Map();

async function fetchVerse(surah: number, ayah: number): Promise<VerseInfo | null> {
    const key = `${surah}:${ayah}`;
    if (verseCache.has(key)) {
        return verseCache.get(key)!;
    }

    try {
        const url = `https://api.qurancdn.com/api/qdc/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,audio_url`;
        const response = await fetch(url);
        if (!response.ok) {
            verseCache.set(key, null);
            return null;
        }
        const data = await response.json();
        const verse = data.verse;
        verseCache.set(key, verse);
        return verse;
    } catch (e) {
        verseCache.set(key, null);
        return null;
    }
}

async function findWordInVerse(arabicText: string, surah: number, ayah: number): Promise<{ found: boolean, wordIndex: number, matchedText?: string } | null> {
    const verse = await fetchVerse(surah, ayah);
    if (!verse) return null;

    const normalizedSearch = normalizeArabic(arabicText);

    for (const word of verse.words) {
        if (!word.text_uthmani) continue;
        const normalizedWord = normalizeArabic(word.text_uthmani);

        // Various matching strategies
        if (normalizedWord === normalizedSearch ||
            normalizedWord.startsWith(normalizedSearch) ||
            normalizedSearch.startsWith(normalizedWord) ||
            normalizedWord.includes(normalizedSearch) ||
            normalizedSearch.includes(normalizedWord)) {
            return {
                found: true,
                wordIndex: word.position,
                matchedText: word.text_uthmani
            };
        }
    }
    return null;
}

async function searchQuranForWord(arabicText: string): Promise<{ surah: number, ayah: number, wordIndex: number }[]> {
    try {
        const encoded = encodeURIComponent(arabicText);
        const url = `https://api.quran.com/api/v4/search?q=${encoded}&size=10&language=en`;
        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();
        const results: { surah: number, ayah: number, wordIndex: number }[] = [];

        if (data.search?.results) {
            for (const result of data.search.results.slice(0, 5)) {
                const [surah, ayah] = result.verse_key.split(':').map(Number);
                const wordResult = await findWordInVerse(arabicText, surah, ayah);
                if (wordResult?.found) {
                    results.push({
                        surah,
                        ayah,
                        wordIndex: wordResult.wordIndex
                    });
                }
            }
        }
        return results;
    } catch (e) {
        return [];
    }
}

async function verifyAndCorrect(
    arabicText: string,
    currentSurah: number,
    currentAyah: number,
    currentWord: number
): Promise<{ correct: boolean; surah: number; ayah: number; word: number; status: string }> {

    // First check current mapping
    const currentResult = await findWordInVerse(arabicText, currentSurah, currentAyah);
    if (currentResult?.found && currentResult.wordIndex === currentWord) {
        return { correct: true, surah: currentSurah, ayah: currentAyah, word: currentWord, status: 'OK' };
    }

    // Check if word is in the same verse but different position
    if (currentResult?.found) {
        return { correct: false, surah: currentSurah, ayah: currentAyah, word: currentResult.wordIndex, status: 'FIXED_WORD' };
    }

    // Search nearby ayahs in same surah
    for (let offset = -3; offset <= 3; offset++) {
        if (offset === 0) continue;
        const testAyah = currentAyah + offset;
        if (testAyah < 1) continue;

        const result = await findWordInVerse(arabicText, currentSurah, testAyah);
        if (result?.found) {
            return { correct: false, surah: currentSurah, ayah: testAyah, word: result.wordIndex, status: 'FIXED_AYAH' };
        }
    }

    // Full Quran search
    const searchResults = await searchQuranForWord(arabicText);
    if (searchResults.length > 0) {
        const best = searchResults[0];
        return { correct: false, surah: best.surah, ayah: best.ayah, word: best.wordIndex, status: 'FOUND_NEW' };
    }

    // Not found - keep original but mark
    return { correct: false, surah: currentSurah, ayah: currentAyah, word: currentWord, status: 'NOT_FOUND' };
}

// All lesson raw data
const ALL_RAW_DATA: { name: string; data: [string, string, number, number, number][] }[] = [
    {
        name: 'l6_raw_data', data: [
            ['خَلَقَ', 'Khalaqa', 6, 2, 2], ['وَلَدَ', 'Walada', 112, 3, 2], ['نَزَلَ', 'Nazala', 17, 105, 4], ['فَعَلَ', 'Fa-ala', 105, 1, 2],
            ['وَضَعَ', 'Wada-a', 3, 96, 3], ['ذَهَبَ', 'Dhahaba', 2, 20, 12], ['دَخَلَ', 'Dakhala', 110, 2, 2], ['غَلَبَ', 'Galaba', 30, 2, 1],
            ['كَفَرَ', 'Kafara', 2, 6, 4], ['نَصَرَ', 'Nasara', 110, 1, 2], ['جَعَلَ', 'Ja-ala', 2, 22, 16], ['أَكَلَ', 'Akala', 5, 3, 15],
            ['ضَرَبَ', 'Daraba', 2, 60, 2], ['قَتَلَ', 'Qatala', 3, 144, 21], ['أَمَرَ', 'Amara', 6, 14, 18], ['سَأَلَ', 'Sa-ala', 2, 211, 1],
            ['حَمَلَ', 'Hamala', 20, 100, 4], ['خَتَمَ', 'Khatama', 2, 7, 1], ['بَلَغَ', 'Balaga', 6, 19, 29], ['كَسَبَ', 'Kasaba', 2, 286, 24],
        ]
    },
    {
        name: 'l7_raw_data', data: [
            ['إِبِلِ', 'Ibili', 88, 17, 4], ['عَلِمَ', 'Alima', 2, 216, 17], ['شَهِدَ', 'Shahida', 3, 18, 1], ['رَحِمَ', 'Rahima', 7, 151, 6],
            ['عَمِلَ', 'Amila', 2, 25, 6], ['سَمِعَ', 'Sami-a', 2, 181, 6], ['ضَحِكَ', 'Dahika', 11, 71, 3], ['شَرِبَ', 'Shariba', 12, 30, 16],
            ['رَكِبَ', 'Rakiba', 84, 19, 2], ['فَهِمَ', 'Fahima', 21, 79, 1], ['لَعِبَ', 'La-iba', 6, 32, 5], ['خَسِرَ', 'Khasira', 2, 27, 15],
            ['كَرِهَ', 'Kariha', 2, 216, 2], ['حَفِظَ', 'Hafiza', 12, 65, 30], ['حَسِبَ', 'Hasiba', 2, 273, 11], ['خَشِيَ', 'Khashiya', 33, 37, 20],
        ]
    },
    {
        name: 'l8_raw_data', data: [
            ['رُسُلُ', 'Rusulu', 6, 34, 15], ['كُتُبُ', 'Kutubu', 98, 3, 2], ['سُبُلُ', 'Subulu', 29, 69, 10], ['خُلِقَ', 'Khuliqa', 4, 28, 4],
            ['ضُرِبَ', 'Duriba', 2, 61, 35], ['قُتِلَ', 'Qutila', 3, 144, 21], ['نُفِخَ', 'Nufikha', 18, 99, 5], ['ذُكِرَ', 'Dhukira', 2, 114, 15],
        ]
    },
];

async function main() {
    console.log("// === WBW Corrected Data ===");
    console.log("// Auto-generated by verify_wbw_mappings.ts");
    console.log("// Run: npx ts-node verify_wbw_mappings.ts\n");

    let totalCorrect = 0;
    let totalFixed = 0;
    let totalNotFound = 0;

    for (const { name, data } of ALL_RAW_DATA) {
        console.log(`\n// Processing ${name}...`);
        console.error(`Processing ${name} (${data.length} items)...`);

        const corrected: string[] = [];
        let lessonCorrect = 0;
        let lessonFixed = 0;

        for (const [arabic, translit, surah, ayah, word] of data) {
            const result = await verifyAndCorrect(arabic, surah, ayah, word);

            if (result.status === 'OK') {
                lessonCorrect++;
                totalCorrect++;
            } else if (result.status === 'NOT_FOUND') {
                totalNotFound++;
                console.error(`  [NOT_FOUND] ${arabic} (${translit})`);
            } else {
                lessonFixed++;
                totalFixed++;
                console.error(`  [${result.status}] ${arabic}: ${surah}:${ayah}:${word} → ${result.surah}:${result.ayah}:${result.word}`);
            }

            corrected.push(`    ['${arabic}', '${translit}', ${result.surah}, ${result.ayah}, ${result.word}],`);

            // Rate limiting
            await new Promise(r => setTimeout(r, 150));
        }

        console.log(`const ${name}: [string, string, number, number, number][] = [`);
        corrected.forEach(line => console.log(line));
        console.log(`];`);

        console.error(`  → ${name}: ${lessonCorrect} correct, ${lessonFixed} fixed`);
    }

    console.error(`\n=== FINAL SUMMARY ===`);
    console.error(`Total Correct: ${totalCorrect}`);
    console.error(`Total Fixed: ${totalFixed}`);
    console.error(`Total Not Found: ${totalNotFound}`);
}

main().catch(console.error);
