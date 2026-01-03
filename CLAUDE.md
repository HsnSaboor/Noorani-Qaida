# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noorani Qaida Interactive is a web-based educational application for learning Arabic and Quranic pronunciation (Tajweed). It uses React, TypeScript, and Vite. The project focuses on interactive lessons, quizzes, and games to teach Arabic letters, makharij (articulation points), and Tajweed rules.

## Build and Dev Commands

- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev` (Runs on port 3000)
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`

## Architecture & Structure

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (inferred from className usage like `bg-slate-50`, `text-brand`)
- **Routing:** `react-router-dom`

### Key Directories

- **`/pages`**: Top-level route components (e.g., `Home.tsx`, `Lesson.tsx`, `Dashboard.tsx`).
- **`/components`**: Reusable UI components.
    - **`/components/games`**: Educational mini-games like `MemoryGame` and `AudioChallenge`.
- **`/context`**: Global state management (e.g., `AppContext.tsx` for user progress, settings, language).
- **`/data`**: Static data and logic for lessons.
    - **`/data/lessons`**: Lesson content split by category (`basic.ts`, `tajweed_plus.ts`, `surahs.ts`).
    - **`assets.ts`**: Centralized mapping of image assets (Makhraj images).
    - **`utils.ts`**: Helpers for audio generation (`mkAudio`, `mkLetterGroup`) and text normalization.
- **`/public`**: Static assets.
    - **`/public/audio`**: Audio files for letters and lessons.
- **`types.ts`**: Global TypeScript definitions for `Lesson`, `LessonItem`, `UserProgress`, etc.

### Core Concepts

- **Lessons**: Structured as objects containing metadata (title, rule) and an array of `items`.
- **Lesson Items**: Can be single letters, words, or comparisons.
    - `mkLocalItem`: Helper to create standard lesson items.
    - `mkLetterGroup`: Helper to create interactive items where a group of letters (e.g., "ب ت ث") can be played individually or sequentially.
- **Audio**:
    - **Local Audio**: Served from `/public/audio`.
    - **Quranic Audio**: Fetched from external APIs (EveryAyah, QuranCDN) for specific Surahs/Ayahs.
- **State**: `AppContext` manages:
    - User progress (completed lessons/items, XP, streaks).
    - Settings (language, theme, playback speed).

## Coding Standards

- **TypeScript**: Use strict typing. Avoid `any` where possible.
- **Components**: Functional components with hooks.
- **Lesson Data**: When adding new lessons, prefer using helpers like `mkLetterGroup` in `data/lessons/` to ensure consistent audio handling.
- **Audio Paths**: Always use `mkAudio` or `getLetterAudio` helpers to ensure correct path resolution to `/public/audio/`.
- **Internationalization**: Content strings (titles, descriptions) are usually objects with keys for `en`, `ur`, `fr`.

## Common Tasks

- **Adding a Lesson**: Create the lesson object in `data/lessons/`, add items using `mkLocalItem` or `mkLetterGroup`, and export it.
- **Updating Audio**: Place new files in `public/audio/lessonX/` and reference them via `mkAudio(X, 'filename')`.
- **Fixing Audio Issues**: Check `data/utils.ts` for base path configuration and `data/lessons/` for correct filename mapping.
