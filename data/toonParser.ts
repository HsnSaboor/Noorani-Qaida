/**
 * Toon Data Utilities
 * 
 * Converts toon data to LessonItem[] arrays for use in lessons.
 * Import from toonData.ts which contains all bundled lesson content.
 */

import { LessonItem } from '../types';
import { mkWBWAudio } from './utils';
import { ToonItem, getToonData } from './toonData';

export type { ToonItem };
export { getToonData };

// Audio and Makhraj mapping for Lesson 1 letters
// Maps item ID or Arabic letter to audio filename and makhraj image
const LESSON1_AUDIO_MAP: Record<string, { audio: string; makhraj?: string }> = {
    // By ID
    'l1_alif': { audio: 'alif', makhraj: '/makhraj_jauf_alif_waw_ya.webp' },
    'l1_ba': { audio: 'ba', makhraj: '/makhraj_lips_ba_meem_waw.webp' },
    'l1_ta': { audio: 'ta', makhraj: '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp' },
    'l1_tha': { audio: 'tha', makhraj: '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp' },
    'l1_jeem': { audio: 'jeem', makhraj: '/makhraj_tongue_middle_jeem_sheen_ya.webp' },
    'l1_ha_h': { audio: 'ha_h', makhraj: '/makhraj_throat_ain_ha.webp' },
    'l1_kha': { audio: 'kha', makhraj: '/makhraj_upper_throat_ghain_kha.webp' },
    'l1_dal': { audio: 'dal', makhraj: '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp' },
    'l1_dhal': { audio: 'dhal', makhraj: '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp' },
    'l1_ra': { audio: 'ra', makhraj: '/makhraj_tongue_tip_ra.webp' },
    'l1_za': { audio: 'za', makhraj: '/makhraj_whistle_seen_suwad_zae.webp' },
    'l1_seen': { audio: 'seen', makhraj: '/makhraj_whistle_seen_suwad_zae.webp' },
    'l1_sheen': { audio: 'sheen', makhraj: '/makhraj_tongue_middle_jeem_sheen_ya.webp' },
    'l1_sad': { audio: 'sad', makhraj: '/makhraj_whistle_seen_suwad_zae.webp' },
    'l1_dad': { audio: 'dad', makhraj: '/makhraj_tongue_side_daad.webp' },
    'l1_toa': { audio: 'toa', makhraj: '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp' },
    'l1_zoa': { audio: 'zoa', makhraj: '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp' },
    'l1_ain': { audio: 'ain', makhraj: '/makhraj_throat_ain_ha.webp' },
    'l1_ghain': { audio: 'ghain', makhraj: '/makhraj_upper_throat_ghain_kha.webp' },
    'l1_fa': { audio: 'fa', makhraj: '/makhraj_lips_faa.webp' },
    'l1_qaf': { audio: 'qaf', makhraj: '/makhraj_tongue_back_qaf_soft.webp' },
    'l1_kaf': { audio: 'kaf', makhraj: '/makhraj_tongue_back_kaaf_hard.webp' },
    'l1_lam': { audio: 'lam', makhraj: '/makhraj_tongue_tip_laam.webp' },
    'l1_meem': { audio: 'meem', makhraj: '/makhraj_lips_ba_meem_waw.webp' },
    'l1_noon': { audio: 'noon', makhraj: '/makhraj_tongue_tip_noon.webp' },
    'l1_waw': { audio: 'waw', makhraj: '/makhraj_lips_ba_meem_waw.webp' },
    'l1_ha_s': { audio: 'ha_s', makhraj: '/makhraj_deep_throat_hamza_ha.webp' },
    'l1_hamza': { audio: 'hamza', makhraj: '/makhraj_deep_throat_hamza_ha.webp' },
    'l1_ya': { audio: 'ya', makhraj: '/makhraj_tongue_middle_jeem_sheen_ya.webp' },
    // By Arabic letter (fallback)
    'ا': { audio: 'alif', makhraj: '/makhraj_jauf_alif_waw_ya.webp' },
    'ب': { audio: 'ba', makhraj: '/makhraj_lips_ba_meem_waw.webp' },
    'ت': { audio: 'ta', makhraj: '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp' },
    'ث': { audio: 'tha', makhraj: '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp' },
    'ج': { audio: 'jeem', makhraj: '/makhraj_tongue_middle_jeem_sheen_ya.webp' },
    'ح': { audio: 'ha_h', makhraj: '/makhraj_throat_ain_ha.webp' },
    'خ': { audio: 'kha', makhraj: '/makhraj_upper_throat_ghain_kha.webp' },
    'د': { audio: 'dal', makhraj: '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp' },
    'ذ': { audio: 'dhal', makhraj: '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp' },
    'ر': { audio: 'ra', makhraj: '/makhraj_tongue_tip_ra.webp' },
    'ز': { audio: 'za', makhraj: '/makhraj_whistle_seen_suwad_zae.webp' },
    'س': { audio: 'seen', makhraj: '/makhraj_whistle_seen_suwad_zae.webp' },
    'ش': { audio: 'sheen', makhraj: '/makhraj_tongue_middle_jeem_sheen_ya.webp' },
    'ص': { audio: 'sad', makhraj: '/makhraj_whistle_seen_suwad_zae.webp' },
    'ض': { audio: 'dad', makhraj: '/makhraj_tongue_side_daad.webp' },
    'ط': { audio: 'toa', makhraj: '/makhraj_tongue_tip_upper_teeth_ta_daal_tha.webp' },
    'ظ': { audio: 'zoa', makhraj: '/makhraj_tongue_tip_teeth_edge_za_dhal_tha.webp' },
    'ع': { audio: 'ain', makhraj: '/makhraj_throat_ain_ha.webp' },
    'غ': { audio: 'ghain', makhraj: '/makhraj_upper_throat_ghain_kha.webp' },
    'ف': { audio: 'fa', makhraj: '/makhraj_lips_faa.webp' },
    'ق': { audio: 'qaf', makhraj: '/makhraj_tongue_back_qaf_soft.webp' },
    'ك': { audio: 'kaf', makhraj: '/makhraj_tongue_back_kaaf_hard.webp' },
    'ل': { audio: 'lam', makhraj: '/makhraj_tongue_tip_laam.webp' },
    'م': { audio: 'meem', makhraj: '/makhraj_lips_ba_meem_waw.webp' },
    'ن': { audio: 'noon', makhraj: '/makhraj_tongue_tip_noon.webp' },
    'و': { audio: 'waw', makhraj: '/makhraj_lips_ba_meem_waw.webp' },
    'ه': { audio: 'ha_s', makhraj: '/makhraj_deep_throat_hamza_ha.webp' },
    'ء': { audio: 'hamza', makhraj: '/makhraj_deep_throat_hamza_ha.webp' },
    'ي': { audio: 'ya', makhraj: '/makhraj_tongue_middle_jeem_sheen_ya.webp' },
};

