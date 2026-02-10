/* ================= MENU ================= */
function toggleMenu() {
  const drawer = document.getElementById("drawer");
  if (drawer) drawer.classList.toggle("open");
}

/* ================= FOOTER YEAR ================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= PDF VIEWER ================= */
function openPDF(path) {
  const viewer = document.getElementById("pdfViewer");
  const frame = document.getElementById("pdfFrame");
  if (!viewer || !frame) return;

  frame.src = path;
  viewer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePDF() {
  const viewer = document.getElementById("pdfViewer");
  const frame = document.getElementById("pdfFrame");
  if (!viewer || !frame) return;

  frame.src = "";
  viewer.classList.remove("open");
  document.body.style.overflow = "auto";
}

/* ================= LOAD PAPERS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );
  renderHomePapers(papers);
});

/* ================= SEARCH ================= */


/* ================= RENDER ================= */
function renderHomePapers(papers) {
  const grid = document.querySelector(".research-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML = `
      <p style="text-align:center;width:100%;color:#666">
        No matching papers found
      </p>
    `;
    return;
  }

  papers.forEach(p => {
    const card = document.createElement("div");
    card.className = "research-card";

    card.innerHTML = `
      <img src="${p.thumb}" alt="${p.title}">
      <h3>
        ${p.title}
        <span>
          ${p.subtitle || ""}
          ${p.year ? " • " + p.year : ""}
        </span>
      </h3>
    `;

    card.onclick = () => openPDF(p.pdf);
    grid.appendChild(card);
  });
}
/* ================= HOME PAGE PAPER RENDER ================= */

function renderHomePapers(papers) {
  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML = "<p style='text-align:center;'>No papers found.</p>";
    return;
  }

  papers.forEach(paper => {
    const card = document.createElement("div");
    card.className = "research-card";

    card.innerHTML = `
      <img src="${paper.thumb}" alt="${paper.title}">
      <h3>
        ${paper.title}
        <span>${paper.subtitle || ""}</span>
      </h3>
    `;

    card.onclick = () => openPDF(paper.pdf);
    grid.appendChild(card);
  });
}

/* ================= SEARCH FUNCTION ================= */

function searchPapers() {
  const query = document
    .getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  if (!query) {
    renderHomePapers(papers);
    return;
  }

  const filtered = papers.filter(paper =>
    paper.title.toLowerCase().includes(query) ||
    paper.subtitle?.toLowerCase().includes(query) ||
    paper.year?.toLowerCase().includes(query)
  );

  renderHomePapers(filtered);
}

/* ================= LOAD PAPERS ON PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );
  renderHomePapers(papers);
});


