(function () {
  function setText(button, value) {
    if (button) {
      button.textContent = value;
    }
  }

  window.mountMoviePlayer = function (id, source) {
    const root = document.getElementById(id);

    if (!root) {
      return;
    }

    const video = root.querySelector("video");
    const overlay = root.querySelector(".player-overlay");
    const toggle = root.querySelector(".player-toggle");
    const mute = root.querySelector(".player-mute");
    const fullscreen = root.querySelector(".player-fullscreen");
    let hls = null;

    if (!video || !source) {
      return;
    }

    function attach() {
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function play() {
      const action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    function togglePlay() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    function updateState() {
      root.classList.toggle("is-playing", !video.paused);
      root.classList.toggle("is-paused", video.paused);
      setText(toggle, video.paused ? "播放" : "暂停");
      setText(mute, video.muted ? "取消静音" : "静音");
    }

    attach();
    updateState();

    if (overlay) {
      overlay.addEventListener("click", function () {
        play();
      });
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        togglePlay();
      });
    }

    if (mute) {
      mute.addEventListener("click", function () {
        video.muted = !video.muted;
        updateState();
      });
    }

    if (fullscreen) {
      fullscreen.addEventListener("click", function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (root.requestFullscreen) {
          root.requestFullscreen();
        }
      });
    }

    video.addEventListener("click", togglePlay);
    video.addEventListener("play", updateState);
    video.addEventListener("pause", updateState);
    video.addEventListener("volumechange", updateState);
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
