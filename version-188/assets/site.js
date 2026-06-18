(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initMobileNav() {
    var toggle = $('.mobile-toggle');
    var panel = $('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initHero() {
    var hero = $('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = $all('[data-hero-slide]', hero);
    var dots = $all('[data-hero-dot]', hero);
    var prev = $('[data-hero-prev]', hero);
    var next = $('[data-hero-next]', hero);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initCardFilters() {
    var panel = $('.filter-panel');
    if (!panel) {
      return;
    }
    var input = $('[data-filter-input]', panel);
    var year = $('[data-filter-year]', panel);
    var type = $('[data-filter-type]', panel);
    var region = $('[data-filter-region]', panel);
    var category = $('[data-filter-category]', panel);
    var count = $('[data-filter-count]', panel);
    var cards = $all('[data-card]');

    function matches(card) {
      var q = normalize(input && input.value);
      var cardText = normalize(card.getAttribute('data-search'));
      var okQuery = !q || cardText.indexOf(q) >= 0;
      var okYear = !year || !year.value || card.getAttribute('data-year') === year.value;
      var okType = !type || !type.value || card.getAttribute('data-type') === type.value;
      var okRegion = !region || !region.value || card.getAttribute('data-region') === region.value;
      var okCategory = !category || !category.value || card.getAttribute('data-category') === category.value;
      return okQuery && okYear && okType && okRegion && okCategory;
    }

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var ok = matches(card);
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (count) {
        count.textContent = '当前显示 ' + visible + ' 部影片';
      }
    }

    [input, year, type, region, category].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
    apply();
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="poster" href="' + movie.file + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '<img src="' + movie.poster + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">',
      '<span class="poster-shade"></span>',
      '<span class="play-icon">▶</span>',
      '<em class="score">' + Number(movie.score).toFixed(1) + '</em>',
      '</a>',
      '<div class="card-body">',
      '<h3><a href="' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p class="card-summary">' + escapeHtml(movie.one_line || '') + '</p>',
      '<div class="card-meta"><span>' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</span></div>',
      '<div class="tag-row">' + tags + '<a href="' + movie.category_file + '">' + escapeHtml(movie.category) + '</a></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initSearchPage() {
    var root = $('[data-search-page]');
    if (!root || !window.MOVIE_INDEX) {
      return;
    }
    var queryInput = $('[data-search-query]', root);
    var typeSelect = $('[data-search-type]', root);
    var regionSelect = $('[data-search-region]', root);
    var yearSelect = $('[data-search-year]', root);
    var categorySelect = $('[data-search-category]', root);
    var results = $('[data-search-results]', root);
    var count = $('[data-search-count]', root);
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (queryInput) {
      queryInput.value = initial;
    }

    function filterMovie(movie) {
      var q = normalize(queryInput && queryInput.value);
      var text = normalize([movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, movie.one_line, (movie.tags || []).join(' ')].join(' '));
      if (q && text.indexOf(q) < 0) {
        return false;
      }
      if (typeSelect && typeSelect.value && movie.type !== typeSelect.value) {
        return false;
      }
      if (regionSelect && regionSelect.value && movie.region !== regionSelect.value) {
        return false;
      }
      if (yearSelect && yearSelect.value && movie.year !== yearSelect.value) {
        return false;
      }
      if (categorySelect && categorySelect.value && movie.category !== categorySelect.value) {
        return false;
      }
      return true;
    }

    function render() {
      var matched = window.MOVIE_INDEX.filter(filterMovie).slice(0, 160);
      if (count) {
        count.textContent = '匹配 ' + window.MOVIE_INDEX.filter(filterMovie).length + ' 部影片，当前展示前 ' + matched.length + ' 部';
      }
      if (!results) {
        return;
      }
      if (!matched.length) {
        results.innerHTML = '<div class="empty-state">暂未匹配到影片，请尝试更换关键词或筛选条件。</div>';
        return;
      }
      results.innerHTML = matched.map(cardTemplate).join('');
    }

    [queryInput, typeSelect, regionSelect, yearSelect, categorySelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', render);
        el.addEventListener('change', render);
      }
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initHero();
    initCardFilters();
    initSearchPage();
  });
})();
