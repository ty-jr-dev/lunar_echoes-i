/**
 * data-loader.js
 * Loads missions_data.json and returns the missions array.
 */

async function loadMissions() {
  try {
    const response = await fetch('data/missions_data.json');

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.missions || [];
  } catch (error) {
    console.error('Error loading missions:', error);

    const grid = document.getElementById('missions-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-red-400 font-medium mb-2">Failed to load mission data</p>
          <p class="text-slate-500 text-sm">
            Check that <code class="text-slate-400">data/missions_data.json</code> exists.
          </p>
        </div>
      `;
    }

    return [];
  }
}