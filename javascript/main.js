/* ================= FOOTER YEAR ================= */
document.addEventListener("DOMContentLoaded", function () {

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});


/* ================= GLOBAL DATA ================= */
let ALL_PAPERS = [];


/* ================= LOAD PAPERS ================= */
document.addEventListener("DOMContentLoaded", function () {

  fetch("data/papers.json")
    .then(res => res.json())
    .then(data => {
      ALL_PAPERS = data;
      renderHomePapers(ALL_PAPERS);
    })
    .catch(err => {
      console.error("Failed to load papers.json", err);
    });

});


/* ================= SEARCH ================= */
function searchPapers() {

  const input = document.getElementById("searchInput");
  if (!input) return;

  const query = input.value.toLowerCase().trim();

  if (!query) {
    renderHomePapers(ALL_PAPERS);
    return;
  }

  const filtered = ALL_PAPERS.filter(p =>
    (p.title && p.title.toLowerCase().includes(query)) ||
    (p.subtitle && p.subtitle.toLowerCase().includes(query)) ||
    (p.year && p.year.toString().includes(query))
  );

  renderHomePapers(filtered);

}


/* ================= RENDER PAPERS ================= */
function renderHomePapers(papers) {

  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!papers || papers.length === 0) {
    grid.innerHTML = `
      <p style="text-align:center;width:100%;color:#666">
        No matching papers found.
      </p>`;
    return;
  }

  papers.forEach(p => {

    const card = document.createElement("div");
    card.className = "research-card";
    card.setAttribute("data-pdf", p.pdf);

    card.innerHTML = `
      <img src="${p.thumb}" alt="${p.title}">
      <h3>
        ${p.title}
        <span>${p.subtitle || ""} ${p.year ? " • " + p.year : ""}</span>
      </h3>
      <div class="view-count"></div>
    `;

    card.onclick = function () {
      openPDF(p.pdf);
    };

    grid.appendChild(card);

  });

  updateViewDisplays();
}


/* ================= PDF OPEN (MOBILE SAFE) ================= */
function openPDF(path) {

  // ===== VIEW COUNTER =====
  const views = JSON.parse(localStorage.getItem("paperViews") || "{}");

  if (!views[path]) {
    views[path] = 1;
  } else {
    views[path]++;
  }

  localStorage.setItem("paperViews", JSON.stringify(views));

  updateViewDisplays();

  // ===== OPEN PDF IN NEW TAB (MOBILE STABLE) =====
  window.open(path, "_blank");

}


/* ================= UPDATE VIEW DISPLAY ================= */
function updateViewDisplays() {

  const views = JSON.parse(localStorage.getItem("paperViews") || "{}");
  const cards = document.querySelectorAll(".research-card");

  cards.forEach(card => {

    const pdfPath = card.getAttribute("data-pdf");
    if (!pdfPath) return;

    const count = views[pdfPath] || 0;

    const viewEl = card.querySelector(".view-count");
    if (viewEl) {
      viewEl.innerText = count + " Views";
    }

  });

}


/* ================= SEARCH BUTTON AUTO BIND ================= */
document.addEventListener("DOMContentLoaded", function () {

  const searchBtn = document.getElementById("searchBtn");
  const input = document.getElementById("searchInput");

  if (searchBtn) {
    searchBtn.addEventListener("click", searchPapers);
  }

  if (input) {
    input.addEventListener("input", searchPapers);
  }

});
