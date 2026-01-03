
import { file, write } from 'bun';

const duas = [
    // L31: Rabbana 1-10
    { id: 'r1', s: 2, a: 201, title: 'Rabbana Atina' },
    { id: 'r2', s: 2, a: 250, title: 'Rabbana Afrigh' },
    { id: 'r3', s: 2, a: 286, title: 'Rabbana La Tu-akhidhna' },
    { id: 'r4', s: 3, a: 8, title: 'Rabbana La Tuzigh' },
    { id: 'r5', s: 3, a: 9, title: 'Rabbana Innaka Jami' },
    { id: 'r6', s: 3, a: 16, title: 'Rabbana Innana Amanna' },
    { id: 'r7', s: 3, a: 53, title: 'Rabbana Amanna Bima' },
    { id: 'r8', s: 3, a: 147, title: 'Rabbana Ghfir Lana' },
    { id: 'r9', s: 3, a: 191, title: 'Rabbana Ma Khalaqta' },
    { id: 'r10', s: 3, a: 192, title: 'Rabbana Innaka Man' },

    // L41: Baqarah End
    { id: 'b1', s: 2, a: 285, title: 'Amanar Rasul' },
    { id: 'b2', s: 2, a: 286, title: 'La Yukallifu' },
];

async function fetchVerseDetails(item: any) {
    const url = `https://api.quran.com/api/v4/verses/by_key/${item.s}:${item.a}?language=en&words=true&word_fields=text_uthmani`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const words = data.verse.words.filter((w: any) => w.char_type_name !== 'end'); // Exclude end marker

        // Construct the item structure for advanced.ts
        // We need: Arabic Text (Full), Words Array (Text, Audio, Trans?)
        const fullText = words.map((w: any) => w.text_uthmani).join(' ');

        // Generate words array string
        // We will output a Code String to paste into the file.
        // mkLocalItem can be used if we modify it to accept simple word list?
        // Or we just output the raw object structure for `items`.

        const wordsCode = words.map((w: any, i: number) => {
            const wInd = i + 1; // 1-based index in verse
            const audioUrl = `https://audio.qurancdn.com/wbw/${String(item.s).padStart(3, '0')}_${String(item.a).padStart(3, '0')}_${String(wInd).padStart(3, '0')}.mp3`;
            return `{ text: "${w.text_uthmani}", audio: "${audioUrl}", trans: "${w.transliteration?.text || ''}" }`;
        }).join(', ');

        console.log(`// ${item.title}`);
        console.log(`const ${item.id}_words = [${wordsCode}];`);
        console.log(`// Use this array to construct the LessonItem`);
        console.log(" ");

    } catch (e) {
        console.error(`Error ${item.id}:`, e);
    }
}

async function run() {
    console.log("// --- Generated Dua Data ---");
    for (const d of duas) {
        await fetchVerseDetails(d);
        await new Promise(r => setTimeout(r, 200));
    }
}

run();
