/**
 * Lesson Registry
 * 
 * Master list of all 80 lessons organized by phase.
 * This is the authoritative source for lesson metadata in the app.
 */

// Simple lesson list item for the registry (not the full Lesson type)
export interface LessonListItem {
    id: string;
    title: string;
    subtitle: string;
    sectionId: string;
}

export const allLessons: LessonListItem[] = [
    // ==========================================
    // PHASE 1: THE ALPHABET (Lessons 1-10)
    // ==========================================
    { id: "1", title: "The Alphabet", subtitle: "Arabic Alphabet Recognition.", sectionId: "phase1" },
    { id: "2", title: "Letter Shapes", subtitle: "Initial, Medial, Final shapes.", sectionId: "phase1" },
    { id: "3", title: "Similar Letters", subtitle: "Differentiation of look-alikes.", sectionId: "phase1" },
    { id: "4", title: "Heavy Letters", subtitle: "Introduction to heavy letters.", sectionId: "phase1" },
    { id: "5", title: "Makharij (Sounds)", subtitle: "Proper articulation points.", sectionId: "phase1" },
    { id: "6", title: "Fatha", subtitle: "Short vowel 'A'.", sectionId: "phase1" },
    { id: "7", title: "Kasra", subtitle: "Short vowel 'E'.", sectionId: "phase1" },
    { id: "8", title: "Damma", subtitle: "Short vowel 'U'.", sectionId: "phase1" },
    { id: "9", title: "Mixed Harakat", subtitle: "Practice vowels.", sectionId: "phase1" },
    { id: "10", title: "Full Drill (A-I-U)", subtitle: "Alphabet with vowels.", sectionId: "phase1" },

    // ==========================================
    // PHASE 2: FOUNDATIONS (Lessons 11-24)
    // ==========================================
    { id: "11", title: "Murakkabat", subtitle: "Joining letters.", sectionId: "phase2" },
    { id: "12", title: "Tanween Fath", subtitle: "Double Fatha.", sectionId: "phase2" },
    { id: "13", title: "Tanween Kasr", subtitle: "Double Kasra.", sectionId: "phase2" },
    { id: "14", title: "Tanween Damm", subtitle: "Double Damma.", sectionId: "phase2" },
    { id: "15", title: "Standing Fatha", subtitle: "Long A.", sectionId: "phase2" },
    { id: "16", title: "Standing Kasra", subtitle: "Long E.", sectionId: "phase2" },
    { id: "17", title: "Standing Damma", subtitle: "Long U.", sectionId: "phase2" },
    { id: "18", title: "Madd Asli", subtitle: "Natural Madd.", sectionId: "phase2" },
    { id: "19", title: "Sukoon", subtitle: "Jazm.", sectionId: "phase2" },
    { id: "20", title: "Sukoon Practice", subtitle: "Practice.", sectionId: "phase2" },
    { id: "21", title: "Qalqala", subtitle: "Echo sound.", sectionId: "phase2" },
    { id: "22", title: "Shaddah", subtitle: "Emphasis.", sectionId: "phase2" },
    { id: "23", title: "Shaddah & Harakat", subtitle: "Shaddah+Vowels.", sectionId: "phase2" },
    { id: "24", title: "Shaddah & Tanween", subtitle: "Shaddah+Tanween.", sectionId: "phase2" },

    // ==========================================
    // PHASE 3: TAJWEED RULES (Lessons 25-48)
    // ==========================================
    { id: "25", title: "Nun Sakin Intro", subtitle: "Rules Intro.", sectionId: "phase3" },
    { id: "26", title: "Izhar", subtitle: "Clear.", sectionId: "phase3" },
    { id: "27", title: "Idgham", subtitle: "Merge.", sectionId: "phase3" },
    { id: "28", title: "Iqlab", subtitle: "Change.", sectionId: "phase3" },
    { id: "29", title: "Ikhfa", subtitle: "Hide.", sectionId: "phase3" },
    { id: "30", title: "Meem Sakin", subtitle: "Meem Rules.", sectionId: "phase3" },
    { id: "31", title: "Muqatta'at", subtitle: "Disjoined Letters.", sectionId: "phase3" },
    { id: "32", title: "Madd Far'i", subtitle: "Derived Madd.", sectionId: "phase3" },
    { id: "33", title: "Madd Muttasil", subtitle: "Connected.", sectionId: "phase3" },
    { id: "34", title: "Madd Munfasil", subtitle: "Detached.", sectionId: "phase3" },
    { id: "35", title: "Madd Lazim", subtitle: "Compulsory.", sectionId: "phase3" },
    { id: "36", title: "Madd Arid", subtitle: "Temporary.", sectionId: "phase3" },
    { id: "37", title: "Madd Lin", subtitle: "Leen.", sectionId: "phase3" },
    { id: "38", title: "Ghunnah Rules", subtitle: "Nasal.", sectionId: "phase3" },
    { id: "39", title: "Tafkheem", subtitle: "Heavy/Light.", sectionId: "phase3" },
    { id: "40", title: "Salah (Namaz)", subtitle: "Prayer.", sectionId: "phase3" },
    { id: "41", title: "Ayat-ul-Kursi", subtitle: "The Greatest Verse.", sectionId: "phase3" },
    { id: "42", title: "Dua-e-Qanoot", subtitle: "Witr Dua.", sectionId: "phase3" },
    { id: "43", title: "Sun & Moon", subtitle: "Al-Lam Rules.", sectionId: "phase3" },
    { id: "44", title: "Hamza Rules", subtitle: "Wasl & Qat.", sectionId: "phase3" },
    { id: "45", title: "Silent Letters", subtitle: "Silent letters.", sectionId: "phase3" },
    { id: "46", title: "Waqf Signs", subtitle: "Punctuation.", sectionId: "phase3" },
    { id: "47", title: "Meaning Stops", subtitle: "Meaning stops.", sectionId: "phase3" },
    { id: "48", title: "General Review", subtitle: "Mixed Rules Practice.", sectionId: "phase3" },

    // ==========================================
    // PHASE 4: MASTERY & FLUENCY (Lessons 49-59)
    // ==========================================
    { id: "49", title: "Sifat: Opposites", subtitle: "Hams & Jahr.", sectionId: "phase4" },
    { id: "50", title: "Sifat: Unique", subtitle: "Safir & Leen.", sectionId: "phase4" },
    { id: "51", title: "Idgham Mutajanisayn", subtitle: "Twin Merge.", sectionId: "phase4" },
    { id: "52", title: "Idgham Mutaqaribayn", subtitle: "Close Merge.", sectionId: "phase4" },
    { id: "53", title: "Iltaqa Sakinayn", subtitle: "Meeting Sukoons.", sectionId: "phase4" },
    { id: "54", title: "Nabara", subtitle: "Pressure/Accent.", sectionId: "phase4" },
    { id: "55", title: "The 4 Sakts", subtitle: "Breathless Pauses.", sectionId: "phase4" },
    { id: "56", title: "Gharib I", subtitle: "Imala & Tasheel.", sectionId: "phase4" },
    { id: "57", title: "Gharib II", subtitle: "Ishmam & Naql.", sectionId: "phase4" },
    { id: "58", title: "Advanced Waqf", subtitle: "Rawm & Ishmam.", sectionId: "phase4" },
    { id: "59", title: "The Khatam", subtitle: "Final Seal.", sectionId: "phase4" },

    // ==========================================
    // PHASE 5: THE SHORT SURAHS (Lessons 60-80)
    // ==========================================
    { id: "60", title: "Surah Al-Fatiha", subtitle: "The Opening.", sectionId: "phase5" },
    { id: "61", title: "Surah At-Tin", subtitle: "The Fig.", sectionId: "phase5" },
    { id: "62", title: "Surah Al-Alaq", subtitle: "The Clot.", sectionId: "phase5" },
    { id: "63", title: "Surah Al-Qadr", subtitle: "The Power.", sectionId: "phase5" },
    { id: "64", title: "Surah Al-Bayyinah", subtitle: "The Clear Proof.", sectionId: "phase5" },
    { id: "65", title: "Surah Az-Zalzalah", subtitle: "The Earthquake.", sectionId: "phase5" },
    { id: "66", title: "Surah Al-Adiyat", subtitle: "The Courser.", sectionId: "phase5" },
    { id: "67", title: "Surah Al-Qari'ah", subtitle: "The Calamity.", sectionId: "phase5" },
    { id: "68", title: "Surah At-Takathur", subtitle: "The Rivalry.", sectionId: "phase5" },
    { id: "69", title: "Surah Al-Asr", subtitle: "The Declining Day.", sectionId: "phase5" },
    { id: "70", title: "Surah Al-Humazah", subtitle: "The Traducer.", sectionId: "phase5" },
    { id: "71", title: "Surah Al-Fil", subtitle: "The Elephant.", sectionId: "phase5" },
    { id: "72", title: "Surah Quraysh", subtitle: "Quraysh.", sectionId: "phase5" },
    { id: "73", title: "Surah Al-Ma'un", subtitle: "Small Kindnesses.", sectionId: "phase5" },
    { id: "74", title: "Surah Al-Kawthar", subtitle: "Abundance.", sectionId: "phase5" },
    { id: "75", title: "Surah Al-Kafirun", subtitle: "The Disbelievers.", sectionId: "phase5" },
    { id: "76", title: "Surah An-Nasr", subtitle: "Divine Support.", sectionId: "phase5" },
    { id: "77", title: "Surah Al-Masad", subtitle: "The Palm Fiber.", sectionId: "phase5" },
    { id: "78", title: "Surah Al-Ikhlas", subtitle: "Sincerity.", sectionId: "phase5" },
    { id: "79", title: "Surah Al-Falaq", subtitle: "The Daybreak.", sectionId: "phase5" },
    { id: "80", title: "Surah An-Nas", subtitle: "Mankind.", sectionId: "phase5" },
];

// Phase metadata for section headers
export const PHASES = {
    phase1: { name: "Phase 1: The Alphabet", range: [1, 10], description: "Letters, Shapes & Vowels" },
    phase2: { name: "Phase 2: Foundations", range: [11, 24], description: "Connecting Words & Sukoon" },
    phase3: { name: "Phase 3: Tajweed Rules", range: [25, 48], description: "Mastering the Rules" },
    phase4: { name: "Phase 4: Mastery & Fluency", range: [49, 59], description: "Application & Recitation" },
    phase5: { name: "Phase 5: The Short Surahs", range: [60, 80], description: "Surahs & Duas" },
};

// Helper functions
export function getLessonById(id: string): LessonListItem | undefined {
    return allLessons.find(l => l.id === id);
}

export function getLessonsByPhase(phase: string): LessonListItem[] {
    return allLessons.filter(l => l.sectionId === phase);
}

export function getPhaseForLesson(lessonId: number): string {
    if (lessonId <= 10) return 'phase1';
    if (lessonId <= 24) return 'phase2';
    if (lessonId <= 48) return 'phase3';
    if (lessonId <= 59) return 'phase4';
    return 'phase5';
}
