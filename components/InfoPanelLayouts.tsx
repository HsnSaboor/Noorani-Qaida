import React from 'react';
import { LessonItem, Language } from '../types';
import MakhrajDiagram from './MakhrajDiagram';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';

interface LayoutProps {
    item: LessonItem;
    language: Language;
    onReplay?: () => void;
    onSlowReplay?: () => void;
}

// Mapping from MAKHRAJ_DESCRIPTIONS bodyPart to highlight ID
const BODY_PART_TO_HIGHLIGHT: Record<string, string> = {
    'Throat': 'throat-middle',
    'Lips': 'lips',
    'Tongue Tip': 'tongue-tip',
    'Tongue Middle': 'tongue-middle',
    'Tongue Back': 'tongue-back',
    'Tongue Side': 'tongue-side',
    'Nose': 'nasal',
    'Tongue + 👃 Nose': 'nasal',
    'Lips + 👃 Nose': 'lips',
};

// Get highlight ID from body part string
export function getHighlightFromBodyPart(bodyPart: string): string {
    // Extract the main part (after emoji)
    const parts = bodyPart.split(' ');
    const mainPart = parts.slice(1).join(' '); // Skip emoji
    return BODY_PART_TO_HIGHLIGHT[mainPart] || 'tongue-tip';
}

// Letter to highlight region mapping
const LETTER_TO_HIGHLIGHT: Record<string, string> = {
    'ء': 'throat-deep',
    'ا': 'jauf',
    'ب': 'lips',
    'ت': 'tongue-tip',
    'ث': 'tongue-tip',
    'ج': 'tongue-middle',
    'ح': 'throat-middle',
    'خ': 'throat-upper',
    'د': 'tongue-tip',
    'ذ': 'tongue-tip',
    'ر': 'tongue-tip',
    'ز': 'tongue-tip',
    'س': 'tongue-tip',
    'ش': 'tongue-middle',
    'ص': 'tongue-tip',
    'ض': 'tongue-side',
    'ط': 'tongue-tip',
    'ظ': 'tongue-tip',
    'ع': 'throat-middle',
    'غ': 'throat-upper',
    'ف': 'lips',
    'ق': 'tongue-back',
    'ك': 'tongue-back',
    'ل': 'tongue-tip',
    'م': 'lips',
    'ن': 'tongue-tip',
    'ه': 'throat-deep',
    'و': 'lips',
    'ي': 'tongue-middle',
};

