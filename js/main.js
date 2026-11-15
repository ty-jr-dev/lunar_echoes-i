/**
 * main.js
 * Main application logic
 */
let allMissions = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allMissions = await loadMissions();
  } catch (error) {
    console.error('Error loading missions:', error);
    showError('Failed to load mission data. Check that data/missions_data.json exists.');
    return;
  }

  if (!allMissions || allMissions.length === 0) {
    showError('No missions available.');
    return;
  }

  renderMissions(allMissions);
  renderTimeline(allMissions);
  setupFilters();
});

function showError(message) {
  const grid = document.getElementById('missions-grid');
  const timeline = document.getElementById('timeline-container');

  if (grid) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-400 font-medium">${message}</p>
      </div>
    `;
  }

  if (timeline) {
    timeline.innerHTML = `
      <p class="text-red-400">${message}</p>
    `;
  }
}

function renderMissions(missions) {
  const grid = document.getElementById('missions-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (missions.length === 0) {
    grid.innerHTML = `<p class="text-slate-400 col-span-full">No missions match this filter.</p>`;
    return;
  }

  missions.forEach(mission => {
    grid.appendChild(createMissionCard(mission));
  });
}

function createMissionCard(mission) {
  const article = document.createElement('article');
  article.className = 'mission-card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-sky-400';

  const imageHtml = mission.images && mission.images[0]
    ? `<img src="${mission.images[0].src}" alt="${mission.images[0].alt}" loading="lazy" class="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105">`
    : `<div class="w-full h-52 bg-slate-800 flex items-center justify-center text-slate-400 text-sm">Image unavailable</div>`;

  article.innerHTML = `
    <a href="mission.html?id=${mission.id}" class="group block h-full">
      <div class="relative overflow-hidden">
        ${imageHtml}
        <span class="absolute top-3 left-3 bg-slate-950/80 text-sky-400 text-xs font-medium px-3 py-1 rounded-full">
          ${mission.body}
        </span>
      </div>

      <div class="p-5">
        <p class="text-slate-400 text-xs font-medium tracking-wide mb-2">
          ${mission.launch_year}
        </p>

        <h3 class="text-xl font-semibold mb-3 leading-snug group-hover:text-sky-400 transition-colors">
          ${mission.name}
        </h3>

        <p class="text-slate-400 text-sm leading-relaxed">
          ${mission.summary}
        </p>

        <div class="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
          <span class="text-xs text-slate-400">${mission.status}</span>
          <span class="text-sky-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Explore mission →
          </span>
        </div>
      </div>
    </a>
  `;

  return article;
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  if (!buttons.length) return;

  // Add mission counts to filter buttons
  buttons.forEach(btn => {
    const filter = btn.dataset.filter;

    const count = filter === 'all'
      ? allMissions.length
      : allMissions.filter(m => m.body === filter).length;

    const label = btn.textContent.trim();
    btn.innerHTML = `${label} <span class="ml-1 text-slate-400">(${count})</span>`;
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });

      // Set active on clicked button
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? allMissions
        : allMissions.filter(m => m.body === filter);

      renderMissions(filtered);
    });
  });

  // Set initial active state on "All"
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
    allBtn.setAttribute('aria-pressed', 'true');
  }
}

function renderTimeline(missions) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  // Timeline always shows all missions, sorted by launch year
  const sorted = [...missions].sort((a, b) => a.launch_year - b.launch_year);

  let html = '<div class="space-y-8">';

  sorted.forEach((mission, index) => {
    let yearRange;
    if (mission.end_year == null) {
      yearRange = `${mission.launch_year} – present`;
    } else if (mission.launch_year === mission.end_year) {
      yearRange = `${mission.launch_year}`;
    } else {
      yearRange = `${mission.launch_year} – ${mission.end_year}`;
    }

    html += `
      <a href="mission.html?id=${mission.id}" class="flex gap-4 group">
        <div class="flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-sky-400 group-hover:bg-sky-300 transition"></div>
          ${index < sorted.length - 1 ? '<div class="w-px flex-1 bg-slate-700 mt-2"></div>' : ''}
        </div>
        <div class="pb-8">
          <p class="text-sky-400 text-sm font-medium">${yearRange}</p>
          <h3 class="font-semibold mt-1 group-hover:text-sky-400 transition">${mission.name}</h3>
          <p class="text-slate-400 text-sm mt-1">${mission.body} · ${mission.status}</p>
        </div>
      </a>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}