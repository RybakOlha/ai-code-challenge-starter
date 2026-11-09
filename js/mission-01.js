const STORAGE_KEY = 'nextlab:mission01:v1';

const defaultState = {
  currentStage: 1,
  studyFlowIssues: '',
  studyFlowQuestions: '',
  copilotCorrect: '',
  copilotUseful: '',
  copilotAssumptions: '',
  copilotRejected: '',
  ownIdeaName: '',
  ownIdeaProblem: '',
  ownIdeaAudience: '',
  ownIdeaQuestions: '',
  ownIdeaMvp: '',
  manualChange: '',
  manualPrediction: '',
  manualObservation: '',
  checklist: {},
  pbName: '',
  pbProblem: '',
  pbAudience: '',
  pbAssumptions: '',
  pbScenarios: '',
  pbMvp: '',
  pbOutOfScope: '',
  pbAcceptance: '',
  pbLimitations: '',
  reflectionSummary: '',
  reflectionNext: '',
  decisions: [
    { id: crypto.randomUUID ? crypto.randomUUID() : `decision-${Date.now()}`, proposal: '', decision: 'needs-review', rationale: '' }
  ],
  scores: {
    'score-1': '0',
    'score-2': '0',
    'score-3': '0',
    'score-4': '0',
    'score-5': '0',
    'score-6': '0'
  }
};

const currentPath = window.location.pathname;
const rootPath = currentPath.endsWith('/mission-01.html') ? './' : './';

const state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      scores: { ...defaultState.scores, ...(parsed.scores || {}) },
      checklist: { ...(parsed.checklist || {}) },
      decisions: Array.isArray(parsed.decisions) && parsed.decisions.length ? parsed.decisions : structuredClone(defaultState.decisions)
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const status = document.querySelector('#save-status');
    if (status) {
      status.textContent = 'Прогрес збережено в браузері.';
    }
  } catch {
    const status = document.querySelector('#save-status');
    if (status) {
      status.textContent = 'Не вдалося зберегти прогрес у браузері.';
    }
  }
}

function setStage(stageNumber) {
  const stages = document.querySelectorAll('.stage');
  stages.forEach((stage) => {
    const shouldShow = Number(stage.dataset.stage) === Number(stageNumber);
    stage.classList.toggle('active', shouldShow);
  });

  state.currentStage = Number(stageNumber);
  document.querySelectorAll('.step-link').forEach((button) => {
    const isActive = Number(button.dataset.target.replace('stage-', '')) === Number(stageNumber);
    button.classList.toggle('active', isActive);
  });

  saveState();
}

function updateScoreSummary() {
  const scoreSelects = document.querySelectorAll('[data-score]');
  let total = 0;

  scoreSelects.forEach((select) => {
    total += Number(select.value || 0);
  });

  const totalElement = document.querySelector('#score-total');
  const levelElement = document.querySelector('#score-level');

  if (totalElement) totalElement.textContent = String(total);

  if (levelElement) {
    let level = 'Рівень: не оцінено';
    if (total >= 10) level = 'Рівень: високий';
    else if (total >= 7) level = 'Рівень: достатній';
    else if (total >= 4) level = 'Рівень: базовий';
    else if (total > 0) level = 'Рівень: низький';
    levelElement.textContent = level;
  }
}

function checkBriefCompleteness() {
  const requiredFields = [
    ['pbName', 'Назва продукту'],
    ['pbProblem', 'Проблема'],
    ['pbAudience', 'Цільова аудиторія'],
    ['pbMvp', 'Дві основні функції MVP'],
    ['pbAcceptance', 'Один критерій успіху'],
    ['pbLimitations', 'Одне обмеження']
  ];

  const missing = requiredFields.filter(([key]) => !String(state[key] ?? '').trim());
  const status = document.querySelector('#brief-check-status');

  if (!status) return true;

  if (!missing.length) {
    status.textContent = 'Основні поля Product Brief 0.1 заповнені. Якість змісту перевіряє учень і вчитель.';
    status.classList.remove('warning-note');
    return true;
  }

  const missingLabels = missing.map(([, label]) => label).join(', ');
  status.textContent = `Для Product Brief 0.1 ще потрібні ${missingLabels}. Ви можете продовжити роботу й доповнити їх пізніше.`;
  status.classList.add('warning-note');
  return false;
}

const ideaToBrief = {
  ownIdeaName: 'pbName',
  ownIdeaProblem: 'pbProblem',
  ownIdeaAudience: 'pbAudience',
  ownIdeaMvp: 'pbMvp'
};

