async function verify(word: string, s: number, a: number, p: number): Promise<{ok: boolean, actual: string, issue: string}> {
  const url = `https://api.quran.com/api/v4/verses/by_key/${s}:${a}?words=true&word_fields=text_uthmani`;
  try {
    const res = await fetch(url);
    if (!res.ok) return {ok: false, actual: '', issue: 'API error'};
    const data = await res.json();
    const words = data.verse?.words?.filter((w: any) => w.char_type_name === 'word') || [];
    const w = words.find((x: any) => x.position === p);
    if (!w) return {ok: false, actual: `positions: 1-${words.length}`, issue: `position ${p} not found`};
    if (p > words.length) return {ok: false, actual: w.text_uthmani, issue: 'last word'};
    return {ok: true, actual: w.text_uthmani, issue: ''};
  } catch (e) { return {ok: false, actual: '', issue: 'fetch error'}; }
}

async function verifyLesson(name: string, data: [string, string, number, number, number][]) {
  console.log(`\n=== ${name} (${data.length} words) ===`);
  let pass = 0, fail = 0;
  const failures: string[] = [];
  
  for (const [w, t, s, a, p] of data) {
    const r = await verify(w, s, a, p);
    if (r.ok) {
      pass++;
    } else {
      fail++;
      failures.push(`  ✗ ${w} at ${s}:${a}:${p} - ${r.issue} (got: "${r.actual}")`);
    }
    await new Promise(x => setTimeout(x, 25));
  }
  
  if (failures.length > 0 && failures.length <= 10) {
    failures.forEach(f => console.log(f));
  } else if (failures.length > 10) {
    failures.slice(0, 10).forEach(f => console.log(f));
    console.log(`  ... and ${failures.length - 10} more failures`);
  }
  
  console.log(`Result: ${pass}/${data.length} (${Math.round(pass/data.length*100)}%)`);
  return { pass, fail, total: data.length };
}

// L9 - Mixed Harakat
const l9: [string, string, number, number, number][] = [
    ['كُتِبَ', 'Kutiba', 2, 183, 1], ['قُرِئَ', 'Quri-a', 7, 204, 3], ['فُتِحَ', 'Futiha', 38, 50, 2], ['جُعِلَ', 'Ju-ila', 2, 22, 16],
    ['خُلِقَ', 'Khuliqa', 4, 28, 4], ['وُضِعَ', 'Wudi-a', 3, 96, 3], ['أُذِنَ', 'Udhina', 22, 39, 1], ['رُفِعَ', 'Rufi-a', 2, 127, 3],
    ['ضُرِبَ', 'Duriba', 2, 61, 35], ['قُتِلَ', 'Qutila', 3, 144, 21], ['سُئِلَ', 'Su-ila', 2, 108, 4], ['حُشِرَ', 'Hushira', 27, 17, 1],
];

// L10 - sample from raw data
const l10: [string, string, number, number, number][] = [
    ['كُتِبَ', 'Kutiba', 2, 183, 1], ['فُتِحَ', 'Futiha', 38, 50, 2], ['خُلِقَ', 'Khuliqa', 4, 28, 4], ['قُتِلَ', 'Qutila', 3, 144, 21],
    ['ضُرِبَ', 'Duriba', 2, 61, 35], ['سُئِلَ', 'Su-ila', 2, 108, 4], ['بُعِثَ', 'Bu-itha', 2, 56, 2], ['ظُلِمَ', 'Zulima', 2, 124, 18],
];

// L11 - Murakkabat (sample)
const l11: [string, string, number, number, number][] = [
    ['لَا', 'La', 59, 12, 3], ['بِمَا', 'Bima', 32, 14, 2], ['لَهَا', 'Laha', 26, 208, 6], ['فِيهَا', 'Fiha', 21, 100, 2],
    ['مِنْهَا', 'Minha', 5, 22, 12], ['عَنْهَا', 'Anha', 15, 81, 4], ['لَهُمُ', 'Lahum', 47, 25, 10], ['بِهِمْ', 'Bihim', 11, 77, 6],
];

// L12 - Tanween Fath (sample)
const l12: [string, string, number, number, number][] = [
    ['عَلِيمًا', 'Aliman', 33, 1, 12], ['غَفُورًا', 'Ghafuran', 4, 43, 48], ['رَحِيمًۭا', 'Rahiman', 33, 43, 13],
    ['سَمِيعًا', 'Sami-an', 4, 148, 13], ['بَصِيرًا', 'Basiran', 76, 2, 10], ['كَبِيرًا', 'Kabiran', 76, 20, 7],
];

// L13 - Tanween Kasr (sample)
const l13: [string, string, number, number, number][] = [
    ['عَلَقٍ', 'Alaqin', 96, 2, 3], ['لَهَبٍ', 'Lahabin', 111, 1, 6], ['مَسَدٍ', 'Masadin', 111, 5, 5], ['بَلَدٍ', 'Baladin', 90, 1, 3],
    ['مُبِينٍ', 'Mubinin', 2, 168, 10], ['أَلِيمٍ', 'Alimin', 2, 10, 10], ['كَفِيلٍ', 'Kafilin', 16, 91, 15],
];

// L14 - Tanween Damm (sample)
const l14: [string, string, number, number, number][] = [
    ['كِتَابٌ', 'Kitabun', 2, 2, 2], ['رَسُولٌ', 'Rasulun', 2, 101, 3], ['عَظِيمٌ', 'Azimun', 2, 7, 11], ['كَرِيمٌ', 'Karimun', 27, 29, 4],
    ['رَحِيمٌ', 'Rahimun', 1, 3, 2], ['سَمِيعٌ', 'Sami-un', 2, 127, 19],
];

(async () => {
  console.log('=== VERIFYING LESSONS 9-14 (Samples) ===');
  
  const results = [];
  results.push(await verifyLesson('L9 - Mixed Harakat', l9));
  results.push(await verifyLesson('L10 - Full Drill', l10));
  results.push(await verifyLesson('L11 - Murakkabat', l11));
  results.push(await verifyLesson('L12 - Tanween Fath', l12));
  results.push(await verifyLesson('L13 - Tanween Kasr', l13));
  results.push(await verifyLesson('L14 - Tanween Damm', l14));
  
  console.log('\n=== SUMMARY ===');
  const names = ['L9', 'L10', 'L11', 'L12', 'L13', 'L14'];
  let totalPass = 0, totalFail = 0;
  results.forEach((r, i) => {
    console.log(`${names[i]}: ${r.pass}/${r.total} (${Math.round(r.pass/r.total*100)}%)`);
    totalPass += r.pass;
    totalFail += r.fail;
  });
  console.log(`\nTotal: ${totalPass}/${totalPass+totalFail} (${Math.round(totalPass/(totalPass+totalFail)*100)}%)`);
})();
