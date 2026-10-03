(() => {
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];

  const filter = q('#finding-filter');
  if (filter) {
    const rows = qa('#finding-table tbody tr');
    filter.addEventListener('change', () => {
      rows.forEach((row) => {
        row.hidden = filter.value !== 'all' && row.dataset.type !== filter.value;
      });
    });
  }

  const scanForm = q('#readiness-scan');
  if (scanForm) {
    scanForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const questions = qa('[data-scan-question]', scanForm);
      const unanswered = questions.filter((node) => !q('input:checked', node));
      const error = q('#scan-error');
      if (unanswered.length) {
        error.textContent = `Answer all ${questions.length} control questions to calculate a defensible score.`;
        error.hidden = false;
        unanswered[0].scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      error.hidden = true;
      const points = { yes: 1, partial: 0.5, no: 0 };
      let total = 0;
      const priorities = [];
      questions.forEach((node) => {
        const selected = q('input:checked', node);
        const value = selected.value;
        total += points[value];
        if (value !== 'yes') priorities.push(node.dataset.priority);
      });
      const score = Math.round((total / questions.length) * 100);
      let band = 'Records need preparation';
      if (score >= 85) band = 'Records appear ready';
      else if (score >= 65) band = 'Some records need follow-up';
      else if (score >= 40) band = 'Several records need follow-up';
      else band = 'Records need preparation';
      q('#scan-score').textContent = String(score);
      q('#scan-band').textContent = band;
      const list = q('#scan-priorities');
      list.innerHTML = '';
      (priorities.length ? priorities.slice(0,4) : ['Maintain evidence quality and test the full authority-to-ledger chain periodically.']).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      const result = q('#scan-result');
      result.classList.add('visible');
      result.scrollIntoView({behavior:'smooth', block:'start'});
      try { sessionStorage.setItem('tallyridge_readiness_score', String(score)); } catch (_) {}
    });
  }

  const requestForm = q('#baseline-request-form');
  if (requestForm) {
    const output = q('#brief-output');
    const success = q('#brief-success');
    const buildBrief = () => {
      const data = new FormData(requestForm);
      const fields = Object.fromEntries(data.entries());
      let readiness = '';
      try { readiness = sessionStorage.getItem('tallyridge_readiness_score') || ''; } catch (_) {}
      return [
        'TALLYRIDGE ASSURANCE — DEVELOPMENT FEE REVIEW REQUEST',
        '',
        `Agency: ${fields.agency || 'Not provided'}`,
        `Department / office: ${fields.role || 'Not provided'}`,
        `Jurisdiction / state: ${fields.jurisdiction || 'Not provided'}`,
        `Records available: ${fields.systems || 'Not provided'}`,
        `Primary review area: ${fields.scope || 'Not provided'}`,
        `Desired review period: ${fields.timing || 'Not provided'}`,
        readiness ? `Records readiness checklist: ${readiness}/100` : 'Readiness scan score: Not completed',
        '',
        'Reason for review:',
        fields.context || 'Not provided',
        '',
        'Requested review:',
        'Review the selected development fee records and prepare findings for agency staff review.',
        '',
        'Prepared at tallyridge-assurance-2.vercel.app. Information entered on this page was not submitted.'
      ].join('\n');
    };
    requestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      output.textContent = buildBrief();
      success.classList.add('visible');
      output.scrollIntoView({behavior:'smooth', block:'center'});
    });
    q('#copy-brief')?.addEventListener('click', async () => {
      const brief = output.textContent.trim() || buildBrief();
      output.textContent = brief;
      try {
        await navigator.clipboard.writeText(brief);
        success.textContent = 'Baseline request brief copied to your clipboard.';
        success.classList.add('visible');
      } catch (_) {
        success.textContent = 'Clipboard access is unavailable in this browser. Select the generated brief and copy it manually.';
        success.classList.add('visible');
      }
    });
    q('#download-brief')?.addEventListener('click', () => {
      const brief = output.textContent.trim() || buildBrief();
      output.textContent = brief;
      const blob = new Blob([brief], {type:'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tallyridge-impact-fee-assurance-baseline-request.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      success.textContent = 'Baseline request brief downloaded.';
      success.classList.add('visible');
    });
  }
})();
