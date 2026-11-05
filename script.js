"use strict";

// ==========================================
// CUSTOMIZE YOUR PAGE HERE
// ==========================================

// Her name. You can also share a link like: yoursite.com/?name=Priya
const defaultName = "love";

const reasons = [
  {
    emoji: "😔",
    title: "My words",
    text: "I said things I didn't mean, and I'm sorry they hurt you."
  },
  {
    emoji: "⏰",
    title: "My time",
    text: "I wasn't there when you needed me. You deserve better than that."
  },
  {
    emoji: "🙉",
    title: "Not listening",
    text: "I heard you, but I didn't really listen. I'll do better."
  }
];

const promises = [
  "I will listen before I react.",
  "I will make time for you, always.",
  "I will say sorry sooner, not later.",
  "I will keep choosing you, every day."
];

const noButtonTexts = [
  "Not yet 😤",
  "Are you sure? 🥺",
  "Please? 🥹",
  "Pretty please? 💗",
  "Okay... I'll wait 😢"
];

const faces = ["(｡•́︿•̀｡)", "(╥﹏╥)", "(ノ_<。)", "(づ｡◕‿‿◕｡)づ"];

const finalNote =
  "Thank you for giving me another chance.\n\n" +
  "I know sorry is only a word, so I'll show it in the way " +
  "I treat you from today on. You matter to me more than being right.\n\n" +
  "Forever yours ❤️";

// Put your music file in the SAME folder as index.html.
// Use a simple lowercase name with no spaces. Set to "" for no music.
const musicURL = "music.mp3";

// ==========================================
// ELEMENTS
// ==========================================

const $ = (id) => document.getElementById(id);

const herNameEl = $("herName");
const startBtn = $("startBtn");
const reasonList = $("reasonList");
const reasonText = $("reasonText");
const toPromisesBtn = $("toPromisesBtn");
const promiseList = $("promiseList");
const toForgiveBtn = $("toForgiveBtn");
const forgiveActions = $("forgiveActions");
const forgiveFace = $("forgiveFace");
const forgiveTitle = $("forgiveTitle");
const forgiveMessage = $("forgiveMessage");
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const letterText = $("letterText");
const petalsContainer = document.querySelector(".petals");
const musicEl = $("bgMusic");
const musicBtn = $("musicBtn");

// ==========================================
// STATE
// ==========================================

let noAttempts = 0;
let musicOn = false;
let typingTimer = null;

// ==========================================
// SCREENS
// ==========================================

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
}

// ==========================================
// MUSIC (with a mute/unmute button)
// ==========================================

function updateMusicBtn() {
  musicBtn.textContent = musicOn ? "🔊" : "🔇";
}

function startMusic() {
  if (!musicEl || !musicURL) return;

  if (!musicEl.getAttribute("src")) {
    musicEl.src = musicURL;
  }

  musicEl.volume = 0.35;

  const p = musicEl.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      musicOn = true;
      updateMusicBtn();
    }).catch((err) => {
      console.log("Music blocked until user taps:", err);
    });
  }
}

function toggleMusic() {
  if (musicOn) {
    musicEl.pause();
    musicOn = false;
    updateMusicBtn();
  } else {
    startMusic();
  }
}

