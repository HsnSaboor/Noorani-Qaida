/**
 * Full WBW Mapping Correction Script
 * Processes all lesson data and outputs corrected TypeScript code
 * 
 * Usage: npx ts-node full_wbw_correction.ts 2>&1 | tee corrected_mappings.log
 */

function normalizeArabic(text: string): string {
    if (!text) return "";
    let normalized = text.normalize("NFKC");
    normalized = normalized.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u06E5\u06E6\u06E2\u06E0\u06E1\u06E3\u06E4\u06E8\u06EA\u06EB\u06EC\u06ED\u06E7\u06E9]/g, '');
    normalized = normalized.replace(/[أإآٱ]/g, 'ا');
    normalized = normalized.replace(/ة/g, 'ه');
    normalized = normalized.replace(/[ىيئ]/g, 'ي');
    normalized = normalized.replace(/[كڪ]/g, 'ك');
    normalized = normalized.replace(/[هہ]/g, 'ه');
    return normalized.trim();
}

interface WordInfo { position: number; text_uthmani: string; audio_url: string | null; }
interface VerseInfo { verse_key: string; words: WordInfo[]; }
const verseCache: Map<string, VerseInfo | null> = new Map();

async function fetchVerse(surah: number, ayah: number): Promise<VerseInfo | null> {
    const key = `${surah}:${ayah}`;
    if (verseCache.has(key)) return verseCache.get(key)!;
    try {
        const url = `https://api.qurancdn.com/api/qdc/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,audio_url`;
        const response = await fetch(url);
        if (!response.ok) { verseCache.set(key, null); return null; }
        const data = await response.json();
        verseCache.set(key, data.verse);
        return data.verse;
    } catch (e) { verseCache.set(key, null); return null; }
}

async function findWordInVerse(arabicText: string, surah: number, ayah: number): Promise<{ found: boolean, wordIndex: number } | null> {
    const verse = await fetchVerse(surah, ayah);
    if (!verse) return null;
    const normalizedSearch = normalizeArabic(arabicText);
    for (const word of verse.words) {
        if (!word.text_uthmani) continue;
        const normalizedWord = normalizeArabic(word.text_uthmani);
        if (normalizedWord === normalizedSearch || normalizedWord.startsWith(normalizedSearch) ||
            normalizedSearch.startsWith(normalizedWord) || normalizedWord.includes(normalizedSearch) ||
            normalizedSearch.includes(normalizedWord)) {
            return { found: true, wordIndex: word.position };
        }
    }
    return null;
}

async function searchQuranForWord(arabicText: string): Promise<{ surah: number, ayah: number, wordIndex: number }[]> {
    try {
        const encoded = encodeURIComponent(arabicText);
        const url = `https://api.quran.com/api/v4/search?q=${encoded}&size=5&language=en`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        const results: { surah: number, ayah: number, wordIndex: number }[] = [];
        if (data.search?.results) {
            for (const result of data.search.results.slice(0, 3)) {
                const [surah, ayah] = result.verse_key.split(':').map(Number);
                const wordResult = await findWordInVerse(arabicText, surah, ayah);
                if (wordResult?.found) {
                    results.push({ surah, ayah, wordIndex: wordResult.wordIndex });
                    break;
                }
            }
        }
        return results;
    } catch (e) { return []; }
}

async function verifyAndCorrect(arabicText: string, currentSurah: number, currentAyah: number, currentWord: number
): Promise<{ surah: number; ayah: number; word: number; status: string }> {
    // Check current mapping first
    const currentResult = await findWordInVerse(arabicText, currentSurah, currentAyah);
    if (currentResult?.found && currentResult.wordIndex === currentWord) {
        return { surah: currentSurah, ayah: currentAyah, word: currentWord, status: 'OK' };
    }
    if (currentResult?.found) {
        return { surah: currentSurah, ayah: currentAyah, word: currentResult.wordIndex, status: 'WORD_FIX' };
    }
    // Check nearby ayahs
    for (let offset = -2; offset <= 2; offset++) {
        if (offset === 0) continue;
        const testAyah = currentAyah + offset;
        if (testAyah < 1) continue;
        const result = await findWordInVerse(arabicText, currentSurah, testAyah);
        if (result?.found) {
            return { surah: currentSurah, ayah: testAyah, word: result.wordIndex, status: 'AYAH_FIX' };
        }
    }
    // Full search
    const searchResults = await searchQuranForWord(arabicText);
    if (searchResults.length > 0) {
        const best = searchResults[0];
        return { surah: best.surah, ayah: best.ayah, word: best.wordIndex, status: 'SEARCH_FIX' };
    }
    return { surah: currentSurah, ayah: currentAyah, word: currentWord, status: 'NOT_FOUND' };
}

