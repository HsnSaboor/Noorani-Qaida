#!/usr/bin/env node
/**
 * Bundle Toon Files Script
 * 
 * Reads all .toon files and generates TypeScript exports for each lesson's content.
 * This creates a single bundled file that can be imported by React Native.
 * 
 * Usage: npx tsx scripts/bundleToon.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOON_DIR = path.join(__dirname, '../data/lessons_toon');
const OUTPUT_FILE = path.join(__dirname, '../data/toonData.ts');

interface ToonItem {
    id: string;
    text_ar: string;
    transliteration: string;
    type: string;
    surah?: number;
    ayah?: number;
    word_index?: number;
}

interface ToonMeta {
    id: number;
    title_en: string;
    title_ur: string;
    description_en: string;
    description_ur: string;
    phase: string;
}

interface ToonQuiz {
    id: string;
    question: string;
    correct: string;
    options: string[];
}

function parseToonContent(content: string): ToonItem[] {
    const lines = content.trim().split('\n');
    const items: ToonItem[] = [];

    const isPipeFormat = lines.some(line => line.startsWith('|'));

    if (isPipeFormat) {
        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '' || line.startsWith('|')) continue;

            const values = line.split('|');
            if (values.length < 3) continue;

            const item: ToonItem = {
                id: values[0]?.trim() || '',
                text_ar: values[1]?.trim() || '',
                transliteration: values[2]?.trim() || '',
                type: values[3]?.trim() || 'word',
                surah: values[4]?.trim() ? parseInt(values[4]) : undefined,
                ayah: values[5]?.trim() ? parseInt(values[5]) : undefined,
                word_index: values[6]?.trim() ? parseInt(values[6]) : undefined,
            };

            if (item.id && item.text_ar) {
                items.push(item);
            }
        }
    } else {
        let parsingData = false;
        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '') continue;

            if (line.startsWith('items[') || line.startsWith(':')) {
                parsingData = true;
                continue;
            }

            if (!parsingData) continue;

            const match = line.match(/^([^,]+),\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)"(?:,\s*(\d*),\s*(\d*),\s*(\d*))?/);

            if (match) {
                const item: ToonItem = {
                    id: match[1]?.trim() || '',
                    text_ar: match[2]?.trim() || '',
                    transliteration: match[3]?.trim() || '',
                    type: match[4]?.trim() || 'single',
                    surah: match[5]?.trim() ? parseInt(match[5]) : undefined,
                    ayah: match[6]?.trim() ? parseInt(match[6]) : undefined,
                    word_index: match[7]?.trim() ? parseInt(match[7]) : undefined,
                };

                if (item.id && item.text_ar) {
                    items.push(item);
                }
            }
        }
    }

    return items;
}

function parseToonMeta(content: string, phase: string): ToonMeta | null {
    const lines = content.trim().split('\n');
    const meta: Partial<ToonMeta> = { phase };

    for (const line of lines) {
        const idMatch = line.match(/^id:\s*(\d+)/);
        if (idMatch) meta.id = parseInt(idMatch[1]);

        const titleEnMatch = line.match(/^title_en:\s*"([^"]*)"/);
        if (titleEnMatch) meta.title_en = titleEnMatch[1];

        const titleUrMatch = line.match(/^title_ur:\s*"([^"]*)"/);
        if (titleUrMatch) meta.title_ur = titleUrMatch[1];

        const descEnMatch = line.match(/^description_en:\s*"([^"]*)"/);
        if (descEnMatch) meta.description_en = descEnMatch[1];

        const descUrMatch = line.match(/^description_ur:\s*"([^"]*)"/);
        if (descUrMatch) meta.description_ur = descUrMatch[1];
    }

    if (meta.id && meta.title_en) {
        return meta as ToonMeta;
    }
    return null;
}

function parseQuizToon(content: string): ToonQuiz[] {
    const lines = content.trim().split('\n');
    const quizzes: ToonQuiz[] = [];

    for (const line of lines) {
        if (line.startsWith('#') || line.trim() === '') continue;

        const parts = line.split('|');
        if (parts.length < 4) continue;

        const quiz: ToonQuiz = {
            id: parts[0]?.trim() || '',
            question: parts[1]?.trim() || '',
            correct: parts[2]?.trim() || '',
            options: [parts[2]?.trim() || '', ...parts.slice(3).map(o => o.trim())].filter(Boolean),
        };

        if (quiz.id && quiz.question && quiz.correct) {
            quizzes.push(quiz);
        }
    }

    return quizzes;
}

function getPhaseFromLessonNum(lessonNum: number): string {
    if (lessonNum <= 10) return 'phase1';
    if (lessonNum <= 24) return 'phase2';
    if (lessonNum <= 48) return 'phase3';
    if (lessonNum <= 59) return 'phase4';
    return 'phase5';
}

function main() {
    const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'basic', 'advanced'];
    const allData: Record<number, ToonItem[]> = {};
    const allMeta: Record<number, ToonMeta> = {};
    const allQuiz: Record<number, ToonQuiz[]> = {};

    for (const phase of phases) {
        const phaseDir = path.join(TOON_DIR, phase);
        if (!fs.existsSync(phaseDir)) continue;

        const lessons = fs.readdirSync(phaseDir).filter(f => f.startsWith('lesson'));

        for (const lessonDir of lessons) {
            const lessonNum = parseInt(lessonDir.replace('lesson', ''));
            const contentFile = path.join(phaseDir, lessonDir, 'content.toon');
            const metaFile = path.join(phaseDir, lessonDir, 'meta.toon');
            const quizFile = path.join(phaseDir, lessonDir, 'quiz.toon');

            // Parse content
            if (fs.existsSync(contentFile)) {
                const content = fs.readFileSync(contentFile, 'utf-8');
                const items = parseToonContent(content);

                if (items.length > 0) {
                    if (allData[lessonNum]) {
                        const existingIds = new Set(allData[lessonNum].map(i => i.id));
                        for (const item of items) {
                            if (!existingIds.has(item.id)) {
                                allData[lessonNum].push(item);
                            }
                        }
                    } else {
                        allData[lessonNum] = items;
                    }
                }
            }

            // Parse meta
            if (fs.existsSync(metaFile) && !allMeta[lessonNum]) {
                const metaContent = fs.readFileSync(metaFile, 'utf-8');
                const realPhase = getPhaseFromLessonNum(lessonNum);
                const meta = parseToonMeta(metaContent, realPhase);
                if (meta) {
                    allMeta[lessonNum] = meta;
                }
            }

            // Parse quiz
            if (fs.existsSync(quizFile)) {
                const quizContent = fs.readFileSync(quizFile, 'utf-8');
                const quizzes = parseQuizToon(quizContent);

                if (quizzes.length > 0) {
                    if (allQuiz[lessonNum]) {
                        const existingIds = new Set(allQuiz[lessonNum].map(q => q.id));
                        for (const quiz of quizzes) {
                            if (!existingIds.has(quiz.id)) {
                                allQuiz[lessonNum].push(quiz);
                            }
                        }
                    } else {
                        allQuiz[lessonNum] = quizzes;
                    }
                }
            }
        }
    }

    // Generate TypeScript output
    let output = `/**
 * Auto-generated Toon Data Bundle
 * Generated: ${new Date().toISOString()}
 * 
 * This file contains all lesson content from .toon files.
 * DO NOT EDIT MANUALLY - regenerate using: npx tsx scripts/bundleToon.ts
 */

