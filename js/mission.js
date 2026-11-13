/**
 * mission.js
 * Renders a single mission detail page.
 * Depends on data-loader.js (loadMissions).
 */
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('mission-content');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-400 text-lg font-medium mb-4">No mission specified.</p>
        <a href="index.html#missions" class="text-sky-400 hover:underline">← Back to missions</a>
      </div>
    `;
    return;
  }

  let missions;
  try {
    missions = await loadMissions();
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-400 text-lg font-medium mb-4">Failed to load mission data.</p>
        <a href="index.html#missions" class="text-sky-400 hover:underline">← Back to missions</a>
      </div>
    `;
    return;
  }

  const mission = missions.find(m => m.id === id);

  if (!mission) {
    container.innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-400 text-lg font-medium mb-4">Mission not found.</p>
        <a href="index.html#missions" class="text-sky-400 hover:underline">← Back to missions</a>
      </div>
    `;
    return;
  }

  // Year range (uses == null to catch both null and undefined)
  let yearRange;
  if (mission.end_year == null) {
    yearRange = `${mission.launch_year} – present`;
  } else if (mission.launch_year === mission.end_year) {
    yearRange = `${mission.launch_year}`;
  } else {
    yearRange = `${mission.launch_year} – ${mission.end_year}`;
  }

  // Images – only credit in caption; alt stays on the img
  let imagesHtml = '';
  if (mission.images && mission.images.length > 0) {
    imagesHtml = mission.images.map(img => `
      <figure class="mb-8">
        <img
          src="${img.src}"
          alt="${img.alt}"
          class="mx-auto w-auto max-w-full max-h-[32rem] object-contain rounded-xl"
          loading="lazy"
        />
        <figcaption class="mt-2 text-sm text-slate-400">Credit: ${img.credit}</figcaption>
      </figure>
    `).join('');
  }

  function listHtml(items) {
    if (!items || items.length === 0) return '<p class="text-slate-400">—</p>';
    return '<ul class="list-disc list-inside space-y-1 text-slate-300">' +
      items.map(function(i) { return '<li>' + i + '</li>'; }).join('') +
      '</ul>';
  }

  // Sources – show only the domain as link text
  let sourcesHtml = '';
  if (mission.sources && mission.sources.length > 0) {
    sourcesHtml = `
      <ul class="space-y-2">
        ${mission.sources.map(s => {
          let domain = s;
          try {
            domain = new URL(s).hostname.replace(/^www\./, '');
          } catch (_) {}
          return `
            <li>
              <a href="${s}" target="_blank" rel="noopener" class="text-sky-400 hover:underline">${domain}</a>
            </li>
          `;
        }).join('')}
      </ul>
    `;
  }

  container.innerHTML = `
    <a href="index.html#missions" class="inline-flex items-center gap-2 text-sky-400 hover:underline mb-10">
      ← Back to missions
    </a>

    <p class="text-sky-400 text-sm font-medium tracking-wide uppercase mb-2">
      ${mission.body} · ${yearRange}
    </p>
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">${mission.name}</h1>
    <p class="text-slate-400 mb-8">Status: ${mission.status}</p>

    ${imagesHtml}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
      <div class="lg:col-span-2 space-y-10">
        <section>
          <h2 class="text-xl font-semibold mb-3">Story</h2>
          <p class="text-slate-300 leading-relaxed">${mission.story}</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-3">Why it matters</h2>
          <p class="text-slate-300 leading-relaxed">${mission.why_it_matters}</p>
        </section>
      </div>

      <div class="space-y-8">
        <section>
          <h2 class="text-lg font-semibold mb-3">Location</h2>
          <p class="text-slate-300">${mission.location_description}</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold mb-3">Technologies</h2>
          ${listHtml(mission.technologies)}
        </section>

        <section>
          <h2 class="text-lg font-semibold mb-3">Key discoveries</h2>
          ${listHtml(mission.key_discoveries)}
        </section>

        <section>
          <h2 class="text-lg font-semibold mb-3">Left behind</h2>
          ${listHtml(mission.left_behind)}
        </section>

        <section>
          <h2 class="text-lg font-semibold mb-3">Sources</h2>
          ${sourcesHtml}
        </section>
      </div>
    </div>
  `;

  document.title = `${mission.name} — Lunar Echoes`;
});