function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

function initNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", function () {
    menu.classList.toggle("is-open");
  });
}

function initHero() {
  const carousel = document.querySelector("[data-hero-carousel]");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
  const prev = carousel.querySelector("[data-hero-prev]");
  const next = carousel.querySelector("[data-hero-next]");
  let active = 0;
  let timer = null;

  function show(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === active);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(active + 1);
    }, 5200);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (prev) {
    prev.addEventListener("click", function () {
      show(active - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      show(active + 1);
      start();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const index = Number(dot.getAttribute("data-hero-dot") || 0);
      show(index);
      start();
    });
  });

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  show(0);
  start();
}

function initFilters() {
  const panels = Array.from(document.querySelectorAll("[data-card-list]"));

  panels.forEach(function (list) {
    const selector = "#" + list.id;
    const input = document.querySelector('[data-search-input][data-target="' + selector + '"]');
    const buttonWrap = document.querySelector('[data-filter-buttons][data-target="' + selector + '"]');
    let filterValue = "all";

    function apply() {
      const query = input ? input.value.trim().toLowerCase() : "";
      const cards = Array.from(list.querySelectorAll("[data-card]"));

      cards.forEach(function (card) {
        const haystack = (card.getAttribute("data-search") || "").toLowerCase();
        const category = card.getAttribute("data-category") || "";
        const region = card.getAttribute("data-region") || "";
        const type = card.getAttribute("data-type") || "";
        const matchesText = !query || haystack.indexOf(query) !== -1;
        const matchesFilter = filterValue === "all" || category === filterValue || region === filterValue || type === filterValue;
        card.classList.toggle("is-hidden", !(matchesText && matchesFilter));
      });
    }

    if (input) {
      input.addEventListener("input", apply);

      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");

      if (query) {
        input.value = query;
      }
    }

    if (buttonWrap) {
      const buttons = Array.from(buttonWrap.querySelectorAll("[data-filter-value]"));
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          filterValue = button.getAttribute("data-filter-value") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          apply();
        });
      });
    }

    apply();
  });
}

ready(function () {
  initNavigation();
  initHero();
  initFilters();
});