// All raw data arrays from basic.ts
const l6_raw_data: [string, string, number, number, number][] = [
    ['خَلَقَ', 'Khalaqa', 6, 2, 2], ['وَلَدَ', 'Walada', 112, 3, 2], ['نَزَلَ', 'Nazala', 17, 105, 4], ['فَعَلَ', 'Fa-ala', 105, 1, 2],
    ['وَضَعَ', 'Wada-a', 3, 96, 3], ['ذَهَبَ', 'Dhahaba', 2, 20, 12], ['دَخَلَ', 'Dakhala', 110, 2, 2], ['غَلَبَ', 'Galaba', 30, 2, 1],
    ['كَفَرَ', 'Kafara', 2, 6, 4], ['نَصَرَ', 'Nasara', 110, 1, 2], ['جَعَلَ', 'Ja-ala', 2, 22, 16], ['أَكَلَ', 'Akala', 5, 3, 15],
    ['ضَرَبَ', 'Daraba', 2, 60, 2], ['قَتَلَ', 'Qatala', 3, 144, 21], ['أَمَرَ', 'Amara', 6, 14, 18], ['سَأَلَ', 'Sa-ala', 2, 211, 1],
    ['حَمَلَ', 'Hamala', 20, 100, 4], ['خَتَمَ', 'Khatama', 2, 7, 1], ['بَلَغَ', 'Balaga', 6, 19, 29], ['كَسَبَ', 'Kasaba', 2, 286, 24],
    ['صَبَرَ', 'Sabara', 3, 200, 1], ['رَفَعَ', 'Rafa-a', 2, 127, 3], ['قَرَأَ', 'Qara-a', 17, 45, 2], ['غَسَقَ', 'Gasaqa', 113, 3, 4],
    ['وَقَبَ', 'Waqaba', 113, 3, 5], ['عَقَدَ', 'Aqada', 113, 4, 3], ['حَسَدَ', 'Hasada', 113, 5, 5], ['بَدَأَ', 'Bada-a', 7, 29, 6],
    ['قَطَعَ', 'Qata-a', 2, 27, 8], ['طَبَعَ', 'Taba-a', 9, 87, 6], ['حَشَرَ', 'Hashara', 27, 17, 1], ['نَشَرَ', 'Nashara', 81, 10, 2],
    ['فَتَحَ', 'Fataha', 48, 1, 2], ['رَزَقَ', 'Razaqa', 2, 25, 14], ['عَبَدَ', 'Abada', 109, 3, 2], ['ذَكَرَ', 'Dhakara', 2, 114, 15],
    ['حَكَمَ', 'Hakama', 5, 1, 7], ['صَدَقَ', 'Sadaqa', 3, 95, 1], ['ثَبَتَ', 'Thabata', 2, 250, 12], ['جَمَعَ', 'Jama-a', 104, 2, 1],
    ['شَكَرَ', 'Shakara', 2, 152, 4], ['صَلَحَ', 'Salaha', 13, 23, 1], ['حَرَثَ', 'Haratha', 2, 223, 13], ['بَعَثَ', 'Ba-atha', 2, 56, 2],
    ['عَرَفَ', 'Arafa', 2, 146, 7], ['سَكَنَ', 'Sakana', 6, 13, 2], ['عَلَمَ', 'Alama', 96, 5, 2], ['غَفَرَ', 'Gafara', 2, 285, 23],
    ['كَتَمَ', 'Katama', 2, 140, 31], ['هَرَبَ', 'Haraba', 72, 12, 12], ['وَهَبَ', 'Wahaba', 3, 8, 18], ['خَرَجَ', 'Kharaja', 2, 149, 2],
    ['عَصَى', 'Asa', 2, 61, 45], ['فَطَرَ', 'Fatara', 6, 79, 7], ['رَمَى', 'Rama', 8, 17, 14], ['سَعَى', 'Sa-a', 2, 205, 4],
    ['نَهَى', 'Naha', 79, 40, 7], ['قَضَى', 'Qada', 2, 117, 12], ['عَفَا', 'Afa', 2, 187, 30], ['رَجَا', 'Raja', 18, 110, 16],
    ['دَعَا', 'Da-a', 2, 186, 3], ['مَشَى', 'Masha', 2, 20, 16], ['بَقَى', 'Baqa', 2, 278, 10], ['طَغَى', 'Taga', 20, 24, 4],
    ['أَتَى', 'Ata', 2, 109, 21], ['أَبَى', 'Aba', 2, 34, 11], ['عَدَا', 'Ada', 2, 65, 4], ['سَدَا', 'Sada', 75, 36, 5],
    ['رَأَى', 'Ra-a', 53, 11, 4], ['فَجَرَ', 'Fajara', 75, 5, 2], ['قَدَرَ', 'Qadara', 2, 236, 17], ['نَظَرَ', 'Nazara', 2, 198, 11],
    ['حَضَرَ', 'Hadara', 2, 133, 2], ['أَسَفَ', 'Asafa', 12, 84, 4], ['أَذَنَ', 'Adhana', 2, 279, 12], ['هَجَرَ', 'Hajara', 23, 67, 4],
    ['بَسَطَ', 'Basata', 2, 245, 9], ['قَبَضَ', 'Qabada', 2, 245, 11], ['خَسَرَ', 'Khasara', 2, 27, 15], ['نَكَثَ', 'Nakathas', 7, 135, 7],
    ['وَعَدَ', 'Wa-ada', 2, 80, 11], ['بَرَزَ', 'Baraza', 2, 250, 2], ['غَدَرَ', 'Gadara', 18, 47, 14], ['نَطَقَ', 'Nataqa', 21, 63, 11],
    ['سَلَكَ', 'Salaka', 20, 53, 6], ['قَذَفَ', 'Qadhafa', 20, 39, 4], ['تَرَكَ', 'Taraka', 2, 17, 10], ['قَبَلَ', 'Qabala', 2, 210, 12],
    ['غَرَقَ', 'Garaqa', 7, 136, 5], ['فَرَقَ', 'Faraqa', 2, 50, 2], ['عَرَضَ', 'Arada', 2, 31, 10], ['طَلَقَ', 'Talaqa', 66, 5, 2],
    ['نَفَخَ', 'Nafakha', 20, 102, 3], ['طَرَدَ', 'Tarada', 6, 52, 12], ['سَحَرَ', 'Sahara', 7, 116, 11], ['عَصَرَ', 'Asara', 12, 36, 21],
    ['قَصَصَ', 'Qasasa', 12, 3, 4], ['سَبَقَ', 'Sabaqa', 7, 80, 18], ['فَسَقَ', 'Fasaqa', 2, 26, 31], ['فَسَدَ', 'Fasada', 2, 251, 17],
    ['حَمَدَ', 'Hamada', 1, 2, 2], ['مَلَكَ', 'Malaka', 1, 4, 1], ['خَلَقَ', 'Khalaqa', 6, 1, 4], ['هَدَى', 'Hada', 6, 84, 21],
    ['نَزَعَ', 'Naza-a', 7, 43, 8], ['نَزَلَ', 'Nazala', 12, 2, 3], ['عَلِمَ', 'Alama', 12, 6, 15], ['جَعَلَ', 'Ja-ala', 12, 15, 30]
];

