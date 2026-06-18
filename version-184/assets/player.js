import { H as Hls } from './hls-vendor-dru42stk.js';

document.querySelectorAll('[data-player]').forEach(function (player) {
  const video = player.querySelector('video');
  const source = player.dataset.src;
  const loader = player.querySelector('[data-player-loader]');
  const errorBox = player.querySelector('[data-player-error]');
  const playButton = player.querySelector('[data-player-play]');
  const muteButton = player.querySelector('[data-player-mute]');
  const fullscreenButton = player.querySelector('[data-player-fullscreen]');
  const status = player.querySelector('[data-player-status]');
  let hls = null;

  if (!video || !source) {
    return;
  }

  const setReady = function () {
    if (loader) {
      loader.classList.add('ready');
    }
    if (status) {
      status.textContent = '就绪，点击播放';
    }
  };

  const setError = function () {
    if (loader) {
      loader.classList.add('ready');
    }
    if (errorBox) {
      errorBox.hidden = false;
    }
    if (status) {
      status.textContent = '加载失败';
    }
  };

  if (Hls && Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, setReady);
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        setError();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.addEventListener('loadedmetadata', setReady, { once: true });
  } else {
    setError();
  }

  const updateState = function () {
    player.classList.toggle('playing', !video.paused);
    if (playButton) {
      playButton.textContent = video.paused ? '▶' : '❚❚';
    }
    if (status) {
      status.textContent = video.paused ? '已暂停' : '正在播放';
    }
  };

  const togglePlay = function () {
    if (video.paused) {
      const promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (status) {
            status.textContent = '浏览器阻止了自动播放，请再次点击';
          }
        });
      }
    } else {
      video.pause();
    }
  };

  video.addEventListener('click', togglePlay);
  video.addEventListener('play', updateState);
  video.addEventListener('pause', updateState);
  video.addEventListener('canplay', setReady);
  video.addEventListener('error', setError);

  if (playButton) {
    playButton.addEventListener('click', togglePlay);
  }

  if (muteButton) {
    muteButton.addEventListener('click', function () {
      video.muted = !video.muted;
      muteButton.textContent = video.muted ? '🔇' : '🔊';
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
