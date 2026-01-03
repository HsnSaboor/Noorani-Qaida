
const wordsToCheck = [
    { id: 'l4_w_0', text: 'خَلَقَ', translit: 'Khalaqa', surah: 55, ayah: 14, word: 1 },
    { id: 'l4_w_1', text: 'صَدَقَ', translit: 'Sadaqa', surah: 3, ayah: 95, word: 2 },
    { id: 'l4_w_2', text: 'ضَرَبَ', translit: 'Daraba', surah: 14, ayah: 24, word: 3 },
    { id: 'l4_w_3', text: 'غَلَبَ', translit: 'Ghalaba', surah: 18, ayah: 21, word: 2 },
    { id: 'l4_w_4', text: 'خَطَبَ', translit: 'Khataba', surah: 22, ayah: 73, word: 14 }, // Replaced Talaba
    { id: 'l4_w_5', text: 'قَتَلَ', translit: 'Qatala', surah: 5, ayah: 32, word: 8 },
    { id: 'l4_w_6', text: 'ظَلَمَ', translit: 'Zalama', surah: 2, ayah: 231, word: 26 },
    { id: 'l4_w_7', text: 'خَتَمَ', translit: 'Khatama', surah: 2, ayah: 7, word: 1 },
    { id: 'l4_w_8', text: 'صَبَرَ', translit: 'Sabara', surah: 42, ayah: 43, word: 3 },
    { id: 'l4_w_9', text: 'قَرَأَ', translit: 'Qara-a', surah: 96, ayah: 1, word: 1 },
    { id: 'l4_w_light_0', text: 'كَتَبَ', translit: 'Kataba', surah: 58, ayah: 21, word: 1 },
    { id: 'l4_w_light_1', text: 'سَمِعَ', translit: 'Samia', surah: 58, ayah: 1, word: 2 },
    { id: 'l4_w_light_2', text: 'فَتَحَ', translit: 'Fataha', surah: 2, ayah: 76, word: 8 },
];

async function verify() {
    console.log('Verifying coordinates...');

    for (const item of wordsToCheck) {
        try {
            // Using Quran.com API to get verse details including words
            // Endpoint: https://api.quran.com/api/v4/verses/by_key/{surah}:{ayah}?words=true
            const response = await fetch(`https://api.quran.com/api/v4/verses/by_key/${item.surah}:${item.ayah}?words=true`);
            const data = await response.json();

            if (!data.verse || !data.verse.words) {
                console.error(`❌ ${item.id} (${item.translit}): Failed to fetch data for ${item.surah}:${item.ayah}`);
                continue;
            }

            const words = data.verse.words;
            // API structure check
            // console.log('Words sample:', words.length > 0 ? JSON.stringify(words[0]) : 'Empty');

            const actualWords = words.filter((w: any) => w.char_type_name !== 'end');
            const targetWord = actualWords[item.word - 1];

            if (!targetWord) {
                console.error(`❌ ${item.id} (${item.translit}): Word index ${item.word} out of bounds for ${item.surah}:${item.ayah} (Length: ${actualWords.length})`);
                continue;
            }

            // Updated property access based on debug output
            // The API returns 'text' which seems to be the Arabic text (code_v1 looks like glyphs)
            const apiText = targetWord.text;
            const apiTranslit = targetWord.transliteration?.text;

            console.log(`Checking ${item.id} (${item.translit}) at ${item.surah}:${item.ayah}:${item.word}`);
            console.log(`   Expected: ${item.text}`);
            console.log(`   Found:    ${apiText} (Translit: ${apiTranslit})`);

            // Also check audio existence
            const s = String(item.surah).padStart(3, '0');
            const a = String(item.ayah).padStart(3, '0');
            const w = String(item.word).padStart(3, '0');
            const audioUrl = `https://audio.qurancdn.com/wbw/${s}_${a}_${w}.mp3`;

            const audioResp = await fetch(audioUrl, { method: 'HEAD' });
            if (audioResp.ok) {
                console.log(`   ✅ Audio: OK`);
            } else {
                console.error(`   ❌ Audio: NOT FOUND (${audioUrl})`);
            }
            console.log('---');

        } catch (e) {
            console.error(`Error checking ${item.id}:`, e);
        }
    }
}

verify();
