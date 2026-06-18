(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var target = './search.html';

        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }

        window.location.href = target;
      });
    });

    document.querySelectorAll('[data-local-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        runFilter(form);
      });
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var filterInput = document.querySelector('[data-filter-input]');

    if (filterInput) {
      if (query) {
        filterInput.value = query;
      }

      filterInput.addEventListener('input', function () {
        runFilter(filterInput.closest('form') || document);
      });

      runFilter(filterInput.closest('form') || document);
    }

    document.querySelectorAll('[data-filter-chip]').forEach(function (button) {
      button.addEventListener('click', function () {
        var input = document.querySelector('[data-filter-input]');
        if (!input) {
          return;
        }
        input.value = button.getAttribute('data-filter-chip') || '';
        runFilter(input.closest('form') || document);
      });
    });

    document.querySelectorAll('[data-rail-button]').forEach(function (button) {
      button.addEventListener('click', function () {
        var wrap = button.closest('.rail-wrap');
        var rail = wrap ? wrap.querySelector('[data-rail]') : null;
        if (!rail) {
          return;
        }
        var direction = button.getAttribute('data-rail-button') === 'left' ? -1 : 1;
        rail.scrollBy({ left: direction * 340, behavior: 'smooth' });
      });
    });

    initHero();

    document.querySelectorAll('[data-scroll-player]').forEach(function (link) {
      link.addEventListener('click', function () {
        var player = document.querySelector('#player');
        if (player) {
          player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  });

  function runFilter(context) {
    var input = document.querySelector('[data-filter-input]');
    var scope = document.querySelector('[data-filter-scope]') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');
    var query = input ? input.value.trim().toLowerCase() : '';
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-year'),
        card.textContent
      ].join(' ').toLowerCase();
      var match = !query || haystack.indexOf(query) !== -1;
      card.hidden = !match;
      if (match) {
        shown += 1;
      }
    });

    if (empty) {
      empty.hidden = shown !== 0;
    }
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }
})();