function setupMusic() {
  if (!musicURL || !musicEl) return;

  musicBtn.hidden = false;
  updateMusicBtn();

  musicEl.addEventListener("error", () => {
    console.error("Audio failed to load:", musicEl.currentSrc, musicEl.error);
    musicBtn.hidden = true;
  });

  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

// ==========================================
// PETALS + CONFETTI
// ==========================================

function createPetal() {
  if (!petalsContainer) return;

  const petal = document.createElement("span");
  petal.textContent = ["🌸", "💗", "🌷"][Math.floor(Math.random() * 3)];
  petal.style.left = Math.random() * 100 + "%";
  petal.style.fontSize = 14 + Math.random() * 14 + "px";
  petal.style.animationDuration = 7 + Math.random() * 6 + "s";

  petalsContainer.appendChild(petal);
  setTimeout(() => petal.remove(), 13000);
}

function showConfetti(count = 60) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = -20 - Math.random() * 80 + "px";
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 70%)`;
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3800);
  }
}

// ==========================================
// REASONS
// ==========================================

function renderReasons() {
  reasonList.innerHTML = "";
  reasonText.textContent = "";
  toPromisesBtn.disabled = true;

  let opened = 0;

  reasons.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "reason-btn";

    const emoji = document.createElement("span");
    emoji.className = "emoji";
    emoji.textContent = item.emoji;

    const label = document.createElement("span");
    label.textContent = item.title;

    btn.append(emoji, label);

    btn.addEventListener("click", () => {
      reasonText.textContent = item.text;

      if (!btn.classList.contains("opened")) {
        btn.classList.add("opened");
        opened++;
      }

      if (opened === reasons.length) {
        toPromisesBtn.disabled = false;
      }
    });

    reasonList.appendChild(btn);
  });
}

// ==========================================
// PROMISES
// ==========================================

function renderPromises() {
  promiseList.innerHTML = "";
  toForgiveBtn.disabled = true;

  let checked = 0;

  promises.forEach((text) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "promise-item";

    const box = document.createElement("span");
    box.className = "box";
    box.textContent = "✓";

    const label = document.createElement("span");
    label.textContent = text;

    btn.append(box, label);

    btn.addEventListener("click", () => {
      if (btn.classList.contains("checked")) return;

      btn.classList.add("checked");
      checked++;
      showConfetti(8);

      if (checked === promises.length) {
        toForgiveBtn.disabled = false;
      }
    });

    li.appendChild(btn);
    promiseList.appendChild(li);
  });
}

// ==========================================
// FORGIVE SCREEN (the "No" button runs away)
// ==========================================

function dodgeNoButton() {
  noAttempts++;

  const idx = Math.min(noAttempts, noButtonTexts.length - 1);
  noBtn.textContent = noButtonTexts[idx];
  forgiveFace.textContent = faces[Math.min(noAttempts - 1, faces.length - 1)];
  forgiveMessage.textContent = "I'm really sorry 💗";

  // Grow the Yes button, shrink the No button.
  const yesScale = Math.min(1 + noAttempts * 0.12, 1.7);
  const noScale = Math.max(1 - noAttempts * 0.12, 0.5);
  yesBtn.style.transform = `scale(${yesScale})`;

  const area = forgiveActions.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const maxLeft = Math.max(0, area.width - btn.width);
  const maxTop = Math.max(0, area.height - btn.height);

  noBtn.style.position = "absolute";
  noBtn.style.left = Math.random() * maxLeft + "px";
  noBtn.style.top = Math.random() * maxTop + "px";
  noBtn.style.transform = `scale(${noScale})`;
}

function handleForgive() {
  yesBtn.disabled = true;
  noBtn.disabled = true;
  forgiveTitle.textContent = "Thank you 🥹💗";
  forgiveFace.textContent = "(づ｡◕‿‿◕｡)づ";
  forgiveMessage.textContent = "";

  showConfetti(90);
  startMusic();

  setTimeout(() => {
    showScreen("final");
    typeLetter(finalNote);
    showConfetti(40);
  }, 1500);
}

// ==========================================
// FINAL LETTER (typewriter)
// ==========================================

function typeLetter(text) {
  clearInterval(typingTimer);
  letterText.textContent = "";

  let i = 0;
  typingTimer = setInterval(() => {
    letterText.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(typingTimer);
  }, 45);
}

// ==========================================
// INIT
// ==========================================

function init() {
  const params = new URLSearchParams(window.location.search);
  const name = (params.get("name") || defaultName).trim().slice(0, 30);
  herNameEl.textContent = name || defaultName;

  renderReasons();
  renderPromises();
  setupMusic();

  startBtn.addEventListener("click", () => {
    startMusic();
    showScreen("reasons");
  });

  toPromisesBtn.addEventListener("click", () => showScreen("promises"));
  toForgiveBtn.addEventListener("click", () => showScreen("forgive"));

  yesBtn.addEventListener("click", handleForgive);

  // Dodge on hover (desktop), touch (phones) and click (fallback).
  noBtn.addEventListener("mouseenter", dodgeNoButton);
  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      dodgeNoButton();
    },
    { passive: false }
  );
  noBtn.addEventListener("click", dodgeNoButton);

  // Retry music on the first real interaction if autoplay was blocked.
  ["pointerdown", "touchstart", "click", "keydown"].forEach((evt) => {
    document.addEventListener(
      evt,
      () => {
        if (!musicOn && !musicBtn.hidden && !musicEl.dataset.userMuted) {
          startMusic();
        }
      },
      { passive: true, once: true }
    );
  });

  createPetal();
  setInterval(createPetal, 800);

  showScreen("intro");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
