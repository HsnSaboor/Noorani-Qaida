
// Images are served from the public root
// These files must exist in your project's `public/` directory.

// =============================================================================
// THE 17 MAKHĀRIJ (ARTICULATION POINTS)
// Organized by the 5 main articulation areas
// Filenames now correctly indicate the letters shown in each image
// =============================================================================

// -----------------------------------------------------------------------------
// 1. AL-JAUF (الجوف) - Oral Cavity / Empty Space - 1 Makhraj
// -----------------------------------------------------------------------------
export const IMG_JAUF = '/makhraj_jauf_alif_waw_ya.webp';  // ا و ي (Alif, Waw, Ya with madd)

// -----------------------------------------------------------------------------
// 2. AL-HALQ (الحلق) - Throat - 3 Makhārij
// -----------------------------------------------------------------------------
export const IMG_THROAT_DEEP = '/makhraj_deep_throat_hamza_ha.webp';    // ء ه - Aqsal-ul-Halq (Deepest)
export const IMG_THROAT_MIDDLE = '/makhraj_throat_ain_ha.webp';          // ع ح - Wasat-ul-Halq (Middle)
export const IMG_THROAT_UPPER = '/makhraj_upper_throat_ghain_kha.webp';  // غ خ - Adnal-ul-Halq (Upper)

// -----------------------------------------------------------------------------
// 3. AL-LISĀN (اللسان) - Tongue - 10 Makhārij
// -----------------------------------------------------------------------------
// Back of tongue (Aqsal-ul-Lisaan)
export const IMG_TONGUE_BACK_QAF = '/makhraj_tongue_back_qaf_soft.webp';   // ق (Qaf) - Deepest back
export const IMG_TONGUE_BACK_KAAF = '/makhraj_tongue_back_kaaf_hard.webp'; // ك (Kaf) - Back

// Middle of tongue (Wasat-ul-Lisaan)
export const IMG_TONGUE_MIDDLE = '/makhraj_tongue_middle_jeem_sheen_ya.webp'; // ج ش ي (Jeem, Sheen, Ya)

// Side of tongue (Haafat-ul-Lisaan)
export const IMG_TONGUE_SIDE_DAAD = '/makhraj_tongue_side_daad.webp';      // ض (Daad)

// Tip of tongue (Taraf-ul-Lisaan)
export const IMG_TONGUE_TIP_LAAM = '/makhraj_tongue_tip_laam.webp';        // ل (Laam)
export const IMG_TONGUE_TIP_NOON = '/makhraj_tongue_tip_noon.webp';        // ن (Noon)  
export const IMG_TONGUE_TIP_RA = '/makhraj_tongue_tip_ra.webp';            // ر (Ra)
export const IMG_TONGUE_TIP_UPPER_TEETH = '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp'; // ط د ت
export const IMG_TONGUE_TIP_TEETH_EDGE = '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp';   // ظ ذ ث
// Using upper teeth image for whistle letters (ص ز س) as dedicated image not available
export const IMG_TONGUE_TIP_WHISTLE = '/makhraj_whistle_seen_suwad_zae.webp';     // ص ز س

// -----------------------------------------------------------------------------
// 4. ASH-SHAFĀTAYN (الشفتان) - Lips - 2 Makhārij
// -----------------------------------------------------------------------------
export const IMG_LIPS_FAA = '/makhraj_lips_faa.webp';           // ف (Faa) - Lower lip + upper teeth
export const IMG_LIPS_BOTH = '/makhraj_lips_ba_meem_waw.webp';  // ب م و (Ba, Meem, Waw)

// -----------------------------------------------------------------------------
// 5. AL-KHAYASHĪM (الخيشوم) - Nasal Cavity - 1 Makhraj
// -----------------------------------------------------------------------------
export const IMG_NASAL = '/makhraj_nasal_nun_meem.webp';  // Ghunnah (ن م with shaddah)

// =============================================================================
// LEGACY EXPORTS (for backward compatibility)
// =============================================================================
export const IMG_GENERAL = IMG_JAUF;
export const IMG_THROAT = IMG_THROAT_MIDDLE;
export const IMG_LIPS = IMG_LIPS_BOTH;
export const IMG_TONGUE_BACK = IMG_TONGUE_BACK_KAAF;
export const IMG_TONGUE_SIDE = IMG_TONGUE_SIDE_DAAD;
export const IMG_TONGUE_TIP = IMG_TONGUE_TIP_RA;

