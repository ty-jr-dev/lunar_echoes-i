# Code Guide

## Conventions

- All user-facing text is in English.
- Indentation: 2 spaces.
- No trailing whitespace.
- Prefer `const` and `let`. Never use `var`.
- Async functions for anything that touches the network.

## File responsibilities

- `js/data-loader.js`  
  Only loads and validates the JSON. Never touches the DOM.

- `js/main.js`  
  Home page only: filters, mission cards, timeline, error display.

- `js/mission.js`  
  Mission detail page only. Reads `?id=` from the URL.

## Adding a new mission

1. Add a new object to the array in `data/missions_data.json`.
2. Follow the schema exactly (especially `status` values and image rules).
3. Place the image file under `assets/images/` and reference it with a relative path.
4. Keep images under 300 KB and never upscale (`convert -resize '1200x>'`).

## Accessibility

- Filter buttons use `aria-pressed`.
- Focus styles are defined in `css/style.css`.
- Images always have meaningful `alt` text.
- Reduced-motion preference is respected.