async function processArray(name: string, data: [string, string, number, number, number][]): Promise<string[]> {
    console.error(`\nProcessing ${name} (${data.length} items)...`);
    const lines: string[] = [];
    let fixed = 0, ok = 0, notFound = 0;

    for (const [arabic, translit, surah, ayah, word] of data) {
        const result = await verifyAndCorrect(arabic, surah, ayah, word);
        if (result.status === 'OK') ok++;
        else if (result.status === 'NOT_FOUND') { notFound++; console.error(`  [NOT_FOUND] ${arabic}`); }
        else { fixed++; console.error(`  [${result.status}] ${arabic}: ${surah}:${ayah}:${word} → ${result.surah}:${result.ayah}:${result.word}`); }

        lines.push(`    ['${arabic}', '${translit}', ${result.surah}, ${result.ayah}, ${result.word}],`);
        await new Promise(r => setTimeout(r, 100)); // Rate limiting
    }

    console.error(`  Summary: ${ok} OK, ${fixed} FIXED, ${notFound} NOT_FOUND`);
    return [`const ${name}: [string, string, number, number, number][] = [`, ...lines, `];`];
}

async function main() {
    console.log("// Corrected WBW mappings - Generated " + new Date().toISOString());
    console.log("// Copy these arrays to replace the originals in basic.ts\n");

    const output = await processArray('l6_raw_data', l6_raw_data);
    output.forEach(line => console.log(line));

    console.error("\n=== COMPLETE ===");
}

main().catch(console.error);