// =============================================================================
// LETTER-SPECIFIC MAPPINGS (for Lesson 1)
// =============================================================================
export const IMG_LETTER_ALIF = IMG_JAUF;              // ا - Jauf
export const IMG_LETTER_BA = IMG_LIPS_BOTH;           // ب - Both lips
export const IMG_LETTER_TA = IMG_TONGUE_TIP_UPPER_TEETH; // ت - Tongue tip + upper teeth
export const IMG_LETTER_THA = IMG_TONGUE_TIP_TEETH_EDGE; // ث - Tongue tip + teeth edge
export const IMG_LETTER_JEEM = IMG_TONGUE_MIDDLE;     // ج - Middle tongue
export const IMG_LETTER_HA_S = IMG_THROAT_MIDDLE;     // ح - Middle throat
export const IMG_LETTER_KHA = IMG_THROAT_UPPER;       // خ - Upper throat
export const IMG_LETTER_DAL = IMG_TONGUE_TIP_UPPER_TEETH; // د - Tongue tip + upper teeth
export const IMG_LETTER_DHAL = IMG_TONGUE_TIP_TEETH_EDGE; // ذ - Tongue tip + teeth edge
export const IMG_LETTER_RA = IMG_TONGUE_TIP_RA;       // ر - Tongue tip
export const IMG_LETTER_ZA = IMG_TONGUE_TIP_WHISTLE;  // ز - Whistle
export const IMG_LETTER_SEEN = IMG_TONGUE_TIP_WHISTLE; // س - Whistle
export const IMG_LETTER_SHEEN = IMG_TONGUE_MIDDLE;    // ش - Middle tongue
export const IMG_LETTER_SAD = IMG_TONGUE_TIP_WHISTLE; // ص - Whistle (heavy)
export const IMG_LETTER_DAD = IMG_TONGUE_SIDE_DAAD;   // ض - Side of tongue
export const IMG_LETTER_TOA = IMG_TONGUE_TIP_UPPER_TEETH; // ط - Upper teeth (heavy)
export const IMG_LETTER_ZOA = IMG_TONGUE_TIP_TEETH_EDGE;  // ظ - Teeth edge (heavy)
export const IMG_LETTER_AIN = IMG_THROAT_MIDDLE;      // ع - Middle throat
export const IMG_LETTER_GHAIN = IMG_THROAT_UPPER;     // غ - Upper throat
export const IMG_LETTER_FA = IMG_LIPS_FAA;            // ف - Lower lip + teeth
export const IMG_LETTER_QAF = IMG_TONGUE_BACK_QAF;    // ق - Back tongue (deepest)
export const IMG_LETTER_KAF = IMG_TONGUE_BACK_KAAF;   // ك - Back tongue
export const IMG_LETTER_LAM = IMG_TONGUE_TIP_LAAM;    // ل - Tongue tip
export const IMG_LETTER_MEEM = IMG_LIPS_BOTH;         // م - Both lips
export const IMG_LETTER_NOON = IMG_TONGUE_TIP_NOON;   // ن - Tongue tip
export const IMG_LETTER_WAW = IMG_LIPS_BOTH;          // و - Both lips
export const IMG_LETTER_HA_H = IMG_THROAT_DEEP;       // ه - Deep throat
export const IMG_LETTER_HAMZA = IMG_THROAT_DEEP;      // ء - Deep throat
export const IMG_LETTER_YA = IMG_TONGUE_MIDDLE;       // ي - Middle tongue

// =============================================================================
// TAJWEED VISUALS
// =============================================================================
export const IMG_TAJWEED_GHUNNAH = '/tajweed_ghunnah.png';
export const IMG_TAJWEED_QALQALA = '/tajweed_qalqala.png';
export const IMG_TAJWEED_MADD = '/tajweed_madd.png';
export const IMG_TAJWEED_NUN_SAKIN = '/tajweed_nun_sakin.png';
export const IMG_TAJWEED_MEEM_SAKIN = '/tajweed_meem_sakin.png';
export const IMG_TAJWEED_IDGHAM = '/tajweed_idgham.png';
export const IMG_TAJWEED_IKHFA = '/tajweed_ikhfa.png';

// =============================================================================
// LOGO
// =============================================================================
export const IMG_LOGO = '/logo.png';
