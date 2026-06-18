import { H as Hls } from './video-player-dru42stk.js';

function setStatus(frame, message) {
  const status = frame.querySelector('[data-player-status]');

  if (status) {
    status.textContent = message;
  }
}

function attachHls(video, source, frame) {
  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => setStatus(frame, '高清播放已就绪'));
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data && data.fatal) {
        setStatus(frame, '视频加载失败，请稍后重试');
      }
    });
    return hls;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.addEventListener('loadedmetadata', () => setStatus(frame, '高清播放已就绪'), { once: true });
    video.addEventListener('error', () => setStatus(frame, '视频加载失败，请稍后重试'));
    return null;
  }

  setStatus(frame, '当前浏览器不支持 HLS 播放');
  return null;
}

function setupPlayer(frame) {
  const video = frame.querySelector('.js-player');
  const toggle = frame.querySelector('[data-player-toggle]');
  const source = video?.dataset.src;

  if (!video || !source) {
    setStatus(frame, '缺少播放源');
    return;
  }

  attachHls(video, source, frame);

  async function togglePlayback() {
    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      setStatus(frame, '请再次点击播放');
    }
  }

  toggle?.addEventListener('click', togglePlayback);
  video.addEventListener('click', togglePlayback);
  video.addEventListener('play', () => {
    frame.classList.add('is-playing');
    setStatus(frame, '正在播放');
  });
  video.addEventListener('pause', () => {
    frame.classList.remove('is-playing');
    setStatus(frame, '已暂停');
  });
  video.addEventListener('ended', () => {
    frame.classList.remove('is-playing');
    setStatus(frame, '播放结束');
  });
}

document.querySelectorAll('[data-player-frame]').forEach(setupPlayer);