export interface ToonItem {
  id: string;
  text_ar: string;
  transliteration: string;
  type: string;
  surah?: number;
  ayah?: number;
  word_index?: number;
}

export interface ToonMeta {
  id: number;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  phase: string;
}

export interface ToonQuiz {
  id: string;
  question: string;
  correct: string;
  options: string[];
}

`;

    // Sort lessons by number
    const sortedLessons = Object.keys(allData).map(Number).sort((a, b) => a - b);

    for (const lessonNum of sortedLessons) {
        const items = allData[lessonNum];
        output += `export const lesson${lessonNum}Data: ToonItem[] = ${JSON.stringify(items, null, 2)};\n\n`;
    }

    // Export all lessons index
    output += `export const TOON_DATA: Record<number, ToonItem[]> = {\n`;
    for (const lessonNum of sortedLessons) {
        output += `  ${lessonNum}: lesson${lessonNum}Data,\n`;
    }
    output += `};\n\n`;

    // Export all lesson metadata
    output += `export const LESSON_META: Record<number, ToonMeta> = ${JSON.stringify(allMeta, null, 2)};\n\n`;

    // Export all quiz data
    output += `export const QUIZ_DATA: Record<number, ToonQuiz[]> = ${JSON.stringify(allQuiz, null, 2)};\n\n`;

    output += `export function getToonData(lessonId: number): ToonItem[] {\n`;
    output += `  return TOON_DATA[lessonId] || [];\n`;
    output += `}\n\n`;

    output += `export function getLessonMeta(lessonId: number): ToonMeta | undefined {\n`;
    output += `  return LESSON_META[lessonId];\n`;
    output += `}\n\n`;

    output += `export function getQuizData(lessonId: number): ToonQuiz[] {\n`;
    output += `  return QUIZ_DATA[lessonId] || [];\n`;
    output += `}\n`;

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`✅ Generated ${OUTPUT_FILE} with ${sortedLessons.length} lessons`);
    console.log(`   Lessons: ${sortedLessons.join(', ')}`);
    console.log(`   Meta entries: ${Object.keys(allMeta).length}`);
    console.log(`   Quiz entries: ${Object.keys(allQuiz).length}`);
}

main();


