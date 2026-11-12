# Processes

## Local development

1. Open a terminal in the project root.
2. Run `python3 -m http.server 8080`.
3. Open http://localhost:8080.
4. Always use Ctrl+Shift+R (or Disable cache in DevTools) while developing.

## Adding or updating a mission

1. Edit `data/missions_data.json`.
2. Validate with:
   `python3 -m json.tool data/missions_data.json > /dev/null && echo OK`
3. Place any new image under `assets/images/`.
4. Convert with ImageMagick using the non-upscaling flag:
   `convert source.jpg -resize '1200x>' -quality 85 assets/images/filename.jpg`
5. Confirm the final file is under 300 KB.
6. Commit the JSON and the image together.

## Git workflow

- One logical change per commit.
- Descriptive commit messages (example: "Step 8b: extract mission.js…").
- Branch is `main`.

## Before submission

1. Confirm all images and SVGs return 200 in the Network tab.
2. Test at 375 px width (no horizontal scroll).
3. Test the three error states on mission.html (no id, bad id, load failure).
4. Replace the copyright placeholder in LICENSE with the correct name.
5. Push to GitHub and enable GitHub Pages.