/**
 * Extract the first base Arabic letter from text (removing diacritics and connectors)
 */
function extractBaseLetters(text: string): string[] {
    // Remove Arabic diacritics and common marks
    const cleaned = text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '');
    // Split on spaces or 'vs' for comparison items
    const parts = cleaned.split(/\s+vs\s+|\s+/);
    // Get unique base letters (single Arabic characters)
    return parts.filter(p => p.length === 1 || (p.length === 2 && p.includes('ـ'))).map(p => p.replace('ـ', ''));
}

/**
 * Convert ToonItem[] to LessonItem[] for use in lesson files
 */
export function toonToLessonItems(toonItems: ToonItem[], lessonId: number): LessonItem[] {
    return toonItems.map(item => {
        const lessonItem: LessonItem = {
            id: item.id.startsWith('l') ? item.id : `l${lessonId}_${item.id}`,
            type: item.type || 'single',
            text_ar: item.text_ar,
            transliteration: item.transliteration,
        };

        // Special handling for Lessons 1-3: Local audio + Makhraj images
        if (lessonId === 1) {
            const audioInfo = LESSON1_AUDIO_MAP[item.id] || LESSON1_AUDIO_MAP[item.text_ar];
            if (audioInfo) {
                lessonItem.audio = { main: `/audio/lesson1/${audioInfo.audio}.mp3` };
                lessonItem.words = [{
                    text: item.text_ar,
                    audio: `/audio/lesson1/${audioInfo.audio}.mp3`,
                    transliteration: item.transliteration
                }];
                if (audioInfo.makhraj) {
                    lessonItem.makhraj = audioInfo.makhraj;
                }
            }
        }

        // Lesson 2: Letter shapes (Initial, Medial, Final) AND two-letter sequences
        if (lessonId === 2) {
            // Remove connector symbols ـ
            const cleanText = item.text_ar.replace(/ـ/g, '');

            // For sequences (two-letter combinations like "رم"), play BOTH letters
            if (item.type === 'sequence' && cleanText.length >= 2) {
                const letters = cleanText.split('').filter(c => /[\u0600-\u06FF]/.test(c));
                lessonItem.words = letters.map(letter => {
                    const letterAudio = LESSON1_AUDIO_MAP[letter];
                    return {
                        text: letter,
                        audio: letterAudio ? `/audio/lesson1/${letterAudio.audio}.mp3` : '',
                        transliteration: letterAudio?.audio || letter
                    };
                }).filter(w => w.audio);

                // Set main audio to first letter (for fallback)
                const firstLetter = letters[0];
                const audioInfo = LESSON1_AUDIO_MAP[firstLetter];
                if (audioInfo) {
                    lessonItem.audio = { main: `/audio/lesson1/${audioInfo.audio}.mp3` };
                    if (audioInfo.makhraj) {
                        lessonItem.makhraj = audioInfo.makhraj;
                    }
                }
            } else {
                // Single letter (initial, medial, final forms) - use base letter audio
                const baseLetter = cleanText.charAt(0);
                const audioInfo = LESSON1_AUDIO_MAP[baseLetter];
                if (audioInfo) {
                    lessonItem.audio = { main: `/audio/lesson1/${audioInfo.audio}.mp3` };
                    lessonItem.words = [{
                        text: item.text_ar,
                        audio: `/audio/lesson1/${audioInfo.audio}.mp3`,
                        transliteration: item.transliteration
                    }];
                    if (audioInfo.makhraj) {
                        lessonItem.makhraj = audioInfo.makhraj;
                    }
                }
            }
        }


        // Lesson 3: Similar letters comparison - use first letter's audio
        if (lessonId === 3) {
            // For sequences like "ب ت ث" or comparisons like "ت vs ط"
            const letters = extractBaseLetters(item.text_ar);
            if (letters.length > 0) {
                const firstLetter = letters[0];
                const audioInfo = LESSON1_AUDIO_MAP[firstLetter];
                if (audioInfo) {
                    lessonItem.audio = { main: `/audio/lesson1/${audioInfo.audio}.mp3` };
                    // For multiple letters, create words array for each
                    lessonItem.words = letters.map(letter => {
                        const letterAudio = LESSON1_AUDIO_MAP[letter];
                        return {
                            text: letter,
                            audio: letterAudio ? `/audio/lesson1/${letterAudio.audio}.mp3` : '',
                            transliteration: letterAudio?.audio || letter
                        };
                    }).filter(w => w.audio);
                    if (audioInfo.makhraj) {
                        lessonItem.makhraj = audioInfo.makhraj;
                    }
                }
            }
        }

        // Lesson 4: Heavy vs Light - also use lesson1 audio
        if (lessonId === 4) {
            const letters = extractBaseLetters(item.text_ar);
            if (letters.length > 0) {
                const firstLetter = letters[0];
                const audioInfo = LESSON1_AUDIO_MAP[firstLetter];
                if (audioInfo) {
                    lessonItem.audio = { main: `/audio/lesson1/${audioInfo.audio}.mp3` };

                    // For multiple letters (like the intro sequence), create words array for each
                    lessonItem.words = letters.map(letter => {
                        const letterAudio = LESSON1_AUDIO_MAP[letter];
                        return {
                            text: letter,
                            audio: letterAudio ? `/audio/lesson1/${letterAudio.audio}.mp3` : '',
                            transliteration: letterAudio?.audio || letter
                        };
                    }).filter(w => w.audio);

                    if (audioInfo.makhraj) {
                        lessonItem.makhraj = audioInfo.makhraj;
                    }
                }
            }
        }

        // Lesson 5: Makhraj groups - use local audio for each letter (like L1-3)
        if (lessonId === 5) {
            const letters = extractBaseLetters(item.text_ar);
            if (letters.length > 0) {
                const firstLetter = letters[0];
                const audioInfo = LESSON1_AUDIO_MAP[firstLetter];
                if (audioInfo) {
                    lessonItem.audio = { main: `/audio/lesson1/${audioInfo.audio}.mp3` };
                    // Create words array for each letter in the group
                    lessonItem.words = letters.map(letter => {
                        const letterAudio = LESSON1_AUDIO_MAP[letter];
                        return {
                            text: letter,
                            audio: letterAudio ? `/audio/lesson1/${letterAudio.audio}.mp3` : '',
                            transliteration: letterAudio?.audio || letter
                        };
                    }).filter(w => w.audio);
                    if (audioInfo.makhraj) {
                        lessonItem.makhraj = audioInfo.makhraj;
                    }
                }
            }
        }

        // Add Quranic coordinates if available (for lessons 5+)
        if (item.surah && item.ayah && item.word_index) {
            lessonItem.surah = item.surah;
            lessonItem.ayah = item.ayah;
            lessonItem.wordIndex = item.word_index;

            // Add WBW audio
            lessonItem.audio = {
                main: mkWBWAudio(item.surah, item.ayah, item.word_index)
            };

            // Add words array for word-by-word playback
            lessonItem.words = [{
                text: item.text_ar,
                audio: mkWBWAudio(item.surah, item.ayah, item.word_index),
                transliteration: item.transliteration
            }];
        }

        return lessonItem;
    });
}

/**
 * Get lesson items from toon data for a specific lesson
 * This is the main function to use in lesson files
 */
export function getLessonItemsFromToon(lessonId: number): LessonItem[] {
    const toonData = getToonData(lessonId);
    return toonToLessonItems(toonData, lessonId);
}

/**
 * Get lesson items filtered by type
 */
export function getLessonItemsByType(lessonId: number, type: string): LessonItem[] {
    const toonData = getToonData(lessonId);
    const filtered = toonData.filter(item => item.type === type);
    return toonToLessonItems(filtered, lessonId);
}

/**
 * Get only items with Quranic coordinates (for WBW audio)
 */
export function getWBWItems(lessonId: number): LessonItem[] {
    const toonData = getToonData(lessonId);
    const filtered = toonData.filter(item => item.surah && item.ayah && item.word_index);
    return toonToLessonItems(filtered, lessonId);
}
