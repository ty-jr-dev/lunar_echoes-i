# Lunar Echoes

Educational digital museum created for the NASA Space Apps Challenge 2026.
Challenge: Abandoned but not Forgotten.

Explore NASA hardware left on the Moon, Mars and in deep space — the technology, the discoveries, and why it still matters.

## Stack

- HTML5
- Tailwind CSS (CDN, pinned to 3.4.17)
- Vanilla JavaScript (ES6+)
- Static JSON data (data/missions_data.json)
- No backend, no frameworks

## Run locally

python3 -m http.server 8080

Open http://localhost:8080 in your browser.

## Project structure

lunar-echoes/
├── index.html              (Home, mission list and timeline)
├── mission.html            (Mission detail page)
├── css/style.css           (Custom styles)
├── js/
│   ├── data-loader.js      (Loads and validates the JSON)
│   ├── main.js             (Home page logic)
│   └── mission.js          (Mission detail page logic)
├── data/
│   └── missions_data.json
└── assets/images/          (Hero, logos and mission photos)

## Data format

Root is a JSON array of mission objects. Required fields: id, name, body, launch_year, end_year, status, summary, story, location_description, why_it_matters, technologies, key_discoveries, left_behind, images, sources.

## Credits

- Mission images: NASA / JPL
- Hero image: AI-generated illustration
- Logo and mark: project assets

## Publish on GitHub Pages

1. Push the repository to GitHub.
2. Go to Settings → Pages → Source: Deploy from a branch → select main / root.
3. The site will be available at https://<username>.github.io/<repo>/

## License

MIT (see LICENSE file)