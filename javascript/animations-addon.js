/* ================= SAFE PREMIUM ANIMATIONS ================= */

document.addEventListener("DOMContentLoaded", () => {

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.5 });

  /* Animate ONLY approved elements */
  document.querySelectorAll(".recent-research h2").forEach(h2 => {
    observer.observe(h2);
  });

  const footer = document.querySelector(".home-footer");
  if (footer) observer.observe(footer);

  document.querySelectorAll(".footer-col").forEach(col => {
    observer.observe(col);
  });

});
/* ================= PAPER SUBMISSION SCROLL REVEAL ================= */

document.addEventListener("DOMContentLoaded", () => {

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.3 }
  );

  document
    .querySelectorAll(".submission-box, .certificate-box")
    .forEach(el => observer.observe(el));

});
/* ================= ABOUT PAGE ANIMATIONS ================= */

document.querySelectorAll(".about-card").forEach(card => {
  observer.observe(card);

});
/* ======================================================
   MOBILE SCROLL + TAP ANIMATIONS (PROFESSIONAL)
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll(
".research-card, .about-card, .submission-box"

  );

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("mobile-visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- TAP FEEDBACK ---------- */
  document.addEventListener("touchstart", e => {
    const card = e.target.closest(
      ".research-card, .about-card, .submission-box"
    );
    if (card) {
      card.classList.add("mobile-tap");
    }
  });

  document.addEventListener("touchend", e => {
    const card = e.target.closest(
      ".research-card, .about-card, .submission-box"
    );
    if (card) {
      setTimeout(() => {
        card.classList.remove("mobile-tap");
      }, 180);
    }
  });
});
