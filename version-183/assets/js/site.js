(function() {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function() {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function() {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    var input = document.querySelector("[data-search-input]");
    var lists = Array.prototype.slice.call(document.querySelectorAll("[data-search-list]"));
    var yearButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-year]"));
    var activeYear = "all";

    function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        lists.forEach(function(list) {
            var cards = Array.prototype.slice.call(list.querySelectorAll(".searchable-card"));
            cards.forEach(function(card) {
                var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                var year = card.getAttribute("data-year") || "";
                var matchedText = !keyword || text.indexOf(keyword) > -1;
                var matchedYear = activeYear === "all" || year === activeYear;
                card.classList.toggle("is-hidden-by-filter", !(matchedText && matchedYear));
            });
        });
    }

    if (input) {
        input.addEventListener("input", applyFilter);
    }

    yearButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            activeYear = button.getAttribute("data-filter-year") || "all";
            yearButtons.forEach(function(item) {
                item.classList.toggle("is-active", item === button);
            });
            applyFilter();
        });
    });
})();
