async function getVerseWords(s: number, a: number) {
  const url = `https://api.quran.com/api/v4/verses/by_key/${s}:${a}?words=true&word_fields=text_uthmani`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const words = data.verse?.words?.filter((w: any) => w.char_type_name === 'word') || [];
    return words.map((w: any) => ({ position: w.position, text: w.text_uthmani || '', total: words.length }));
  } catch { return []; }
}

function isClean(text: string): boolean {
  const clean = text.replace(/[ۖۗۚۛۜ\u06E5\u06E6]/g, '').trim();
  const fathaCount = (clean.match(/\u064E/g) || []).length;
  if (fathaCount !== 3) return false;
  if (text.includes('ۖ') || text.includes('ۗ') || text.includes('ۚ')) return false;
  if (clean.includes('\u0650') || clean.includes('\u064F') || clean.includes('\u0652') || clean.includes('\u0651')) return false;
  const letters = clean.replace(/[\u064B-\u065F\u0670]/g, '');
  return letters.length === 3;
}

const existing = new Set([
  'خَلَقَ','جَعَلَ','ضَرَبَ','فَعَلَ','نَزَلَ','ذَهَبَ','دَخَلَ','كَفَرَ','صَبَرَ','رَفَعَ',
  'شَرَحَ','وَقَعَ','صَدَقَ','غَفَرَ','رَجَعَ','بَدَأَ','طَبَعَ','سَبَقَ','حَكَمَ','شَكَرَ',
  'تَرَكَ','وَعَدَ','فَتَحَ','حَمَلَ','أَمَرَ','سَأَلَ','كَسَبَ','بَلَغَ','قَتَلَ','ظَلَمَ',
  'نَظَرَ','كَتَبَ','عَمَلَ','أَكَلَ','وَجَدَ','أَخَذَ','جَمَعَ','حَضَرَ','سَكَنَ','صَلَحَ',
  'هَلَكَ','فَصَلَ','بَعَثَ','خَتَمَ','حَذَرَ','نَكَحَ','عَشَرَ','نَبَأَ','ظَهَرَ','بَطَنَ',
  'قَدَمَ','عَدَدَ','جَرَمَ','أَحَدَ','وَهَبَ','ذَرَأَ','مَكَرَ','غَضَبَ','عَرَضَ','مَطَرَ',
  'مَرَجَ','وَرَدَ','مَثَلَ','شَجَرَ','يَدَكَ','أَفَلَ','فَطَرَ','مَعَكَ','سَلَفَ','نَكَصَ','سَرَقَ'
]);

const found: [string, number, number, number][] = [];

// Search specific short surahs more thoroughly
(async () => {
  const surahs = [36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85];
  
  for (const s of surahs) {
    if (found.length >= 20) break;
    for (let a = 1; a <= 50; a++) {
      const words = await getVerseWords(s, a);
      if (words.length === 0) break;
      for (const w of words) {
        if (w.position < w.total && isClean(w.text)) {
          const clean = w.text.replace(/[ۖۗۚۛۜ]/g, '').trim();
          if (!existing.has(clean)) {
            existing.add(clean);
            found.push([clean, s, a, w.position]);
            console.log(`✓ [${found.length}] "${clean}" at ${s}:${a}:${w.position}`);
          }
        }
      }
      await new Promise(r => setTimeout(r, 20));
    }
  }
  
  console.log(`\nFound ${found.length} more:\n`);
  for (const [w, s, a, p] of found) console.log(`['${w}', 'Trans', ${s}, ${a}, ${p}],`);
})();
