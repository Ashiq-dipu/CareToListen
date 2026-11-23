// Care To Listen — Main Interactive Logic
import "../style.css";
import { player } from "./audioPlayer.js";
import { episodes } from "../data/episodes.js";
import { hosts } from "../data/hosts.js";
import { crisisResources } from "../data/resources.js";

// Banner interactive data for "Why Listeners Stay"
const BANNER_MODES = [
  {
    id: "01",
    tag: "01 / SOMATIC GROUNDING",
    title: "Before we analyze the grief, we regulate the nervous system.",
    desc: "Every episode begins with a 90-second physiological sigh and sensory check-in. We do not jump into traumatic narratives with an elevated heart rate.",
    quote: "“The breath is the first permission slip we give our body to tell the truth.” — Marcus Vance",
    img: "/assets/hero_scroll_editorial.jpg"
  },
  {
    id: "02",
    tag: "02 / ZERO ADVICE-GIVING",
    title: "Witnessing is vastly more healing than quick fixes.",
    desc: "Modern culture is obsessed with 5-step morning routines and productivity hacks for sadness. Here, no one tells you to get over it.",
    quote: "“Advice is often just the listener's anxiety disguised as generosity.” — Maya Lin",
    img: "/assets/hero_editorial_model.jpg"
  },
  {
    id: "03",
    tag: "03 / CLINICAL + HUMAN",
    title: "Trauma-informed research translated into compassionate prose.",
    desc: "We bridge polyvagal science, internal family systems, and attachment theory with deeply personal lived experiences.",
    quote: "“Neurobiology gives us the map; unconditional empathy gives us the courage to walk it.” — Dr. Kenji Sato",
    img: "/assets/fig_02_model.jpg"
  },
  {
    id: "04",
    tag: "04 / 24/7 CRISIS SAFETY",
    title: "No conversation ends with a listener left alone in the dark.",
    desc: "Every episode comes with immediate regional lifeline links, clinical worksheets, and vetted crisis text lines in the show notes.",
    quote: "“Help is not a weakness. It is the smartest evolutionary move human beings make.” — Marcus Vance",
    img: "/assets/hero_meaningful_listening.jpg"
  }
];

// SOMATIC COMPASS & BRAIN STATE ENGINE
const BRAIN_STATES = {
  hyper: {
    badge: "SYMPATHETIC OVERLOAD • FIGHT / FLIGHT",
    title: "Your amygdala is firing false alarm sirens.",
    desc: "When you're hyperaroused, your prefrontal cortex loses bandwidth. Words of logic feel infuriating. Your heart rate variability is compressed, and your neck and diaphragm are braced for impact. We do not try to analyze why you are panicked; we first signal physiological safety to your vagus nerve.",
    need: "Low acoustic frequencies, lengthened expiratory breath (exhale twice as long as inhale), and zero cognitive demands.",
    rxTitle: "Episode #108: The 90-Second Physiological Sigh",
    rxDuration: "44 Min • Acoustic Somatics",
    epId: "108"
  },
  dorsal: {
    badge: "DORSAL VAGAL FREEZE • HYPOAROUSAL",
    title: "Your brain has pulled the circuit breaker.",
    desc: "You feel numb, hollowed out, or disconnected from your own limbs. The world feels muted behind double-paned glass. This is not laziness or apathy — it is your evolutionary conservation reflex saving you from sensory flooding. Forcing yourself to 'be productive' right now only deepens the freeze.",
    need: "Gentle micro-stimulations, warm co-regulating vocal tones, bilateral auditory stimulation, and zero guilt for resting.",
    rxTitle: "Episode #102: When the Body Says Stop (Dorsal Vagal Reset)",
    rxDuration: "41 Min • Polyvagal Protocol",
    epId: "102"
  },
  attachment: {
    badge: "RELATIONAL PANIC • AMYGDALA ALARM",
    title: "Your brain interprets relational rupture as physical peril.",
    desc: "When a text goes unanswered or a partner pulls away, the brain's dorsal anterior cingulate cortex lights up with the exact same pain signatures as a second-degree burn. Your mind loops obsessively, catastrophizing. You are experiencing acute relational withdrawal.",
    need: "Validating relational attunement, compassionate boundary pacing, and anchoring into your own adult sovereignty.",
    rxTitle: "Episode #105: The Abandonment Loop & Adult Repair",
    rxDuration: "47 Min • Relational Somatics",
    epId: "105"
  },
  compassion: {
    badge: "SECONDARY TRAUMATIC STRESS • EMPATHY COLLAPSE",
    title: "Your emotional sponge is waterlogged.",
    desc: "You have listened to everyone else's heartbreak until your mirror neurons are utterly exhausted. Now you feel irritable, resentful of loved ones, or cynical about helping anyone. This is the classic caregiver crash. You cannot pour from a cup that has shattered.",
    need: "Firm energetic boundaries, reclaiming private sacred space, and being held without having to perform or caretake.",
    rxTitle: "Episode #104: Caregiver Burnout & The Right to Disengage",
    rxDuration: "38 Min • Sacred Rest",
    epId: "104"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initBannerInteractive();
  initMarquee();
  initBrainCompass();
  initBreathPacer();
  initSoundbiteChapters();
  initEpisodesFilter();
  initContactForms();
  initNewsletter();
});

