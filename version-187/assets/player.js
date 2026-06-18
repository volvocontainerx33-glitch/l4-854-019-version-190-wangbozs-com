import { H as Hls } from './hls.js';

const players = Array.from(document.querySelectorAll('[data-player]'));

function showState(box, message) {
  const state = box.querySelector('.player-state');
  if (!state) {
    return;
  }
  state.textContent = message;
  state.classList.add('show');
  window.clearTimeout(state.timer);
  state.timer = window.setTimeout(() => state.classList.remove('show'), 2800);
}

function bindPlayer(box) {
  const video = box.querySelector('video');
  const overlay = box.querySelector('.player-overlay');
  if (!video) {
    return;
  }
  const source = video.dataset.video;
  let ready = false;

  function markReady() {
    ready = true;
    showState(box, '视频已就绪');
  }

  function markError() {
    showState(box, '视频加载失败');
  }

  if (source && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, markReady);
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data && data.fatal) {
        markError();
      }
    });
  } else if (source && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.addEventListener('loadedmetadata', markReady, { once: true });
    video.addEventListener('error', markError);
  } else {
    markError();
  }

  async function togglePlay() {
    try {
      if (video.paused) {
        if (!ready) {
          showState(box, '正在加载视频');
        }
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      markError();
    }
  }

  if (overlay) {
    overlay.addEventListener('click', togglePlay);
  }
  video.addEventListener('click', togglePlay);
  video.addEventListener('play', () => box.classList.add('playing'));
  video.addEventListener('pause', () => box.classList.remove('playing'));
  video.addEventListener('ended', () => box.classList.remove('playing'));
}

players.forEach(bindPlayer);
