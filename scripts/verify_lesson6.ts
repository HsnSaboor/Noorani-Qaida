import fs from 'fs';
import path from 'path';

// Define the structure of a toon item
interface ToonItem {
    id: string;
    text_ar: string;
    transliteration: string;
    type: string;
    surah: number;
    ayah: number;
    word_index: number;
}

// Map simple normalization
function normalize(text: string): string {
    return text.replace(/[ًٌٍَُِّْ]/g, '').replace('ٱ', 'ا').replace('آ', 'ا'); // Basic stripping
}

async function verifyLesson6() {
    const contentPath = path.resolve('data/lessons_toon/phase1/lesson6/content.toon');
    const content = fs.readFileSync(contentPath, 'utf8');

    // Parse content.toon manually (simple regex parser for this specific file structure)
    const lines = content.split('\n');
    const items: ToonItem[] = [];

    for (const line of lines) {
        if (line.trim().startsWith('l6_') && line.includes(',')) {
            // Format: l6_fatha_0, "خَلَقَ", "Khalaqa", "single", 55, 14, 1
            const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
            if (parts.length >= 7) {
                items.push({
                    id: parts[0],
                    text_ar: parts[1],
                    transliteration: parts[2],
                    type: parts[3],
                    surah: parseInt(parts[4]),
                    ayah: parseInt(parts[5]),
                    word_index: parseInt(parts[6])
                });
            }
        }
    }

    console.log(`Found ${items.length} items to verify.`);

    const fixes: string[] = [];

    for (const item of items) {
        try {
            // Fetch Verse Data
            const url = `https://api.qurancdn.com/api/qdc/verses/by_key/${item.surah}:${item.ayah}?words=true&word_fields=text_uthmani,text_indopak`;
            const response = await fetch(url);
            const data = await response.json();

            const words = data.verse.words.filter((w: any) => w.char_type_name === 'word');

            const expectedText = normalize(item.text_ar);
            const currentWord = words[item.word_index - 1]; // API is 0-indexed for array, but word_index is usually 1-based? Let's check.

            // Usually QB word_index is 1-based.
            // API return array is 0-based. So index 1 = array[0].

            let matchFound = false;
            let actualText = "N/A";

            // Check if current index matches
            if (currentWord) {
                actualText = normalize(currentWord.text_uthmani);
                if (actualText.includes(expectedText) || expectedText.includes(actualText)) {
                    matchFound = true;
                }
            }

            if (matchFound) {
                // console.log(`✅ ${item.id} - ${item.text_ar} matches 11:${item.word_index}`);
            } else {
                console.log(`❌ ${item.id} - ${item.text_ar} (${item.surah}:${item.ayah}:${item.word_index})`);
                console.log(`   Expected: ${expectedText}`);
                if (currentWord) console.log(`   Found at index ${item.word_index}: ${currentWord.text_uthmani} (${actualText})`);

                // Search for correct index
                let correctIndex = -1;
                let bestMatchWord = null;

                words.forEach((w: any, idx: number) => {
                    const wText = normalize(w.text_uthmani);
                    if (wText === expectedText || wText.includes(expectedText) || expectedText.includes(wText)) {
                        correctIndex = idx + 1; // 1-based
                        bestMatchWord = w.text_uthmani;
                    }
                });

                if (correctIndex !== -1) {
                    console.log(`   💡 Suggestion: Change index to ${correctIndex} (Exact Match: ${bestMatchWord})`);
                    fixes.push(`${item.id} -> ${correctIndex}`);
                } else {
                    // Heuristic search (levenshtein or just visual check)
                    console.log(`   ⚠️ No exact match found in verse words:`);
                    words.forEach((w: any) => process.stdout.write(`[${w.position}: ${w.text_uthmani}] `));
                    console.log('\n');
                }
            }

            // Rate limit slightly
            await new Promise(r => setTimeout(r, 100));

        } catch (e) {
            console.error(`Error checking ${item.id}:`, e);
        }
    }
}

verifyLesson6();
