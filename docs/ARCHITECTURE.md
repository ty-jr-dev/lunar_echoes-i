# Architecture

## Overview

Lunar Echoes is a fully static website. There is no server-side code, no database and no build step beyond optional image compression.

## Data flow

1. `data/missions_data.json` is the single source of truth (array of mission objects).
2. `js/data-loader.js` fetches the JSON, validates that the root is an array, and returns it (or throws).
3. `js/main.js` (home page) and `js/mission.js` (detail page) consume the data and render the UI.
4. `js/quiz.js` loads `data/quiz_data.json` via `loadQuiz()` and renders the quiz UI.

## Pages

- `index.html` — hero, filterable mission cards, chronological timeline, about section.
- `mission.html` — single mission detail. Reads the `id` query parameter.
- `quiz.html` — interactive quiz (one question at a time, score at the end).

## Styling

- Tailwind CSS via CDN (pinned version).
- Small custom CSS in `css/style.css` for filter active state, card hover and reduced-motion preference.

## Constraints

- All mission images must be local files under `assets/images/`.
- No external image URLs at runtime.
- No frameworks (React, Vue, etc.).