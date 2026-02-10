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

/* ================= LOAD & RENDER ================= */
document.addEventListener("DOMContentLoaded", () => {
  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );
  renderHomePapers(papers);
});

function renderHomePapers(papers) {
  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML =
      "<p style='text-align:center;color:#666'>No papers found</p>";
    return;
  }

  papers.forEach(p => {
    const card = document.createElement("div");
    card.className = "research-card";

    card.innerHTML = `
      <img src="${p.thumb}">
      <h3>
        ${p.title}
        <span>${p.subtitle || ""} ${p.year ? "• " + p.year : ""}</span>
      </h3>
    `;

    card.onclick = () => openPDF(p.pdf);
    grid.appendChild(card);
  });
}

/* ================= SEARCH ================= */
function searchPapers() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const query = input.value.toLowerCase().trim();

  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  if (!query) {
    renderHomePapers(papers);
    return;
  }

  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(query) ||
    (p.subtitle && p.subtitle.toLowerCase().includes(query)) ||
    (p.year && p.year.toLowerCase().includes(query))
  );

  renderHomePapers(filtered);
}