// Action steps for ALL letters
const LETTER_ACTION_STEPS: Record<string, { en: string; ur: string }[]> = {
    'ء': [
        { en: 'Stop airflow at deepest throat', ur: 'گلے کی گہرائی سے ہوا روکیں' },
        { en: 'Release sharply (like a cough)', ur: 'تیزی سے چھوڑیں (جیسے کھانسی)' },
    ],
    'ا': [
        { en: 'Open your throat wide', ur: 'گلا کھولیں' },
        { en: 'Let the sound come from empty space', ur: 'آواز خالی جگہ سے نکالیں' },
    ],
    'ب': [
        { en: 'Press both lips together', ur: 'دونوں ہونٹ ملائیں' },
        { en: 'Let air build up', ur: 'ہوا جمع ہونے دیں' },
        { en: 'Release with a pop', ur: 'دھماکے سے چھوڑیں' },
    ],
    'ت': [
        { en: 'Touch tongue tip to upper teeth', ur: 'زبان اوپری دانتوں سے لگائیں' },
        { en: 'Release quickly (LIGHT sound)', ur: 'جلدی چھوڑیں (ہلکی آواز)' },
    ],
    'ث': [
        { en: 'Place tongue tip between teeth', ur: 'زبان دانتوں کے درمیان رکھیں' },
        { en: 'Blow air softly (like "th" in "think")', ur: 'آہستہ ہوا نکالیں' },
    ],
    'ج': [
        { en: 'Raise middle of tongue to palate', ur: 'زبان کا درمیان تالو سے لگائیں' },
        { en: 'Add slight friction', ur: 'ہلکی رگڑ دیں' },
    ],
    'ح': [
        { en: 'Constrict MIDDLE of throat', ur: 'گلے کا درمیان سکوڑیں' },
        { en: 'Breathe out softly (sharp sound)', ur: 'آہستہ سانس چھوڑیں (تیز آواز)' },
    ],
    'خ': [
        { en: 'Raise tongue back towards soft palate', ur: 'زبان کی جڑ نرم تالو سے لگائیں' },
        { en: 'Create friction sound (like clearing throat)', ur: 'رگڑ والی آواز نکالیں' },
    ],
    'د': [
        { en: 'Touch tongue tip to upper teeth base', ur: 'زبان دانتوں کی جڑ سے لگائیں' },
        { en: 'Release with a tap (LIGHT sound)', ur: 'ٹپ سے چھوڑیں (ہلکی آواز)' },
    ],
    'ذ': [
        { en: 'Place tongue tip between teeth', ur: 'زبان دانتوں کے درمیان رکھیں' },
        { en: 'Vibrate slightly (like "th" in "this")', ur: 'ہلکی سی کمپن دیں' },
    ],
    'ر': [
        { en: 'Curl tongue tip up toward palate', ur: 'زبان کی نوک اوپر مڑیں' },
        { en: 'Let it vibrate/tap once', ur: 'ایک بار کمپن دیں' },
    ],
    'ز': [
        { en: 'Touch tongue tip behind lower teeth', ur: 'زبان نچلے دانتوں کے پیچھے' },
        { en: 'Create buzzing sound', ur: 'بھنبھناہٹ کی آواز نکالیں' },
    ],
    'س': [
        { en: 'Touch tongue tip behind lower teeth', ur: 'زبان نچلے دانتوں کے پیچھے' },
        { en: 'Create whistling/hissing sound', ur: 'سیٹی جیسی آواز نکالیں' },
    ],
    'ش': [
        { en: 'Raise middle of tongue to palate', ur: 'زبان کا درمیان تالو سے لگائیں' },
        { en: 'Blow air creating "sh" sound', ur: '"ش" کی آواز نکالیں' },
    ],
    'ص': [
        { en: 'Position tongue for whistling (like س)', ur: 'زبان سیٹی کی پوزیشن میں' },
        { en: 'Make it HEAVY (Tafkheem)', ur: 'موٹا بنائیں (تفخیم)' },
    ],
    'ض': [
        { en: 'Press tongue SIDE against molars', ur: 'زبان کا کنارہ داڑھوں سے دبائیں' },
        { en: 'This is the unique Arabic letter!', ur: 'یہ عربی کا خاص حرف ہے!' },
        { en: 'Make it HEAVY', ur: 'موٹا بنائیں' },
    ],
    'ط': [
        { en: 'Touch tongue tip to upper teeth (like ت)', ur: 'زبان دانتوں سے لگائیں (جیسے ت)' },
        { en: 'Make it HEAVY (Tafkheem)', ur: 'موٹا بنائیں (تفخیم)' },
    ],
    'ظ': [
        { en: 'Place tongue between teeth (like ذ)', ur: 'زبان دانتوں کے درمیان (جیسے ذ)' },
        { en: 'Make it HEAVY (Tafkheem)', ur: 'موٹا بنائیں (تفخیم)' },
    ],
    'ع': [
        { en: 'Constrict MIDDLE of throat', ur: 'گلے کا درمیان سکوڑیں' },
        { en: 'Make a DEEPER sound than ح', ur: 'ح سے گہری آواز نکالیں' },
    ],
    'غ': [
        { en: 'Gargle-like sound from upper throat', ur: 'گلے کے اوپری حصے سے غرغرے کی آواز' },
        { en: 'Make it HEAVY', ur: 'موٹا بنائیں' },
    ],
    'ف': [
        { en: 'Touch lower lip to upper teeth edge', ur: 'نچلا ہونٹ اوپری دانتوں سے لگائیں' },
        { en: 'Blow air out gently', ur: 'آہستہ ہوا نکالیں' },
    ],
    'ق': [
        { en: 'Touch tongue BACK to soft palate', ur: 'زبان کی جڑ نرم تالو سے لگائیں' },
        { en: 'Make it HEAVY (Tafkheem)', ur: 'موٹا بنائیں (تفخیم)' },
        { en: 'Release with echo (Qalqala)', ur: 'قلقلہ سے چھوڑیں' },
    ],
    'ك': [
        { en: 'Touch tongue back to hard palate', ur: 'زبان کی جڑ سخت تالو سے لگائیں' },
        { en: 'Release quickly (LIGHT sound)', ur: 'جلدی چھوڑیں (ہلکی آواز)' },
    ],
    'ل': [
        { en: 'Touch tongue tip to gum behind upper teeth', ur: 'زبان کی نوک اوپری مسوڑوں سے لگائیں' },
        { en: 'Let sound flow around sides', ur: 'آواز کناروں سے نکلنے دیں' },
    ],
    'م': [
        { en: 'Press both lips together', ur: 'دونوں ہونٹ ملائیں' },
        { en: 'Sound comes through nose (Ghunnah)', ur: 'آواز ناک سے نکلے (غنہ)' },
    ],
    'ن': [
        { en: 'Touch tongue tip to gum behind upper teeth', ur: 'زبان مسوڑوں سے لگائیں' },
        { en: 'Sound comes through nose (Ghunnah)', ur: 'آواز ناک سے نکلے (غنہ)' },
    ],
    'ه': [
        { en: 'Open throat at deepest point', ur: 'گلے کی گہرائی کھولیں' },
        { en: 'Breathe out gently (no friction)', ur: 'آہستہ سانس چھوڑیں (بغیر رگڑ)' },
    ],
    'و': [
        { en: 'Round both lips together', ur: 'ہونٹ گول کریں' },
        { en: 'Push lips forward slightly', ur: 'ہونٹ تھوڑا آگے کریں' },
    ],
    'ي': [
        { en: 'Raise middle of tongue toward palate', ur: 'زبان کا درمیان تالو کی طرف اٹھائیں' },
        { en: 'Spread lips slightly', ur: 'ہونٹ تھوڑا پھیلائیں' },
    ],
};

