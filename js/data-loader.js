/**
 * data-loader.js
 * Loads missions_data.json and returns the missions array.
 * Does not touch the DOM. Only returns data or throws.
 */
async function loadMissions() {
  const response = await fetch('data/missions_data.json');

  if (!response.ok) {
    throw new Error('HTTP error ' + response.status);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('missions_data.json must be a JSON array');
  }

  return data;
}

/**
 * Loads quiz_data.json and returns the questions array.
 * Validates the structure so a typo in the data fails loudly, not silently.
 */
async function loadQuiz() {
  const response = await fetch('data/quiz_data.json');

  if (!response.ok) {
    throw new Error('HTTP error ' + response.status);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('quiz_data.json must be a non-empty JSON array');
  }

  data.forEach(q => {
    const valid =
      q.mission_id && q.question && q.explanation &&
      Array.isArray(q.options) && q.options.length >= 2 &&
      Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length;

    if (!valid) {
      throw new Error('Invalid quiz question: ' + (q.id || JSON.stringify(q).slice(0, 60)));
    }
  });

  return data;
}