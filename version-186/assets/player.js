(function () {
  window.initMoviePlayer = function (source) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var trigger = document.querySelector('[data-player-trigger]');
    var initialized = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function prepare() {
      if (initialized) {
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      video.setAttribute('controls', 'controls');
    }

    function begin() {
      prepare();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (trigger) {
      trigger.addEventListener('click', begin);
    }

    if (overlay && overlay !== trigger) {
      overlay.addEventListener('click', begin);
    }

    video.addEventListener('click', function () {
      if (!initialized || video.paused) {
        begin();
      } else {
        video.pause();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