// Mobile Navigation
function initNav() {
  const toggleBtn = document.getElementById("mobile-menu-btn");
  const navDrawer = document.getElementById("mobile-nav-drawer");
  const closeBtn = document.getElementById("mobile-close-btn");

  if (toggleBtn && navDrawer) {
    toggleBtn.addEventListener("click", () => {
      navDrawer.classList.toggle("is-open");
      document.body.classList.toggle("menu-open");
    });
  }

  if (closeBtn && navDrawer) {
    closeBtn.addEventListener("click", () => {
      navDrawer.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  }

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (navDrawer && navDrawer.classList.contains("is-open")) {
      if (!navDrawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        navDrawer.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      }
    }
  });
}

// "Why Listeners Stay" interactive pills
function initBannerInteractive() {
  const pillBtns = document.querySelectorAll(".feature-pill-btn");
  const tagEl = document.getElementById("feature-display-tag");
  const titleEl = document.getElementById("feature-display-title");
  const descEl = document.getElementById("feature-display-desc");
  const quoteEl = document.getElementById("feature-display-quote");
  const imgEl = document.getElementById("feature-display-img");

  if (!pillBtns.length || !titleEl) return;

  pillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modeId = btn.getAttribute("data-mode");
      const data = BANNER_MODES.find(m => m.id === modeId);
      if (!data) return;

      // Update active state
      pillBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Smooth text transitions
      titleEl.style.opacity = "0";
      if (descEl) descEl.style.opacity = "0";
      if (quoteEl) quoteEl.style.opacity = "0";

      setTimeout(() => {
        if (tagEl) tagEl.textContent = data.tag;
        titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (quoteEl) quoteEl.textContent = data.quote;
        if (imgEl && data.img) imgEl.src = data.img;

        titleEl.style.opacity = "1";
        if (descEl) descEl.style.opacity = "1";
        if (quoteEl) quoteEl.style.opacity = "1";
      }, 150);
    });
  });
}

// Marquee hover pause
function initMarquee() {
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => {
      marquee.style.animationPlayState = "paused";
    });
    marquee.addEventListener("mouseleave", () => {
      marquee.style.animationPlayState = "running";
    });
  }
}

// Category filter for episodes page
function initEpisodesFilter() {
  const filterBtns = document.querySelectorAll(".category-pill-btn");
  const epCards = document.querySelectorAll(".episode-card-item");
  const searchInput = document.getElementById("episode-search-input");

  if (!filterBtns.length || !epCards.length) return;

  function runFilter() {
    const activeBtn = document.querySelector(".category-pill-btn.active");
    const activeCat = activeBtn ? activeBtn.getAttribute("data-category") : "All";
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();

    let visibleCount = 0;

    epCards.forEach(card => {
      const cardCat = card.getAttribute("data-category") || "";
      const cardTitle = (card.querySelector(".ep-card-title")?.textContent || "").toLowerCase();
      const cardDesc = (card.querySelector(".ep-card-desc")?.textContent || "").toLowerCase();
      const cardGuest = (card.querySelector(".ep-card-guest")?.textContent || "").toLowerCase();

      const matchesCat = activeCat === "All" || cardCat.toLowerCase() === activeCat.toLowerCase();
      const matchesQuery = !query || cardTitle.includes(query) || cardDesc.includes(query) || cardGuest.includes(query);

      if (matchesCat && matchesQuery) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    const countEl = document.getElementById("episodes-count-indicator");
    if (countEl) {
      countEl.textContent = `Showing ${visibleCount} Episode${visibleCount === 1 ? "" : "s"}`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      runFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", runFilter);
  }
}

// Feedback Modal / Toasts for Proposal & Contact Forms
function initContactForms() {
  const forms = document.querySelectorAll("form[data-cospace-form]");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.innerHTML : "Submit";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending safely...</span>`;
      }

      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Received with Care ✓</span>`;
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
          }, 3500);
        }
        showToast("Your submission was received. Maya & Marcus personally review notes weekly.");
      }, 800);
    });
  });
}

