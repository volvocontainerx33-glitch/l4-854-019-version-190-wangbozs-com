import { H as Hls } from './video-player-dru42stk.js';

export function setupMoviePlayer(config) {
  var video = document.getElementById('movie-video');
  var overlay = document.getElementById('play-overlay');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-play-trigger]'));
  var hls = null;
  var prepared = false;

  if (!video || !config || !config.url) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = config.url;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(config.url);
      hls.attachMedia(video);
    } else {
      video.src = config.url;
    }
    prepared = true;
  }

  async function play() {
    prepare();
    video.setAttribute('controls', 'controls');
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    try {
      await video.play();
    } catch (error) {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', play);
  });
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });
  video.addEventListener('ended', function () {
    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  });
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