function syncBriefFromIdea(ideaKey, previousValue) {
  const briefKey = ideaToBrief[ideaKey];
  if (!briefKey) return;
  const current = String(state[briefKey] || '');
  if (current.trim() && current !== String(previousValue || '')) return;
  state[briefKey] = state[ideaKey] || '';
  const briefInput = document.querySelector(`[data-key="${briefKey}"]`);
  if (briefInput) briefInput.value = state[briefKey];
}

function bindTextField(selector, key) {
  const element = document.querySelector(selector);
  if (!element) return;

  element.value = state[key] ?? '';

  if (element.dataset.boundInput === 'yes') return;
  element.dataset.boundInput = 'yes';
  element.addEventListener('input', (event) => {
    const previousValue = state[key];
    state[key] = event.target.value;
    syncBriefFromIdea(key, previousValue);
    saveState();
  });
}

function bindScoreSelect() {
  document.querySelectorAll('[data-score]').forEach((select) => {
    const key = select.id;
    select.value = state.scores?.[key] ?? '0';

    if (select.dataset.boundScore === 'yes') return;
    select.dataset.boundScore = 'yes';
    select.addEventListener('change', (event) => {
      state.scores[key] = String(event.target.value || '0');
      updateScoreSummary();
      saveState();
    });
  });

  updateScoreSummary();
}

function renderDecisions() {
  const decisionsContainer = document.querySelector('#decisions-list');
  if (!decisionsContainer) return;

  decisionsContainer.innerHTML = '';

  state.decisions.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'decision-row';
    row.innerHTML = `
      <div class="decision-top">
        <label>Пропозиція ШІ або власне рішення</label>
      </div>
      <textarea data-role="proposal" aria-label="Пропозиція ШІ або власне рішення">${escapeHtml(entry.proposal || '')}</textarea>
      <label>Рішення</label>

      <select data-role="decision" aria-label="Рішення      щодо пропозиції">
        <option value="accepted" ${entry.decision ===       'accepted' ? 'selected' : ''}>Прийнято</option>
        <option value="modified" ${entry.decision ===       'modified' ? 'selected' : ''}>Прийнято зі       змінами</option>
        <option value="rejected" ${entry.decision ===       'rejected' ? 'selected' : ''}>Відхилено</     option>
        <option value="needs-review" ${entry.decision       === 'needs-review' ? 'selected' : ''}>Потребує      уточнення</option>
      </select>

      <label>Чому так?</label>
      <textarea data-role="rationale" aria-label="Пояснення рішення">${escapeHtml(entry.rationale || '')}</textarea>
      <button type="button" class="button secondary remove-decision" data-id="${entry.id}">Видалити запис</button>
    `;

    decisionsContainer.appendChild(row);
  });

  decisionsContainer.querySelectorAll('[data-role="proposal"]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      const row = event.target.closest('.decision-row');
      const itemId = row.querySelector('.remove-decision')?.dataset.id;
      const item = state.decisions.find((decision) => decision.id === itemId);
      if (item) item.proposal = event.target.value;
      saveState();
    });
  });

  decisionsContainer.querySelectorAll('[data-role="decision"]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const row = event.target.closest('.decision-row');
      const itemId = row.querySelector('.remove-decision')?.dataset.id;
      const item = state.decisions.find((decision) => decision.id === itemId);
      if (item) item.decision = event.target.value;
      saveState();
    });
  });

  decisionsContainer.querySelectorAll('[data-role="rationale"]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      const row = event.target.closest('.decision-row');
      const itemId = row.querySelector('.remove-decision')?.dataset.id;
      const item = state.decisions.find((decision) => decision.id === itemId);
      if (item) item.rationale = event.target.value;
      saveState();
    });
  });

  decisionsContainer.querySelectorAll('.remove-decision').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      state.decisions = state.decisions.filter((decision) => decision.id !== id);
      if (!state.decisions.length) {
        state.decisions = [{ id: makeId(), proposal: '', decision: 'accepted', rationale: '' }];
      }
      renderDecisions();
      saveState();
    });
  });
}

