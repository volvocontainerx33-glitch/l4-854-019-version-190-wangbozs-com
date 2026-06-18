(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const previous = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    if (slides.length > 0) {
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });

      if (previous) {
        previous.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      show(0);
      start();
    }
  }

  const redirectForm = document.querySelector("[data-search-redirect]");

  if (redirectForm) {
    redirectForm.addEventListener("submit", function (event) {
      const input = redirectForm.querySelector("input[name='q']");
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = "./search.html";
      }
    });
  }

  const searchInput = document.querySelector("[data-live-search]");
  const grid = document.querySelector("[data-filter-grid]");
  const chips = Array.from(document.querySelectorAll("[data-filter-chip]"));

  function applyFilter(value) {
    if (!grid) {
      return;
    }

    const keyword = (value || "").trim().toLowerCase();
    const cards = Array.from(grid.querySelectorAll("[data-card-search]"));

    cards.forEach(function (card) {
      const haystack = card.getAttribute("data-card-search") || "";
      card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
    });
  }

  if (searchInput && grid) {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q") || "";

    if (searchInput.hasAttribute("data-url-query") && query) {
      searchInput.value = query;
      applyFilter(query);
    }

    searchInput.addEventListener("input", function () {
      chips.forEach(function (chip) {
        chip.classList.remove("is-active");
      });
      applyFilter(searchInput.value);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const value = chip.getAttribute("data-filter-chip") || "";
      chips.forEach(function (item) {
        item.classList.toggle("is-active", item === chip);
      });
      if (searchInput) {
        searchInput.value = value;
      }
      applyFilter(value);
    });
  });
})();
