(async function () {
  const grid = document.getElementById('grid');
  const tpl = document.getElementById('card-tpl');
  const search = document.getElementById('search');
  const sortSel = document.getElementById('sort');

  let items = [];
  try {
    const resp = await fetch('catalog.json', { cache: 'no-store' });
    items = await resp.json();
  } catch (e) {
    console.error('Failed to load catalog.json', e);
  }

  function render(list) {
    grid.innerHTML = '';
    for (const item of list) {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector('.card');
      const img = node.querySelector('.thumb');
      const play = node.querySelector('.play-btn');
      const link = node.querySelector('.thumb-link');
      const title = node.querySelector('.card-title');
      const summary = node.querySelector('.card-summary');
      const meta = node.querySelector('.card-meta');

      const href = `games/${item.slug}/`;
      img.src = item.thumbnail || `games/${item.slug}/thumb.svg`;
      img.alt = item.title;
      play.href = href;
      link.href = href;

      title.textContent = item.title;
      summary.textContent = item.summary;
      const date = new Date(item.added_at);
      meta.textContent = `Added ${date.toLocaleDateString()} • ${item.play_count ?? 0} plays`;

      grid.appendChild(node);
    }
  }

  function filterAndSort() {
    const q = (search.value || '').toLowerCase().trim();
    let filtered = items.filter(x =>
      x.title.toLowerCase().includes(q) || x.summary.toLowerCase().includes(q)
    );

    switch (sortSel.value) {
      case 'title-asc': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'title-desc': filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'date-asc': filtered.sort((a, b) => new Date(a.added_at) - new Date(b.added_at)); break;
      default:
      case 'date-desc': filtered.sort((a, b) => new Date(b.added_at) - new Date(a.added_at)); break;
    }
    render(filtered);
  }

  search.addEventListener('input', filterAndSort);
  sortSel.addEventListener('change', filterAndSort);

  filterAndSort();
})();
