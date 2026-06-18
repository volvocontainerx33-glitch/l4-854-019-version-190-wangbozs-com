const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function bindMenu() {
  const button = qs('.menu-toggle');
  const panel = qs('.mobile-panel');
  if (!button || !panel) {
    return;
  }
  button.addEventListener('click', () => {
    const open = panel.hasAttribute('hidden');
    if (open) {
      panel.removeAttribute('hidden');
      button.setAttribute('aria-expanded', 'true');
      button.textContent = '×';
    } else {
      panel.setAttribute('hidden', '');
      button.setAttribute('aria-expanded', 'false');
      button.textContent = '☰';
    }
  });
}

function bindSearchForms() {
  qsa('.search-form, .big-search').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = qs('input[name="q"]', form);
      const target = form.dataset.searchTarget || 'search.html';
      const query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = `${target}?q=${encodeURIComponent(query)}`;
      } else {
        window.location.href = target;
      }
    });
  });
}

function bindHero() {
  const carousel = qs('[data-carousel]');
  if (!carousel) {
    return;
  }
  const slides = qsa('.hero-slide', carousel);
  const dotsBox = qs('[data-dots]', carousel);
  let index = 0;
  let timer = null;

  function renderDots() {
    if (!dotsBox) {
      return;
    }
    dotsBox.innerHTML = '';
    slides.forEach((_, dotIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = dotIndex === index ? 'hero-dot active' : 'hero-dot';
      dot.setAttribute('aria-label', `切换到第 ${dotIndex + 1} 屏`);
      dot.addEventListener('click', () => show(dotIndex));
      dotsBox.appendChild(dot);
    });
  }

  function show(nextIndex) {
    if (!slides.length) {
      return;
    }
    slides[index].classList.remove('active');
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add('active');
    qsa('.hero-dot', carousel).forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function restart() {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5000);
  }

  const prev = qs('[data-prev]', carousel);
  const next = qs('[data-next]', carousel);
  if (prev) {
    prev.addEventListener('click', () => {
      show(index - 1);
      restart();
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      show(index + 1);
      restart();
    });
  }
  renderDots();
  restart();
}

function bindLocalFilter() {
  qsa('[data-local-filter]').forEach((form) => {
    const input = qs('input', form);
    const list = qs('[data-filter-list]');
    if (!input || !list) {
      return;
    }
    input.addEventListener('input', () => filterCards(list, input.value));
  });
}

function filterCards(list, value) {
  const query = value.trim().toLowerCase();
  qsa('.movie-card', list).forEach((card) => {
    const text = card.dataset.search || card.textContent.toLowerCase();
    card.hidden = Boolean(query) && !text.includes(query);
  });
}

function bindSearchPage() {
  const page = qs('[data-search-page]');
  if (!page) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const input = qs('#search-main', page);
  const list = qs('[data-filter-list]', page);
  const heading = qs('#search-heading', page);
  if (input) {
    input.value = query;
    input.addEventListener('input', () => filterCards(list, input.value));
  }
  if (heading && query) {
    heading.textContent = `“${query}” 的筛选结果`;
  }
  if (list) {
    filterCards(list, query);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bindMenu();
  bindSearchForms();
  bindHero();
  bindLocalFilter();
  bindSearchPage();
});
