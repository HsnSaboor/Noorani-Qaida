// Verify replacement words are NOT at end of verse
async function checkWord(surah: number, ayah: number, wordIndex: number, desc: string): Promise<void> {
  try {
    const url = `https://api.qurancdn.com/api/qdc/verses/by_key/${surah}:${ayah}?words=true`;
    const res = await fetch(url);
    if (!res.ok) { console.log(`✗ ${desc}: API error`); return; }
    const data = await res.json();
    const words = data.verse?.words?.filter((w: any) => w.char_type_name !== 'end') || [];
    const total = words.length;
    const word = words.find((w: any) => w.position === wordIndex);
    const isLast = wordIndex >= total;
    const status = isLast ? '✗ LAST WORD!' : '✓ OK';
    console.log(`${status} ${desc}: ${surah}:${ayah}:${wordIndex} (total: ${total}) -> "${word?.text_uthmani || 'N/A'}"`);
  } catch (e) {
    console.log(`✗ ${desc}: Error`);
  }
}

// Replacements for the 14 problematic entries - using verified alternatives
const replacements = [
  // Original problematic ones and their replacements:
  // [24] وَقَبَ -> replace with different word
  [2, 27, 7, 'يَقْطَعُ (yaqta) - cuts'],  // from يَقْطَعُونَ
  // [26] حَسَدَ -> replace  
  [2, 109, 3, 'حَسَدًا (hasadan) - envy'],
  // [48] كَتَمَ -> replace
  [2, 42, 3, 'تَكْتُمُ (taktumu) - conceal'],
  // [49] هَرَبَ -> replace with فَرَّ (fled)
  [9, 57, 3, 'يَفِرُّ (yafirru) - flee'],
  // [50] وَهَبَ -> replace
  [19, 5, 5, 'هَبْ (hab) - grant'],
  // [57] قَضَى -> different occurrence
  [4, 65, 9, 'تَقْضِيَ (taqdi) - judge'],
  // [67] سَدَا -> rare word, replace with similar
  [18, 94, 2, 'سَدًّا (saddan) - barrier'],
  // [75] هَجَرَ -> replace
  [4, 34, 10, 'اهْجُرُوهُنَّ (uhjuruhunna) - leave them'],
  // [82] غَدَرَ -> rare, replace
  [8, 58, 4, 'خِيَانَةً (khiyanatan) - treachery'],
  // [83] نَطَقَ -> replace
  [27, 16, 3, 'نُطْقَ (nutqa) - speech'],
  // [94] سَحَرَ -> different verse
  [7, 116, 5, 'سَحَرُوا (saharu) - bewitched'],
  // [97] سَبَقَ -> different occurrence
  [8, 59, 5, 'سَبَقُوا (sabaqu) - escaped'],
  // [103] هَدَى -> different occurrence  
  [2, 5, 4, 'هُدًى (hudan) - guidance'],
  // [107] جَعَلَ -> different occurrence
  [2, 143, 3, 'جَعَلْنَا (ja-alna) - we made'],
];

(async () => {
  console.log('Verifying replacement candidates...\n');
  for (const [s, a, w, desc] of replacements) {
    await checkWord(s as number, a as number, w as number, desc as string);
    await new Promise(r => setTimeout(r, 100));
  }
})();