// Letter short descriptions for comparison view
const LETTER_SHORT_DESC: Record<string, { en: string; ur: string }> = {
    'ء': { en: 'Sharp stop', ur: 'تیز وقفہ' },
    'ا': { en: 'Open vowel', ur: 'کھلی آواز' },
    'ب': { en: 'Lips pop', ur: 'ہونٹوں کا دھماکہ' },
    'ت': { en: 'Light tap', ur: 'ہلکا ٹپ' },
    'ث': { en: 'Soft breath', ur: 'نرم سانس' },
    'ج': { en: 'Mid tongue', ur: 'درمیانی زبان' },
    'ح': { en: 'Sharp breath', ur: 'تیز سانس' },
    'خ': { en: 'Throat friction', ur: 'گلے کی رگڑ' },
    'د': { en: 'Light tap', ur: 'ہلکا ٹپ' },
    'ذ': { en: 'Soft buzz', ur: 'نرم بھنبھناہٹ' },
    'ر': { en: 'Rolled tip', ur: 'لچکدار نوک' },
    'ز': { en: 'Buzzing', ur: 'بھنبھناہٹ' },
    'س': { en: 'Whistle', ur: 'سیٹی' },
    'ش': { en: 'Spreading', ur: 'پھیلاؤ' },
    'ص': { en: 'Heavy whistle', ur: 'بھاری سیٹی' },
    'ض': { en: 'Unique Arabic', ur: 'خاص عربی' },
    'ط': { en: 'Heavy tap', ur: 'بھاری ٹپ' },
    'ظ': { en: 'Heavy buzz', ur: 'بھاری بھنبھناہٹ' },
    'ع': { en: 'Deep throat', ur: 'گہرا گلا' },
    'غ': { en: 'Gargling', ur: 'غرغرہ' },
    'ف': { en: 'Lip breath', ur: 'ہونٹ سانس' },
    'ق': { en: 'Deep heavy', ur: 'گہرا بھاری' },
    'ك': { en: 'Light back', ur: 'ہلکا پیچھے' },
    'ل': { en: 'Side flow', ur: 'کنارے بہاؤ' },
    'م': { en: 'Lips + nose', ur: 'ہونٹ + ناک' },
    'ن': { en: 'Tip + nose', ur: 'نوک + ناک' },
    'ه': { en: 'Deep breath', ur: 'گہری سانس' },
    'و': { en: 'Round lips', ur: 'گول ہونٹ' },
    'ي': { en: 'Spread tongue', ur: 'پھیلی زبان' },
};

/**
 * AnatomyLayout - REDESIGNED (Compact)
 * Clear diagram, concise action steps, balanced layout
 */
