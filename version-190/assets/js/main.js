(function () {
    function toggleMobileMenu() {
        var button = document.querySelector('[data-mobile-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var dotsWrap = hero.querySelector('[data-hero-dots]');
        var index = 0;
        var timer = null;

        function render() {
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            if (dotsWrap) {
                Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, i) {
                    dot.classList.toggle('active', i === index);
                });
            }
        }

        function go(step) {
            index = (index + step + slides.length) % slides.length;
            render();
        }

        function start() {
            stop();
            timer = setInterval(function () {
                go(1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        if (dotsWrap) {
            slides.forEach(function (_, i) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', '切换到第 ' + (i + 1) + ' 屏');
                dot.addEventListener('click', function () {
                    index = i;
                    render();
                    start();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                go(-1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                go(1);
                start();
            });
        }
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        render();
        start();
    }

    function filterCards(query) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var noResult = document.querySelector('[data-no-result]');
        if (!cards.length) {
            return false;
        }
        var keyword = (query || '').trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) {
            var text = card.getAttribute('data-search') || card.textContent;
            var matched = !keyword || text.toLowerCase().indexOf(keyword) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                shown += 1;
            }
        });
        if (noResult) {
            noResult.classList.toggle('show', shown === 0);
        }
        return true;
    }

    function setupLocalSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-local-search]'));
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                filterCards(input.value);
            });
        });
        var params = new URLSearchParams(window.location.search);
        var keyword = params.get('q');
        if (keyword) {
            inputs.forEach(function (input) {
                input.value = keyword;
            });
            filterCards(keyword);
        }
    }

    function setupSearchForms() {
        var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var keyword = input ? input.value.trim() : '';
                if (!keyword) {
                    return;
                }
                if (!filterCards(keyword)) {
                    var base = form.getAttribute('data-search-base') || './';
                    window.location.href = base + 'categories.html?q=' + encodeURIComponent(keyword);
                }
            });
        });
    }

    window.initMoviePlayer = function (videoId, source) {
        var video = document.getElementById(videoId);
        if (!video || !source) {
            return;
        }
        var button = document.querySelector('[data-player-button="' + videoId + '"]');
        var started = false;

        function bindSource() {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            bindSource();
            if (button) {
                button.classList.add('hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('hidden');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        toggleMobileMenu();
        setupHero();
        setupLocalSearch();
        setupSearchForms();
    });
})();
