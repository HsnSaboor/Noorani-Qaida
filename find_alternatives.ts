
async function fetchVerse(surah: number, ayah: number) {
    try {
        const url = `https://api.qurancdn.com/api/qdc/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.verse;
    } catch { return null; }
}

async function checkCandidates() {
    console.log("Checking Candidates...");

    const checks = [
        // Qareebun (قَرِيبٌ)
        { name: 'Qareebun', s: 11, a: 61, w_guess: 3 }, // Inna (1) Rabbi (2) Qareebun (3)?
        { name: 'Qareebun', s: 2, a: 186, w_guess: 6 }, // Current
        { name: 'Qareebun', s: 7, a: 56, w_guess: 9 },

        // Al-Kafireena (ٱلْكَٰفِرِينَ)
        { name: 'Al-Kafireena', s: 3, a: 28, w_guess: 4 }, // Current
        { name: 'Al-Kafireena', s: 4, a: 144, w_guess: 7 },
        { name: 'Al-Kafireena', s: 4, a: 139, w_guess: 6 },
        { name: 'Al-Kafireena', s: 5, a: 54, w_guess: 15 },

        // Al-Mu'minina (ٱلْمُؤْمِنِينَ)
        { name: 'Al-Mu-minina', s: 4, a: 146, w_guess: 12 }, // Current
        { name: 'Al-Mu-minina', s: 85, a: 10, w_guess: 4 }, // "fatanu al-mu'minina"
        { name: 'Al-Mu-minina', s: 33, a: 35, w_guess: 4 },

        // Al-Mushrikeena (ٱلْمُشْرِكِينَ)
        { name: 'Al-Mushrikeena', s: 9, a: 6, w_guess: 4 }, // Current
        { name: 'Al-Mushrikeena', s: 9, a: 36, w_guess: 10 },
        { name: 'Al-Mushrikeena', s: 15, a: 94, w_guess: 5 },
        { name: 'Al-Mushrikeena', s: 9, a: 1, w_guess: 12 }, // minal-mushrikeen

        // Al-Qanitina (ٱلْقَٰنِتِينَ)
        { name: 'Al-Qanitina', s: 33, a: 35, w_guess: 6 }, // Wal-Qanitina
        { name: 'Al-Qanitina', s: 66, a: 12, w_guess: 15 },
        { name: 'Al-Qanitina', s: 3, a: 17, w_guess: 4 }
    ];

    for (const c of checks) {
        const verse = await fetchVerse(c.s, c.a);
        if (verse) {
            // Try guessed word and neighbors
            for (let offset = -1; offset <= 1; offset++) {
                const pos = c.w_guess + offset;
                if (pos < 1) continue;
                const w = verse.words.find((w: any) => w.position === pos);
                if (w) {
                    console.log(`[${c.name}] ${c.s}:${c.a}:${pos} -> ${w.text_uthmani}`);
                }
            }
        }
        await new Promise(r => setTimeout(r, 100));
    }
}

checkCandidates();
