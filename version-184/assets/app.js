(function () {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  if (header) {
    const updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const show = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    const restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.dataset.heroDot || 0));
        restart();
      });
    });

    show(0);
    restart();
  });

  document.querySelectorAll('.rail-wrap').forEach(function (wrap) {
    const rail = wrap.querySelector('[data-rail]');
    const left = wrap.querySelector('[data-rail-left]');
    const right = wrap.querySelector('[data-rail-right]');

    if (!rail) {
      return;
    }

    const scrollByCard = function (direction) {
      const amount = Math.min(360, Math.max(260, Math.floor(rail.clientWidth * 0.72)));
      rail.scrollBy({
        left: direction * amount,
        behavior: 'smooth'
      });
    };

    if (left) {
      left.addEventListener('click', function () {
        scrollByCard(-1);
      });
    }

    if (right) {
      right.addEventListener('click', function () {
        scrollByCard(1);
      });
    }
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (panel) {
    const input = panel.querySelector('[data-filter-input]');
    const category = panel.querySelector('[data-filter-category]');
    const year = panel.querySelector('[data-filter-year]');
    const reset = panel.querySelector('[data-filter-reset]');
    const count = panel.querySelector('[data-filter-count]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

    const filter = function () {
      const query = input ? input.value.trim().toLowerCase() : '';
      const selectedCategory = category ? category.value : '';
      const selectedYear = year ? year.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = (card.dataset.search || '').toLowerCase();
        const matchText = !query || haystack.indexOf(query) >= 0;
        const matchCategory = !selectedCategory || card.dataset.category === selectedCategory;
        const matchYear = !selectedYear || card.dataset.year === selectedYear;
        const show = matchText && matchCategory && matchYear;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '当前显示 ' + visible + ' 部影片';
      }
    };

    if (input) {
      input.addEventListener('input', filter);
    }
    if (category) {
      category.addEventListener('change', filter);
    }
    if (year) {
      year.addEventListener('change', filter);
    }
    if (reset) {
      reset.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        if (category) {
          category.value = '';
        }
        if (year) {
          year.value = '';
        }
        filter();
      });
    }

    filter();
  });

  document.querySelectorAll('[data-scroll-player]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const player = document.querySelector('[data-player]');
      if (player) {
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const play = player.querySelector('[data-player-play]');
        if (play) {
          play.click();
        }
      }
    });
  });
})();
