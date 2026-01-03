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
  'مَرَجَ','وَرَدَ'
]);

const found: [string, number, number, number][] = [];

// Check specific verses known to have فَعَلَ pattern verbs
const verses: [number, number][] = [
  [3,59],[4,65],[5,28],[6,76],[6,79],[7,88],[8,38],[8,48],[12,77],
  [13,17],[14,45],[15,28],[16,40],[17,23],[18,32],[19,21],[20,77],
  [21,30],[22,63],[23,12],[24,35],[25,48],[26,18],[27,60],[28,38],
  [29,14],[30,21],[31,10],[32,7],[33,9],[34,10],[35,9],[36,40],
  [37,6],[38,71],[39,6],[40,67],[41,11],[42,11],[43,10],[44,38],
  [46,3],[48,24],[50,6],[51,47],[54,11],[55,3],[56,63],[57,4],
  [59,2],[67,3],[71,14],[72,17],[74,11],[75,38],[76,2],[78,6],
  [79,27],[80,19],[82,7],[84,4],[86,5],[87,2],[90,4],[91,7],
  [95,4],[96,2],[112,3],[2,21],[2,29],[2,117],[2,164],[2,228],
  [3,47],[3,49],[4,1],[6,2],[6,98],[7,11],[7,54],[10,3],[11,7],
  [15,26],[16,4],[19,9],[21,33],[22,5],[23,14],[25,2],[32,4],
  [35,11],[36,77],[37,11],[38,76],[39,62],[40,64],[41,21],[42,49],
  [50,16],[53,32],[56,59],[64,3],[67,14],[71,17],[76,28],[77,20],
  [80,18],[82,6],[86,6],[96,1],[2,60],[2,72],[3,37],[4,19],
  [5,95],[6,138],[7,160],[11,37],[12,31],[14,32],[16,65],[17,1],
  [18,17],[19,25],[20,12],[21,78],[22,36],[23,27],[24,43],[25,53],
];

(async () => {
  console.log('Searching specific verses...\n');
  
  for (const [s, a] of verses) {
    if (found.length >= 30) break;
    const words = await getVerseWords(s, a);
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
    await new Promise(r => setTimeout(r, 25));
  }
  
  console.log(`\n\nFound ${found.length} new words:\n`);
  for (const [w, s, a, p] of found) {
    console.log(`['${w}', 'Trans', ${s}, ${a}, ${p}],`);
  }
})();