function makeId() {
  return `decision-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, structuredClone(defaultState));
  hydrateFromState();
  saveState();
}

function hydrateFromState() {
  bindTextField('#study-flow-issues', 'studyFlowIssues');
  bindTextField('#study-flow-questions', 'studyFlowQuestions');
  bindTextField('#copilot-correct', 'copilotCorrect');
  bindTextField('#copilot-useful', 'copilotUseful');
  bindTextField('#copilot-assumptions', 'copilotAssumptions');
  bindTextField('#copilot-rejected', 'copilotRejected');
  bindTextField('#own-idea-name', 'ownIdeaName');
  bindTextField('#own-idea-problem', 'ownIdeaProblem');
  bindTextField('#own-idea-audience', 'ownIdeaAudience');
  bindTextField('#own-idea-questions', 'ownIdeaQuestions');
  bindTextField('#own-idea-mvp', 'ownIdeaMvp');
  bindTextField('#manual-change', 'manualChange');
  bindTextField('#manual-prediction', 'manualPrediction');
  bindTextField('#manual-observation', 'manualObservation');
  bindTextField('#pb-name', 'pbName');
  bindTextField('#pb-problem', 'pbProblem');
  bindTextField('#pb-audience', 'pbAudience');
  bindTextField('#pb-assumptions', 'pbAssumptions');
  bindTextField('#pb-scenarios', 'pbScenarios');
  bindTextField('#pb-mvp', 'pbMvp');
  bindTextField('#pb-out-of-scope', 'pbOutOfScope');
  bindTextField('#pb-acceptance', 'pbAcceptance');
  bindTextField('#pb-limitations', 'pbLimitations');
  bindTextField('#reflection-summary', 'reflectionSummary');
  bindTextField('#reflection-next', 'reflectionNext');
  bindScoreSelect();
  document.querySelectorAll('[data-check]').forEach((el) => { el.checked = !!state.checklist[el.dataset.check]; });
  renderDecisions();
  setStage(state.currentStage || 1);
}

function copyPrompt(textId) {
  const field = document.querySelector(`#${textId}`);
  if (!field) return;

  const value = field.value;
  if (!navigator.clipboard) {
    field.select();
    document.execCommand('copy');
    return;
  }

  navigator.clipboard.writeText(value)
    .then(() => {
      const status = document.querySelector('#save-status');
      if (status) {
        status.textContent = 'Prompt скопійовано.';
      }
    })
    .catch(() => {
      const status = document.querySelector('#save-status');
      if (status) {
        status.textContent = 'Копіювання не підтримується у цьому браузері.';
      }
    });
}

function buildProductBriefMarkdown() {
  const brief = {
    title: state.pbName || 'Назва не вказана',
    problem: state.pbProblem || 'Не вказано',
    audience: state.pbAudience || 'Не вказано',
    assumptions: state.pbAssumptions || 'Не вказано',
    scenarios: state.pbScenarios || 'Не вказано',
    mvp: state.pbMvp || 'Не вказано',
    outOfScope: state.pbOutOfScope || 'Не вказано',
    acceptance: state.pbAcceptance || 'Не вказано',
    limitations: state.pbLimitations || 'Не вказано'
  };

  return `# Product Brief\n\n## Назва продукту\n${brief.title}\n\n## Проблема\n${brief.problem}\n\n## Цільова аудиторія\n${brief.audience}\n\n## Припущення, які треба перевірити\n${brief.assumptions}\n\n## Два ключові сценарії\n${brief.scenarios}\n\n## MVP: дві основні функції\n${brief.mvp}\n\n## Що свідомо не реалізуємо\n${brief.outOfScope}\n\n## Критерії приймання\n${brief.acceptance}\n\n## Обмеження\n${brief.limitations}\n`;
}


function buildDecisionsMarkdown() {
  const filledDecisions = state.decisions.filter((entry) => {
    const hasProposal = String(entry.proposal ?? '').trim() !== '';
    const hasRationale = String(entry.rationale ?? '').trim() !== '';

    return hasProposal || hasRationale;
  });

  const lines = [
    '# Журнал рішень',
    '',
    '## Процес аналізу вимог',
    '',
    ...filledDecisions.map((entry) =>
      `- **Пропозиція:** ${entry.proposal || 'Не вказано'}
  - **Рішення:** ${
entry.decision === 'accepted' ? 'Прийнято' :
entry.decision === 'modified' ? 'Прийнято зі змінами' :
entry.decision === 'rejected' ? 'Відхилено' :
'Потребує уточнення'
}
  - **Чому:** ${entry.rationale || 'Не вказано'}`
    ),
    '',
    '## Рефлексія',
    '',
    state.reflectionSummary || 'Не вказано.'
  ];

  return lines.join('\n');
}


