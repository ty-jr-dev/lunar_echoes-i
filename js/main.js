/**
 * main.js
 * Main application logic
 */

let allMissions = [];

document.addEventListener('DOMContentLoaded', async () => {
  allMissions = await loadMissions();

  if (!allMissions || allMissions.length === 0) {
    return;
  }

  renderMissions(allMissions);
  renderTimeline(allMissions);
  setupFilters();
});

function renderMissions(missions) {
  const grid = document.getElementById('missions-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (missions.length === 0) {
    grid.innerHTML = `<p class="text-slate-500 col-span-full">No missions match this filter.</p>`;
    return;
  }

  missions.forEach(mission => {
    grid.appendChild(createMissionCard(mission));
  });
}

function createMissionCard(mission) {
  const article = document.createElement('article');
  article.className = 'mission-card bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-400';

  const summary = mission.summary || (mission.why_it_matters ? mission.why_it_matters.substring(0, 120) + '...' : '');

  article.innerHTML = `
    <a href="mission.html?id=${mission.id}" class="block">
      <p class="text-cyan-400 text-xs font-medium tracking-wide uppercase mb-2">
        ${mission.body} · ${mission.launch_year}
      </p>
      <h3 class="text-lg font-semibold mb-2 leading-snug">${mission.name}</h3>
      <p class="text-slate-400 text-sm">${summary}</p>
      <p class="mt-4 text-xs text-slate-500">Status: ${mission.status}</p>
    </a>
  `;

  return article;
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-cyan-500/10', 'border-cyan-500', 'text-cyan-400');
        b.classList.add('border-slate-700', 'text-slate-300');
      });
      btn.classList.add('bg-cyan-500/10', 'border-cyan-500', 'text-cyan-400');
      btn.classList.remove('border-slate-700', 'text-slate-300');

      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? allMissions
        : allMissions.filter(m => m.body === filter);

      renderMissions(filtered);
    });
  });
}

function renderTimeline(missions) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  const sorted = [...missions].sort((a, b) => a.launch_year - b.launch_year);

  let html = '<div class="space-y-8">';

  sorted.forEach((mission, index) => {
    html += `
      <div class="flex gap-4">
        <div class="flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-cyan-400"></div>
          ${index < sorted.length - 1 ? '<div class="w-px flex-1 bg-slate-700 mt-2"></div>' : ''}
        </div>
        <div class="pb-8">
          <p class="text-cyan-400 text-sm font-medium">${mission.launch_year}</p>
          <h3 class="font-semibold mt-1">${mission.name}</h3>
          <p class="text-slate-400 text-sm mt-1">${mission.body} · ${mission.status}</p>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}