function initNewsletter() {
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector("input[type='email']");
      if (input && input.value) {
        input.value = "";
        showToast("Thank you for joining our weekly sanctuary letter.");
      }
    });
  }
}

function showToast(msg) {
  let toast = document.getElementById("cospace-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cospace-toast";
    toast.className = "cospace-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function initBrainCompass() {
  const tabs = document.querySelectorAll(".brain-state-tab");
  const badgeEl = document.getElementById("brain-badge");
  const titleEl = document.getElementById("brain-title");
  const descEl = document.getElementById("brain-desc");
  const needEl = document.getElementById("brain-need");
  const rxTitleEl = document.getElementById("brain-rx-title");
  const rxDurationEl = document.getElementById("brain-rx-duration");
  const rxPlayBtn = document.getElementById("brain-rx-play");

  if (!tabs.length || !badgeEl) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const stateKey = tab.getAttribute("data-state");
      const stateData = BRAIN_STATES[stateKey];
      if (!stateData) return;

      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const card = document.getElementById("brain-detail-card");
      if (card) {
        card.style.opacity = "0.7";
        setTimeout(() => {
          badgeEl.textContent = stateData.badge;
          titleEl.textContent = stateData.title;
          descEl.textContent = stateData.desc;
          needEl.textContent = stateData.need;
          rxTitleEl.textContent = stateData.rxTitle;
          rxDurationEl.textContent = stateData.rxDuration;
          if (rxPlayBtn) {
            rxPlayBtn.setAttribute("data-play-ep", stateData.epId);
          }
          card.style.opacity = "1";
        }, 150);
      }
    });
  });
}

function initBreathPacer() {
  const phaseEl = document.getElementById("breath-phase");
  const countEl = document.getElementById("breath-count");
  if (!phaseEl || !countEl) return;

  // 10-second physiological sigh cycle:
  // 0s-4s: Inhale (deep)
  // 4s-5.5s: Inhale Sip (top off)
  // 5.5s-10s: Exhale (long slow sigh)
  const cycleTime = 10000;
  const startTime = Date.now();

  function update() {
    const elapsed = (Date.now() - startTime) % cycleTime;
    if (elapsed < 4000) {
      phaseEl.textContent = "INHALE";
      const remaining = Math.ceil((4000 - elapsed) / 1000);
      countEl.textContent = `${remaining}s`;
    } else if (elapsed < 5500) {
      phaseEl.textContent = "MICRO SIP";
      countEl.textContent = "+1s";
    } else {
      phaseEl.textContent = "SLOW SIGH";
      const remaining = Math.ceil((10000 - elapsed) / 1000);
      countEl.textContent = `${remaining}s`;
    }
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initSoundbiteChapters() {
  const rows = document.querySelectorAll(".soundbite-row");
  rows.forEach(row => {
    row.addEventListener("click", () => {
      const seekSec = parseInt(row.getAttribute("data-seek"), 10) || 0;
      const title = row.getAttribute("data-title") || "Soundbite";
      
      const ep108 = player.episodesList.find(e => e.number === "108" || e.id === "108");
      if (ep108) {
        player.loadAndPlay(ep108);
        setTimeout(() => {
          if (player.audio) {
            try {
              player.audio.currentTime = seekSec;
            } catch(e) {}
          }
        }, 300);
        showToast(`Jumping to chapter: ${title}`);
      }
    });
  });
}

