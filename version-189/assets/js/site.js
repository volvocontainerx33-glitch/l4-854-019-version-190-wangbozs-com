const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function normalizeText(value) {
  return (value || '').toString().toLowerCase().trim();
}

function setupMobileMenu() {
  const button = $('.js-menu-button');
  const panel = $('.js-mobile-panel');

  if (!button || !panel) {
    return;
  }

  button.addEventListener('click', () => {
    const willOpen = panel.hasAttribute('hidden');
    panel.toggleAttribute('hidden', !willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
  });
}

function setupSearchForms() {
  $$('.js-search-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const query = input ? input.value.trim() : '';
      const target = query ? `search.html?q=${encodeURIComponent(query)}` : 'search.html';
      window.location.href = target;
    });
  });
}

function setupHeroCarousel() {
  const slides = $$('[data-hero-slide]');
  const dots = $$('[data-hero-dot]');
  const prev = $('[data-hero-prev]');
  const next = $('[data-hero-next]');

  if (slides.length <= 1) {
    return;
  }

  let current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => showSlide(current + 1), 5000);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  prev?.addEventListener('click', () => {
    showSlide(current - 1);
    startTimer();
  });

  next?.addEventListener('click', () => {
    showSlide(current + 1);
    startTimer();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.heroDot || 0);
      showSlide(index);
      startTimer();
    });
  });

  const hero = $('.hero');
  hero?.addEventListener('mouseenter', stopTimer);
  hero?.addEventListener('mouseleave', startTimer);
  startTimer();
}

function setupLocalFilters() {
  const panel = $('[data-filter-panel]');

  if (!panel) {
    return;
  }

  const cards = $$('[data-filter-card]');
  const searchInput = $('.js-local-search', panel);
  const regionSelect = $('.js-filter-region', panel);
  const typeSelect = $('.js-filter-type', panel);
  const yearSelect = $('.js-filter-year', panel);
  const resetButton = $('.js-filter-reset', panel);
  const count = $('.js-filter-count', panel);
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';

  if (searchInput && query) {
    searchInput.value = query;
  }

  function cardMatches(card) {
    const text = normalizeText(card.dataset.search);
    const title = normalizeText(card.dataset.title);
    const search = normalizeText(searchInput?.value);
    const region = regionSelect?.value || '';
    const type = typeSelect?.value || '';
    const year = yearSelect?.value || '';

    const searchOk = !search || text.includes(search) || title.includes(search);
    const regionOk = !region || card.dataset.region === region;
    const typeOk = !type || card.dataset.type === type;
    const yearOk = !year || card.dataset.year === year;

    return searchOk && regionOk && typeOk && yearOk;
  }

  function applyFilters() {
    let visible = 0;

    cards.forEach((card) => {
      const matches = cardMatches(card);
      card.classList.toggle('is-hidden', !matches);
      if (matches) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = String(visible);
    }
  }

  [searchInput, regionSelect, typeSelect, yearSelect].forEach((control) => {
    control?.addEventListener('input', applyFilters);
    control?.addEventListener('change', applyFilters);
  });

  resetButton?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
    }
    if (regionSelect) {
      regionSelect.value = '';
    }
    if (typeSelect) {
      typeSelect.value = '';
    }
    if (yearSelect) {
      yearSelect.value = '';
    }
    applyFilters();
  });

  applyFilters();
}

setupMobileMenu();
setupSearchForms();
setupHeroCarousel();
setupLocalFilters();
