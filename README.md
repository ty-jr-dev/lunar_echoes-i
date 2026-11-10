# Lunar Echoes

Educational digital museum for the NASA Space Apps Challenge 2026  
Challenge: **Abandoned but not Forgotten**

Explore NASA hardware left on the Moon, Mars and in deep space — the technology, the discoveries, and why it still matters.

## Stack

- HTML5
- Tailwind CSS (CDN, pinned to 3.4.17)
- Vanilla JavaScript (ES6+)
- Static JSON data (data/missions_data.json)
- No backend, no frameworks

## Run locally

No terminal, dentro da pasta do projecto:

python3 -m http.server 8080

Depois abre no browser: http://localhost:8080

## Project structure

luna-echoes-prep/  
├── index.html          (Home + lista de missões + timeline)  
├── mission.html        (Página de detalhe da missão)  
├── css/style.css       (Estilos customizados)  
├── js/  
│   ├── data-loader.js  (Carrega e valida o JSON)  
│   └── main.js         (Lógica da interface)  
├── data/  
│   └── missions_data.json  
└── assets/images/      (Hero, logos, fotos das missões)

## Publish on GitHub Pages

1. Faz push do repositório para o GitHub.  
2. Vai a Settings → Pages → Source: Deploy from a branch → escolhe main / root.  
3. O site fica disponível em https://<username>.github.io/<repo>/

## License

MIT