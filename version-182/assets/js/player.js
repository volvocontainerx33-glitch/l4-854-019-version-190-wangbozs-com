import { H as Hls } from "./hls-vendor-dru42stk.js";

function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

function initPlayer(shell) {
  const video = shell.querySelector("video");
  const cover = shell.querySelector(".player-cover");
  const url = shell.getAttribute("data-video");
  let attached = false;
  let hls = null;

  if (!video || !url) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else {
      video.src = url;
    }

    shell.classList.add("is-ready");
  }

  function play() {
    attach();

    const promise = video.play();

    if (promise && typeof promise.then === "function") {
      promise.then(function () {
        shell.classList.add("is-playing");
        if (cover) {
          cover.classList.add("is-hidden");
        }
      }).catch(function () {
        shell.classList.remove("is-playing");
      });
    } else {
      shell.classList.add("is-playing");
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }
  }

  if (cover) {
    cover.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", function () {
    shell.classList.add("is-playing");
    if (cover) {
      cover.classList.add("is-hidden");
    }
  });

  video.addEventListener("pause", function () {
    shell.classList.remove("is-playing");
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}

ready(function () {
  document.querySelectorAll(".js-player").forEach(initPlayer);
});
