(() => {
  const filter = document.querySelector('#finding-filter');
  const rows = [...document.querySelectorAll('#finding-table tbody tr')];
  if (!filter || !rows.length) return;
  filter.addEventListener('change', () => {
    const value = filter.value;
    rows.forEach(row => {
      row.hidden = value !== 'all' && row.dataset.type !== value;
    });
  });
})();
