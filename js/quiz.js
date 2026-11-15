/**
 * quiz.js
 * Quiz page logic: one question at a time, instant feedback, final score.
 * Depends on data-loader.js (loadQuiz, loadMissions).
 * The whole UI is rendered from a small state object (render() builds the HTML).
 */
const state = {
  questions: [],
  missionNames: {},
  index: 0,
  score: 0,
  selected: null
};

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('quiz-content');
  if (!container) return;

  let quiz;
  try {
    quiz = await loadQuiz();
  } catch (error) {
    console.error('Error loading quiz:', error);
    container.innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-400 text-lg font-medium mb-4">Failed to load the quiz.</p>
        <a href="index.html#missions" class="text-sky-400 hover:underline">← Back to missions</a>
      </div>
    `;
    return;
  }

  // Mission names are only used for the "read the story" link.
  // If they fail to load, the quiz still works with a generic link label.
  try {
    const missions = await loadMissions();
    missions.forEach(m => { state.missionNames[m.id] = m.name; });
  } catch (error) {
    console.error('Could not load mission names:', error);
  }

  state.questions = shuffle(quiz).map(q => ({
    ...q,
    options: shuffle(q.options.map((text, i) => ({ text, isCorrect: i === q.answer })))
  }));

  container.addEventListener('click', event => {
    const optionBtn = event.target.closest('[data-option]');
    const actionBtn = event.target.closest('[data-action]');

    if (optionBtn) {
      handleAnswer(Number(optionBtn.dataset.option));
      render(container);
    } else if (actionBtn) {
      handleAction(actionBtn.dataset.action);
      render(container);
    }
  });

  render(container);
});

/** Fisher-Yates shuffle. Returns a new array. */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function handleAnswer(optionIndex) {
  if (state.selected !== null) return; // already answered
  const question = state.questions[state.index];
  state.selected = optionIndex;
  if (question.options[optionIndex].isCorrect) {
    state.score += 1;
  }
}

function handleAction(action) {
  if (action === 'next' && state.selected !== null) {
    state.index += 1;
    state.selected = null;
  } else if (action === 'restart') {
    state.questions = shuffle(state.questions).map(q => ({
      ...q,
      options: shuffle(q.options)
    }));
    state.index = 0;
    state.score = 0;
    state.selected = null;
  }
}

function render(container) {
  if (state.index >= state.questions.length) {
    container.innerHTML = resultHtml();
    focusElement(container, '#quiz-result-title');
    return;
  }

  container.innerHTML = questionHtml();
  focusElement(container, state.selected === null ? '#quiz-question' : '#quiz-next');
}

function focusElement(container, selector) {
  const el = container.querySelector(selector);
  if (el) el.focus();
}

function questionHtml() {
  const total = state.questions.length;
  const question = state.questions[state.index];
  const answered = state.selected !== null;
  const percent = Math.round((state.index / total) * 100);

  const optionsHtml = question.options.map((option, i) => {
    let classes = 'border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-400';
    let marker = '';

    if (answered) {
      if (option.isCorrect) {
        classes = 'border-emerald-400 bg-emerald-950 text-emerald-100';
        marker = '<span aria-hidden="true">✓ </span><span class="sr-only">Correct answer: </span>';
      } else if (i === state.selected) {
        classes = 'border-rose-400 bg-rose-950 text-rose-100';
        marker = '<span aria-hidden="true">✗ </span><span class="sr-only">Your answer, incorrect: </span>';
      } else {
        classes = 'border-slate-800 bg-slate-900 text-slate-400';
      }
    }

    return `
      <button type="button" data-option="${i}" ${answered ? 'disabled' : ''}
        class="w-full text-left px-5 py-4 rounded-xl border transition ${classes}">
        ${marker}${option.text}
      </button>
    `;
  }).join('');

  return `
    <div class="mb-8">
      <div class="flex items-center justify-between text-sm text-slate-400 mb-2">
        <span>Question ${state.index + 1} of ${total}</span>
        <span>Score: ${state.score}</span>
      </div>
      <div class="h-2 rounded-full bg-slate-800" role="progressbar" aria-label="Quiz progress"
           aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${state.index}">
        <div class="h-2 rounded-full bg-sky-400 transition-all duration-300" style="width: ${percent}%"></div>
      </div>
    </div>

    <h2 id="quiz-question" tabindex="-1" class="text-xl sm:text-2xl font-semibold leading-snug mb-6 outline-none">
      ${question.question}
    </h2>

    <div class="space-y-3" role="group" aria-labelledby="quiz-question">
      ${optionsHtml}
    </div>

    <div aria-live="polite" class="mt-8">
      ${answered ? feedbackHtml(question) : ''}
    </div>
  `;
}

function feedbackHtml(question) {
  const isLast = state.index === state.questions.length - 1;
  const wasCorrect = question.options[state.selected].isCorrect;
  const name = state.missionNames[question.mission_id];
  const linkLabel = name ? `Read the story of ${name}` : 'Read the story of this mission';

  return `
    <div class="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <p class="font-semibold mb-2 ${wasCorrect ? 'text-emerald-300' : 'text-rose-300'}">
        ${wasCorrect ? 'Correct!' : 'Not quite.'}
      </p>
      <p class="text-slate-300 leading-relaxed">${question.explanation}</p>
      <a href="mission.html?id=${question.mission_id}" class="inline-block mt-3 text-sky-400 hover:underline">
        ${linkLabel}
      </a>
    </div>
    <button type="button" id="quiz-next" data-action="next"
      class="mt-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-8 py-3 rounded-full transition">
      ${isLast ? 'See my score' : 'Next question'}
    </button>
  `;
}

function resultHtml() {
  const total = state.questions.length;
  let message;
  if (state.score === total) {
    message = 'Perfect score! You know these missions like a mission controller.';
  } else if (state.score >= Math.ceil(total * 0.6)) {
    message = 'Great work! Revisit a few missions to catch the rest.';
  } else {
    message = 'Good start! Read the mission stories and try again.';
  }

  return `
    <div class="text-center py-10">
      <h2 id="quiz-result-title" tabindex="-1" class="text-3xl sm:text-4xl font-bold mb-4 outline-none">
        You scored ${state.score} out of ${total}
      </h2>
      <p class="text-slate-300 text-lg mb-10">${message}</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button type="button" data-action="restart"
          class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-8 py-3 rounded-full transition">
          Play again
        </button>
        <a href="index.html#missions"
          class="border border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-400 px-8 py-3 rounded-full transition">
          Explore the missions
        </a>
      </div>
    </div>
  `;
}