export const AnatomyLayout: React.FC<LayoutProps> = ({
    item,
    language,
    onReplay,
    onSlowReplay
}) => {
    // Get first letter for makhraj lookup
    const firstLetter = item.text_ar.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').charAt(0);
    const highlightId = item.makhrajHighlightId || LETTER_TO_HIGHLIGHT[firstLetter] || 'tongue-tip';
    const actionSteps = item.actionSteps || LETTER_ACTION_STEPS[firstLetter];
    const shortDesc = LETTER_SHORT_DESC[firstLetter];

    // Hide placeholder transliterations
    const showTranslit = item.transliteration && item.transliteration !== 'Word' && !item.transliteration.startsWith('Word');

    return (
        <div className="flex flex-col gap-3"> {/* Reduced gap */}
            <div className="flex flex-row items-stretch gap-4"> {/* Reduced gap */}
                {/* Visual Section - Compact Card */}
                <div className="flex-none w-28 sm:w-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
                    <MakhrajDiagram
                        highlightRegion={highlightId}
                        letter={firstLetter}
                        size={110} // Slightly reduced size for compactness
                        className="w-full h-auto drop-shadow-sm text-slate-600 dark:text-slate-400"
                    />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                        {language === 'ur' ? 'مخرج' : 'Makhraj'}
                    </span>
                </div>

                {/* Info Section */}
                <div className="flex-1 flex flex-col py-0.5">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="font-arabic text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white leading-none">
                                {item.text_ar}
                            </h2>
                            {showTranslit && (
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                                    {item.transliteration}
                                </p>
                            )}
                        </div>
                        {shortDesc && (
                            <div className="bg-brand/10 text-brand dark:text-brand-light px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide text-center">
                                {language === 'ur' ? shortDesc.ur : shortDesc.en}
                            </div>
                        )}
                    </div>

                    {/* How to Pronounce - Compact List */}
                    {actionSteps && actionSteps.length > 0 && (
                        <div className="flex-1 overflow-y-auto max-h-[100px] pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-brand"></span>
                                {language === 'ur' ? 'طریقہ' : 'Technique'}
                            </h4>
                            <ul className="space-y-1.5">
                                {actionSteps.map((step, idx) => (
                                    <li key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex gap-1.5 leading-snug">
                                        <span className="opacity-40 select-none text-[10px] mt-0.5">•</span>
                                        {language === 'ur' ? step.ur : step.en}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls - Compacted */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onReplay}
                    className="py-2.5 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-md"
                >
                    <Volume2 size={16} />
                    {language === 'ur' ? 'سنیں' : 'Play'}
                </button>
                <button
                    onClick={onSlowReplay}
                    className="py-2.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
                >
                    🐢 {language === 'ur' ? 'آہستہ' : 'Slow'}
                </button>
            </div>
        </div>
    );
};

/**
 * Comparison Layout - For comparison items like "ء vs ع"
 * Shows two letters side-by-side with their articulation points
 */
export const ComparisonLayout: React.FC<LayoutProps> = ({
    item,
    language,
    onReplay,
    onSlowReplay
}) => {
    // Parse the comparison text (e.g., "ء vs ع")
    const text = item.text_ar.replace(/\s+/g, ' ').trim();
    const vsMatch = text.match(/(.+?)\s*vs\s*(.+)/i);

    let letter1 = '';
    let letter2 = '';

    if (vsMatch) {
        letter1 = vsMatch[1].trim().replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
        letter2 = vsMatch[2].trim().replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    } else {
        // Fallback - just show the item normally
        return <AnatomyLayout item={item} language={language} onReplay={onReplay} onSlowReplay={onSlowReplay} />;
    }

    const highlight1 = LETTER_TO_HIGHLIGHT[letter1] || 'tongue-tip';
    const highlight2 = LETTER_TO_HIGHLIGHT[letter2] || 'tongue-tip';
    const desc1 = LETTER_SHORT_DESC[letter1];
    const desc2 = LETTER_SHORT_DESC[letter2];
    const steps1 = LETTER_ACTION_STEPS[letter1];
    const steps2 = LETTER_ACTION_STEPS[letter2];

    // Parse transliteration for comparison labels
    const translitParts = item.transliteration?.split(' vs ') || ['', ''];

    return (
        <div className="flex flex-col gap-4">
            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-4">
                {/* Letter 1 */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <MakhrajDiagram
                        highlightRegion={highlight1}
                        letter={letter1}
                        size={60}
                        className="mx-auto mb-2"
                    />
                    <span className="font-arabic text-3xl font-bold text-slate-900 dark:text-white block">
                        {letter1}
                    </span>
                    {desc1 && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                            {language === 'ur' ? desc1.ur : desc1.en}
                        </span>
                    )}
                    {translitParts[0] && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                            {translitParts[0]}
                        </span>
                    )}
                    {steps1 && steps1[0] && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
                            {language === 'ur' ? steps1[0].ur : steps1[0].en}
                        </p>
                    )}
                </div>

                {/* Letter 2 */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                    <MakhrajDiagram
                        highlightRegion={highlight2}
                        letter={letter2}
                        size={60}
                        className="mx-auto mb-2"
                    />
                    <span className="font-arabic text-3xl font-bold text-slate-900 dark:text-white block">
                        {letter2}
                    </span>
                    {desc2 && (
                        <span className="text-xs text-violet-600 dark:text-violet-400 font-bold block mt-1">
                            {language === 'ur' ? desc2.ur : desc2.en}
                        </span>
                    )}
                    {translitParts[1] && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                            {translitParts[1]}
                        </span>
                    )}
                    {steps2 && steps2[0] && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
                            {language === 'ur' ? steps2[0].ur : steps2[0].en}
                        </p>
                    )}
                </div>
            </div>

            {/* Key Difference */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 text-center border border-amber-100 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    {language === 'ur' ? '📍 فرق: ' : '📍 Key Difference: '}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400">
                    {highlight1 !== highlight2
                        ? (language === 'ur' ? `${letter1} اور ${letter2} کا مخرج مختلف ہے` : `${letter1} and ${letter2} come from different places`)
                        : (language === 'ur' ? `${letter1} ہلکا، ${letter2} بھاری` : `${letter1} is light, ${letter2} is heavy`)
                    }
                </span>
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2">
                <button
                    onClick={onReplay}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-brand text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors active:scale-95"
                >
                    <Volume2 size={18} /> {language === 'ur' ? 'دوبارہ سنیں' : 'Replay'}
                </button>
                <button
                    onClick={onSlowReplay}
                    className="py-2.5 px-4 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center gap-2 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors active:scale-95"
                    title="Slow playback (0.5x)"
                >
                    🐢 0.5x
                </button>
            </div>
        </div>
    );
};

/**
 * Context Layout - For Phase 5 (Surahs)
 * Shows translation, root word, grammar
 */
export const ContextLayout: React.FC<LayoutProps> = ({
    item,
    language,
    onReplay,
    onSlowReplay
}) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Main Word Display */}
            <div className="text-center py-3">
                <span className="font-arabic text-5xl font-bold text-slate-900 dark:text-white block mb-2">
                    {item.text_ar}
                </span>
                {item.transliteration && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium block mb-2">
                        {item.transliteration}
                    </span>
                )}

                {/* Translation */}
                {item.description && (
                    <div className="mt-3 bg-gradient-to-r from-brand/5 to-brand/10 dark:from-brand/10 dark:to-brand/20 rounded-xl p-4">
                        <span className="text-xs font-bold text-brand dark:text-brand-light uppercase tracking-wide block mb-1">
                            {language === 'ur' ? 'ترجمہ:' : 'Meaning:'}
                        </span>
                        <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                            "{item.description[language] || item.description['en']}"
                        </p>
                    </div>
                )}
            </div>

            {/* Root Word & Grammar Row */}
            <div className="flex flex-wrap gap-2 justify-center">
                {/* Root Word Badge */}
                {item.rootWord && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold">
                        <span className="text-xs uppercase tracking-wide opacity-70">
                            {language === 'ur' ? 'جڑ:' : 'Root:'}
                        </span>
                        <span className="font-arabic text-lg">{item.rootWord}</span>
                    </span>
                )}

                {/* Grammar Type Badge */}
                {item.grammarType && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                        📚 {item.grammarType}
                    </span>
                )}
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2">
                <button
                    onClick={onReplay}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-brand text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors active:scale-95"
                >
                    <Volume2 size={18} /> {language === 'ur' ? 'دوبارہ سنیں' : 'Replay'}
                </button>
                <button
                    onClick={onSlowReplay}
                    className="py-2.5 px-4 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center gap-2 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors active:scale-95"
                    title="Slow playback (0.5x)"
                >
                    🐢 0.5x
                </button>
            </div>
        </div>
    );
};

export default { AnatomyLayout, ComparisonLayout, ContextLayout };
