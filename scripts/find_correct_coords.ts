
const targetWords = [
    { text: "خَلَقَ", translit: "Khalaqa" },
    { text: "صَدَقَ", translit: "Sadaqa" },
    { text: "ضَرَبَ", translit: "Daraba" },
    { text: "غَلَبَ", translit: "Ghalaba" },
    { text: "طَلَبَ", translit: "Talaba" }, // Need replacement if not found
    { text: "كَتَبَ", translit: "Kataba" }, // Replacement candidate for Talaba if needed? No, separate word.
    { text: "خَطَبَ", translit: "Khataba" }, // Failed replacement for Talaba
    { text: "قَتَلَ", translit: "Qatala" },
    { text: "ظَلَمَ", translit: "Zalama" },
    { text: "خَتَمَ", translit: "Khatama" },
    { text: "صَبَرَ", translit: "Sabara" },
    { text: "قَرَأَ", translit: "Qara-a" },
    { text: "كَتَبَ", translit: "Kataba (Light)" },
    { text: "سَمِعَ", translit: "Samia (Light)" },
    { text: "فَتَحَ", translit: "Fataha (Light)" },
    // Replacements
    { text: "كَسَبَ", translit: "Kasaba" },
    { text: "دَخَلَ", translit: "Dakhala" },
    { text: "خَرَجَ", translit: "Kharaja" },
    { text: "نَصَرَ", translit: "Nasara" },
    { text: "زَعَمَ", translit: "Za'ama" }
];

async function findCoords() {
    console.log("Searching for coordinates...");

    for (const word of targetWords) {
        try {
            // Search API
            const searchUrl = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(word.text)}&language=ar`;
            const searchResp = await fetch(searchUrl);
            if (!searchResp.ok) {
                console.error(`Search failed for ${word.text}: ${searchResp.status} ${searchResp.statusText}`);
                continue;
            }
            const searchText = await searchResp.text();
            let searchData;
            try {
                searchData = JSON.parse(searchText);
            } catch (e) {
                console.error(`JSON parse error for ${word.text}. Body: ${searchText.substring(0, 100)}...`);
                continue;
            }

            let found = false;

            if (searchData.search && searchData.search.results) {
                // Iterate through results to find exact word match
                for (const res of searchData.search.results) {
                    // res.verse_key gives "S:A"
                    // Need to fetch words for this verse to find index
                    // Optimization: The search result might highlight the word, but we need exact index.

                    const [surah, ayah] = res.verse_key.split(':');
                    const detailsUrl = `https://api.quran.com/api/v4/verses/by_key/${res.verse_key}?words=true`;
                    const detailsResp = await fetch(detailsUrl);
                    const detailsData = await detailsResp.json();

                    if (!detailsData.verse || !detailsData.verse.words) continue;

                    const words = detailsData.verse.words.filter((w: any) => w.char_type_name !== 'end');

                    for (let i = 0; i < words.length; i++) {
                        const w = words[i];
                        // Remove diacritics for comparison if needed, but we want exact match if possible
                        // Or at least exact letters. Text format in API 'text' usually has full diacritics.

                        // Strict check
                        if (w.text === word.text) {
                            console.log(`✅ FOUND: ${word.text} (${word.translit}) -> wbw:${surah}:${ayah}:${i + 1}`);
                            found = true;
                            break;
                        }

                        // Looser check (simple text) if strict fails?
                        // Removing all diacritics from both to compare basics
                        // But we want the exact form (Fatha/Fatha/Fatha pattern for this lesson)
                    }
                    if (found) break; // Found first occurrence
                }
            }

            if (!found) {
                console.log(`❌ NOT FOUND: ${word.text} (${word.translit})`);
            }

            // Respect rate limits slightly
            await new Promise(r => setTimeout(r, 200));

        } catch (e) {
            console.error(`Error searching ${word.text}:`, e);
        }
    }
}

findCoords();
