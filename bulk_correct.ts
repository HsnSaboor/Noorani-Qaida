/**
 * Bulk WBW Correction - Processes L7-L24
 * Outputs corrected data ready to paste into basic.ts
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

interface WordInfo { position: number; text_uthmani: string; }
interface VerseInfo { verse_key: string; words: WordInfo[]; }
const verseCache: Map<string, VerseInfo | null> = new Map();

async function fetchVerse(surah: number, ayah: number): Promise<VerseInfo | null> {
    const key = `${surah}:${ayah}`;
    if (verseCache.has(key)) return verseCache.get(key)!;
    try {
        const url = `https://api.qurancdn.com/api/qdc/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani`;
        const response = await fetch(url);
        if (!response.ok) { verseCache.set(key, null); return null; }
        const data = await response.json();
        verseCache.set(key, data.verse);
        return data.verse;
    } catch { verseCache.set(key, null); return null; }
}

async function findWordInVerse(arabicText: string, surah: number, ayah: number): Promise<number | null> {
    const verse = await fetchVerse(surah, ayah);
    if (!verse) return null;
    const ns = normalizeArabic(arabicText);
    for (const word of verse.words) {
        if (!word.text_uthmani) continue;
        const nw = normalizeArabic(word.text_uthmani);
        if (nw === ns || nw.startsWith(ns) || ns.startsWith(nw) || nw.includes(ns) || ns.includes(nw)) {
            return word.position;
        }
    }
    return null;
}

async function verifyAndCorrect(arabic: string, s: number, a: number, w: number): Promise<[number, number, number]> {
    // Check if current is correct
    const pos = await findWordInVerse(arabic, s, a);
    if (pos === w) return [s, a, w];
    if (pos !== null) return [s, a, pos];

    // Check nearby ayahs
    for (let offset = -2; offset <= 2; offset++) {
        if (offset === 0) continue;
        const testAyah = a + offset;
        if (testAyah < 1) continue;
        const p = await findWordInVerse(arabic, s, testAyah);
        if (p !== null) return [s, testAyah, p];
    }
    return [s, a, w]; // Keep original if not found
}

async function processArray(name: string, data: [string, string, number, number, number][]): Promise<void> {
    console.error(`Processing ${name} (${data.length} items)...`);
    const lines: string[] = [];
    let fixed = 0;

    for (const [arabic, translit, surah, ayah, word] of data) {
        const [s, a, w] = await verifyAndCorrect(arabic, surah, ayah, word);
        if (s !== surah || a !== ayah || w !== word) {
            fixed++;
            console.error(`  [FIX] ${arabic}: ${surah}:${ayah}:${word} → ${s}:${a}:${w}`);
        }
        lines.push(`    ['${arabic}', '${translit}', ${s}, ${a}, ${w}],`);
        await new Promise(r => setTimeout(r, 80));
    }

    console.log(`const ${name}: [string, string, number, number, number][] = [`);
    lines.forEach(line => console.log(line));
    console.log(`];`);
    console.error(`  → ${fixed} items fixed\n`);
}

async function main() {
    console.log("// Corrected WBW Data - " + new Date().toISOString());

    // === L9 FULL CHECK ===
    const l9_full: [string, string, number, number, number][] = [
        ['كُتِبَ', 'Kutiba', 2, 183, 1], ['قُرِئَ', 'Quri-a', 7, 204, 3], ['فُتِحَ', 'Futiha', 38, 50, 2], ['جُعِلَ', 'Ju-ila', 2, 22, 16],
        ['خُلِقَ', 'Khuliqa', 4, 28, 4], ['وُضِعَ', 'Wudi-a', 3, 96, 3], ['أُذِنَ', 'Udhina', 22, 39, 1], ['رُفِعَ', 'Rufi-a', 2, 127, 3],
        ['ضُرِبَ', 'Duriba', 2, 61, 35], ['قُتِلَ', 'Qutila', 3, 144, 21], ['سُئِلَ', 'Su-ila', 2, 108, 4], ['حُشِرَ', 'Hushira', 27, 17, 1],
        ['نُشِرَ', 'Nushira', 81, 10, 2], ['بَدَأَ', 'Bada-a', 7, 29, 6], ['قَرَأَ', 'Qara-a', 15, 93, 3], ['أَخَذَ', 'Akhadha', 2, 92, 14],
        ['أَكَلَ', 'Akala', 5, 3, 15], ['أَمَرَ', 'Amara', 6, 14, 18], ['سَأَلَ', 'Sa-ala', 2, 211, 1], ['نَزَلَ', 'Nazala', 17, 105, 4],
        ['طُبِعَ', 'Tubia', 9, 87, 6], ['ذُكِرَ', 'Dhukira', 2, 114, 15], ['رُزِقَ', 'Ruziqa', 2, 25, 14], ['وُجِدَ', 'Wujida', 12, 75, 5],
        ['صُعِقَ', 'Su-iqa', 39, 68, 6], ['غُلِبَ', 'Guliba', 30, 2, 1], ['قُضِيَ', 'Qudiya', 2, 117, 12], ['أُتِيَ', 'Utiya', 2, 25, 23],
        ['دُعِيَ', 'Du-iya', 24, 51, 6], ['رُجِيَ', 'Rujiya', 11, 62, 7], ['نُسِيَ', 'Nusiya', 19, 23, 15], ['عُصِيَ', 'Usiya', 11, 59, 7],
        ['بُغِيَ', 'Bugiya', 22, 60, 11], ['غُوِيَ', 'Guwiya', 53, 2, 3], ['زُكِيَ', 'Zukiya', 24, 21, 22], ['بُنِيَ', 'Buniya', 9, 109, 3],
        ['خُشِيَ', 'Khushiya', 33, 37, 20], ['عُفِيَ', 'Ufiya', 2, 178, 22], ['رُمِيَ', 'Rumiya', 8, 17, 14], ['هُدِيَ', 'Hudiya', 3, 101, 13],
        ['سُقِيَ', 'Suqiya', 13, 4, 16], ['كَفِيَ', 'Kafiya', 15, 95, 1], ['نُسِخَ', 'Nusikha', 2, 106, 2], ['فُصِلَ', 'Fusila', 11, 1, 4],
        ['بَعِثَ', 'Ba-itha', 2, 56, 2], ['نُقِرَ', 'Nuqira', 74, 8, 2], ['رُفِعَتْ', 'Rufi-at', 88, 18, 2], ['حُمِلَ', 'Humila', 20, 100, 4],
        ['ذُهِبَ', 'Dhuhiba', 2, 20, 12], ['شُفِيَ', 'Shufiya', 16, 69, 19]
    ];
    await processArray('l9_full', l9_full);
}

main().catch(console.error);
