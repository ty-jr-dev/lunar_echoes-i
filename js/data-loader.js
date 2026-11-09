/**
 * data-loader.js
 * Loads missions_data.json and returns the missions array.
 * Does not touch the DOM. Only returns data or throws.
 */
async function loadMissions() {
  const response = await fetch('data/missions_data.json');

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('missions_data.json must be a JSON array');
  }

  return data;
}