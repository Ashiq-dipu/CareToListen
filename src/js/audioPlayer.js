// Care To Listen — Audio Player Engine (CoSpace Floating Pill Dock)
import initialEpisodes from "../data/episodes.json";

class PodcastAudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.currentTrack = null;
    this.fallbackSample = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3"; // Calming ambient studio track
    this.episodesList = initialEpisodes || [];
    this.init();
  }

  init() {
    // Select default episode (Ep 108 or first in list)
    if (this.episodesList.length > 0) {
      const ep108 = this.episodesList.find(e => e.number === "108") || this.episodesList[0];
      this.currentTrack = {
        id: ep108.id,
        number: ep108.number,
        title: ep108.title,
        guest: ep108.guest ? ep108.guest.name : "Care To Listen",
        category: ep108.category || "Mental Health",
        audioUrl: ep108.audioUrl || this.fallbackSample,
        duration: ep108.duration || "44 min",
        avatar: ep108.guest ? ep108.guest.avatar : "/assets/card_01_arch.jpg"
      };
    }

    this.domEventsBound = false;
    this.controlsAttached = false;
    this.bindAudioEvents();
    this.bindDomEvents();
    this.renderTrackInfo();
  }

  bindAudioEvents() {
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.updateUIState();
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateUIState();
    });
    this.audio.addEventListener("timeupdate", () => this.onTimeUpdate());
    this.audio.addEventListener("ended", () => this.onEnded());
    this.audio.addEventListener("error", () => {
      // If custom audio fails, softly fall back to calming ambient sample
      if (this.audio.src !== this.fallbackSample) {
        this.audio.src = this.fallbackSample;
        if (this.isPlaying) {
          this.audio.play().catch(() => {});
        }
      }
    });
  }

  bindDomEvents() {
    if (this.domEventsBound) return;
    this.domEventsBound = true;

    const setup = () => {
      this.attachDomControls();
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setup, { once: true });
    } else {
      setup();
    }
  }

  attachDomControls() {
    if (this.controlsAttached) return;
    this.controlsAttached = true;

    const playBtn = document.getElementById("player-play-btn");
    const progressTrack = document.getElementById("player-progress-bar");
    const volumeSlider = document.getElementById("player-volume-slider");
    const closeBtn = document.getElementById("player-toggle-btn");

    if (playBtn) {
      playBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
      });
    }

    if (progressTrack) {
      progressTrack.addEventListener("click", (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const clickRatio = (e.clientX - rect.left) / rect.width;
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          this.audio.currentTime = clickRatio * this.audio.duration;
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.audio.volume = isNaN(val) ? 0.8 : Math.max(0, Math.min(1, val));
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.isPlaying) {
          this.pause();
        }
        const pill = document.getElementById("floating-audio-dock");
        if (pill) {
          pill.classList.toggle("minimized");
        }
      });
    }

    // Global listener for buttons with data-play-ep
    document.addEventListener("click", (e) => {
      const targetBtn = e.target.closest("[data-play-ep]");
      if (!targetBtn) return;
      e.preventDefault();
      const epId = targetBtn.getAttribute("data-play-ep");
      const ep = this.episodesList.find(item => item.id === epId || item.number === epId);
      if (ep) {
        this.loadAndPlay(ep);
      }
    });

    this.renderTrackInfo();
  }

  loadAndPlay(ep) {
    const isSameTrack = this.currentTrack && (this.currentTrack.id === ep.id || this.currentTrack.number === ep.number);
    if (isSameTrack) {
      this.togglePlay();
      return;
    }

    this.currentTrack = {
      id: ep.id,
      number: ep.number,
      title: ep.title,
      guest: ep.guest ? ep.guest.name : "Care To Listen",
      category: ep.category || "Mental Health",
      audioUrl: ep.audioUrl || this.fallbackSample,
      duration: ep.duration || "45 min",
      avatar: (ep.guest && ep.guest.avatar) || "/assets/card_01_arch.jpg"
    };

    this.audio.src = this.currentTrack.audioUrl;
    this.renderTrackInfo();
    this.play();
  }

  play() {
    if (!this.audio.src || this.audio.src === window.location.href) {
      this.audio.src = (this.currentTrack && this.currentTrack.audioUrl) || this.fallbackSample;
    }
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUIState();
    }).catch(err => {
      console.warn("Autoplay audio error, trying fallback:", err);
      this.audio.src = this.fallbackSample;
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateUIState();
      }).catch(e => console.log("User interaction required for audio playback."));
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUIState();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.updateUIState();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  onEnded() {
    this.isPlaying = false;
    this.updateUIState();
  }

  onTimeUpdate() {
    const fill = document.getElementById("player-progress-fill");
    const currentEl = document.getElementById("player-time-current");
    const totalEl = document.getElementById("player-time-total");

    if (!this.audio.duration || isNaN(this.audio.duration)) {
      if (fill) fill.style.width = "0%";
      return;
    }

    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    if (fill) fill.style.width = `${percent}%`;

    if (currentEl) currentEl.textContent = this.formatTime(this.audio.currentTime);
    if (totalEl) totalEl.textContent = this.formatTime(this.audio.duration);
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  renderTrackInfo() {
    if (!this.currentTrack) return;
    const titleEl = document.getElementById("player-track-title");
    const guestEl = document.getElementById("player-track-guest");
    const epNumEl = document.getElementById("player-track-ep");
    const thumbEl = document.getElementById("player-track-thumb");

    if (titleEl) titleEl.textContent = this.currentTrack.title;
    if (guestEl) guestEl.textContent = this.currentTrack.guest ? `with ${this.currentTrack.guest}` : "Care To Listen";
    if (epNumEl) epNumEl.textContent = `EP #${this.currentTrack.number}`;
    if (thumbEl && this.currentTrack.avatar) {
      thumbEl.src = this.currentTrack.avatar;
    }

    this.updateUIState();
  }

  updateUIState() {
    const playBtn = document.getElementById("player-play-btn");
    const eqBars = document.getElementById("player-eq-bars");
    const dock = document.getElementById("floating-audio-dock");

    if (playBtn) {
      if (this.isPlaying) {
        playBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
          </svg>
        `;
        playBtn.setAttribute("aria-label", "Pause episode");
      } else {
        playBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4.5v15a1 1 0 0 0 1.55.83l11-7.5a1 1 0 0 0 0-1.66l-11-7.5A1 1 0 0 0 7 4.5z"/>
          </svg>
        `;
        playBtn.setAttribute("aria-label", "Play episode");
      }
    }

    if (eqBars) {
      if (this.isPlaying) {
        eqBars.classList.add("animate");
      } else {
        eqBars.classList.remove("animate");
      }
    }

    if (dock) {
      dock.classList.remove("hidden");
    }

    // Sync all episode play buttons on page
    document.querySelectorAll("[data-play-ep]").forEach(btn => {
      const epId = btn.getAttribute("data-play-ep");
      const isCurrent = this.currentTrack && (this.currentTrack.id === epId || this.currentTrack.number === epId);
      
      if (isCurrent && this.isPlaying) {
        btn.classList.add("is-playing");
        const icon = btn.querySelector(".play-icon-state");
        if (icon) {
          icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`;
        }
      } else {
        btn.classList.remove("is-playing");
        const icon = btn.querySelector(".play-icon-state");
        if (icon) {
          icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.55.83l11-7.5a1 1 0 0 0 0-1.66l-11-7.5A1 1 0 0 0 7 4.5z"/></svg>`;
        }
      }
    });
  }
}

// Global Singleton
export const player = new PodcastAudioPlayer();
if (typeof window !== "undefined") {
  window.care2ListenPlayer = player;
}
