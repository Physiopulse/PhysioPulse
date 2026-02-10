/* ================= FOOTER YEAR ================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= GLOBAL DATA ================= */
let ALL_PAPERS = [];

/* ================= LOAD PAPERS ================= */
fetch("data/papers.json")
  .then(res => res.json())
  .then(data => {
    ALL_PAPERS = data;
    renderHomePapers(ALL_PAPERS);
  })
  .catch(err => {
    console.error("Failed to load papers.json", err);
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
    p.title.toLowerCase().includes(query) ||
    p.subtitle.toLowerCase().includes(query) ||
    p.year.includes(query)
  );

  renderHomePapers(filtered);
}

/* ================= RENDER PAPERS ================= */
function renderHomePapers(papers) {
  const grid = document.querySelector(".research-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML = `
      <p style="text-align:center;width:100%;color:#666">
        No matching papers found.
      </p>`;
    return;
  }

  papers.forEach(p => {
    const card = document.createElement("div");
    card.className = "research-card";

    card.innerHTML = `
      <img src="${p.thumb}" alt="${p.title}">
      <h3>
        ${p.title}
        <span>${p.subtitle} • ${p.year}</span>
      </h3>
    `;

    card.onclick = () => openPDF(p.pdf);
    grid.appendChild(card);
  });
}

/* ================= PDF VIEWER ================= */
function openPDF(path) {
  const viewer = document.getElementById("pdfViewer");
  const frame = document.getElementById("pdfFrame");

  frame.src = path;
  viewer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePDF() {
  const viewer = document.getElementById("pdfViewer");
  const frame = document.getElementById("pdfFrame");

  frame.src = "";
  viewer.classList.remove("open");
  document.body.style.overflow = "auto";
}
