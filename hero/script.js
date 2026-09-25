const AUTOPLAY_MS = 7000;

const hero = document.querySelector(".hero");
const slides = document.querySelectorAll(".slide");
const dotsWrap = document.querySelector(".dots");
const prevBtn = document.querySelector(".arrow--prev");
const nextBtn = document.querySelector(".arrow--next");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let current = 0;
let paused = false;
let timer;

// ---------- Carousel ----------
const dots = [...slides].map((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
  return dot;
});

function goTo(index) {
  current = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === current);
    slide.setAttribute("aria-hidden", i !== current);
  });
  dots.forEach((dot, i) => dot.setAttribute("aria-current", i === current));

  schedule();
}

// one timer that restarts after every slide change, so manual clicks never double-advance
function schedule() {
  clearTimeout(timer);
  if (paused || reducedMotion.matches) return;
  timer = setTimeout(() => goTo(current + 1), AUTOPLAY_MS);
}

prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

// pause while the user is hovering or has keyboard focus inside the hero
function setPaused(value) {
  paused = value;
  schedule();
}
hero.addEventListener("mouseenter", () => setPaused(true));
hero.addEventListener("mouseleave", () => setPaused(false));
hero.addEventListener("focusin", () => setPaused(true));
hero.addEventListener("focusout", () => setPaused(false));
reducedMotion.addEventListener("change", schedule);

goTo(0);

// ---------- Mobile menu ----------
const toggle = document.querySelector(".nav__toggle");
const mobileMenu = document.querySelector("#mobile-menu");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
mobileMenu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