function exportFile(filename, content, mime = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function attachEvents() {
  document.querySelectorAll('.step-link').forEach((button) => {
    button.addEventListener('click', () => {
      setStage(Number(button.dataset.target.replace('stage-', '')));
    });
  });

  document.querySelectorAll('.next-stage').forEach((button) => {
    button.addEventListener('click', () => {
      const current = Number(document.querySelector('.stage.active')?.dataset.stage || 1);
      setStage(Math.min(current + 1, 6));
    });
  });

  document.querySelectorAll('.prev-stage').forEach((button) => {
    button.addEventListener('click', () => {
      const current = Number(document.querySelector('.stage.active')?.dataset.stage || 1);
      setStage(Math.max(current - 1, 1));
    });
  });

  document.querySelectorAll('.copy-prompt').forEach((button) => {
    button.addEventListener('click', () => {
      copyPrompt(button.dataset.copy);
    });
  });

  document.querySelector('#add-decision').addEventListener('click', () => {
    state.decisions.push({
      id: makeId(),
      proposal: '',
      decision: 'needs-review',
      rationale: ''
    });
    renderDecisions();
    saveState();
  });

  document.querySelector('#export-product-brief').addEventListener('click', () => {
    checkBriefCompleteness();
    exportFile('PRODUCT_BRIEF.md', buildProductBriefMarkdown());
  });

  document.querySelector('#export-decisions').addEventListener('click', () => {
    exportFile('DECISIONS.md', buildDecisionsMarkdown());
  });

  document.querySelector('#save-progress').addEventListener('click', () => {
    saveState();
  });

  document.querySelector('#reset-progress').addEventListener('click', () => {
    if (window.confirm('Скинути всі відповіді, оцінки та журнал? Перед цим рекомендуємо експортувати JSON.')) resetProgress();
  });

  document.querySelector('#export-json').addEventListener('click', () => {
    saveState();
    exportFile('NEXTLAB_MISSION01_PROGRESS.json', JSON.stringify({format: 'nextlab-mission01', version: 2, exportedAt: new Date().toISOString(), state}, null, 2), 'application/json;charset=utf-8');
  });

  document.querySelector('#import-json').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Файл завеликий.');
      const data = JSON.parse(await file.text());
      if (data.format !== 'nextlab-mission01' || data.version !== 2 || !data.state || typeof data.state !== 'object' || Array.isArray(data.state)) {
        throw new Error('Це не файл прогресу NextLab Mission 01 версії 2.');
      }
      if (!window.confirm('Замінити поточний прогрес даними з JSON?')) return;
      const incoming = data.state;
      for (const key of Object.keys(defaultState)) {
        if (key === 'decisions' || key === 'scores' || key === 'checklist') continue;
        if (typeof defaultState[key] === 'string' && typeof incoming[key] === 'string') state[key] = incoming[key].slice(0, 20000);
      }
      state.currentStage = Number.isInteger(incoming.currentStage) && incoming.currentStage >= 1 && incoming.currentStage <= 6 ? incoming.currentStage : 1;
      state.decisions = Array.isArray(incoming.decisions) ? incoming.decisions.slice(0, 100).filter(x => x && typeof x === 'object').map(x => ({id: makeId(), proposal: String(x.proposal || '').slice(0, 20000), decision: ['accepted','rejected', 'modified', 'needs-review'].includes(x.decision) ? x.decision : 'needs-review', rationale: String(x.rationale || '').slice(0, 20000)})) : structuredClone(defaultState.decisions);
      if (!state.decisions.length) state.decisions = structuredClone(defaultState.decisions);
      state.scores = Object.fromEntries(Object.keys(defaultState.scores).map(k => [k, ['0','1','2'].includes(String(incoming.scores?.[k])) ? String(incoming.scores[k]) : '0']));
      state.checklist = Object.fromEntries(['figma','fragment','browser','independent','journal'].map(k => [k, incoming.checklist?.[k] === true]));
      hydrateFromState();
      saveState();
      document.querySelector('#save-status').textContent = 'Прогрес відновлено з JSON.';
    } catch (error) {
      document.querySelector('#save-status').textContent = `Помилка імпорту: ${error.message}`;
    } finally {
      event.target.value = '';
    }
  });

  document.querySelectorAll('[data-check]').forEach(el => {
    el.addEventListener('change', () => {
      state.checklist[el.dataset.check] = el.checked;
      saveState();
    });
  });

  hydrateFromState();

}

attachEvents();

window.addEventListener('beforeunload', saveState);
