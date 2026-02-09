/* ================= MOBILE MENU ================= */
function toggleMenu() {
  document.getElementById("drawer").classList.toggle("open");
}

/* ================= FOOTER YEAR ================= */
document.getElementById("year").textContent = new Date().getFullYear();

/* ================= PDF VIEWER ================= */
function openPDF(path) {
  document.getElementById("pdfFrame").src = path;
  document.getElementById("pdfViewer").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePDF() {
  document.getElementById("pdfFrame").src = "";
  document.getElementById("pdfViewer").classList.remove("open");
  document.body.style.overflow = "auto";
}

/* ================= LOAD PAPERS ON HOME ================= */
document.addEventListener("DOMContentLoaded", () => {
  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );
  renderHomePapers(papers);
});

/* ================= SEARCH PAPERS ================= */
function searchPapers() {
  const query = document
    .getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

  const allPapers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  if (!query) {
    renderHomePapers(allPapers);
    return;
  }

  const filtered = allPapers.filter(paper => {
    return (
      paper.title?.toLowerCase().includes(query) ||
      paper.subtitle?.toLowerCase().includes(query) ||
      paper.year?.toLowerCase().includes(query)
    );
  });

  renderHomePapers(filtered);
}

/* ================= RENDER PAPERS ================= */
function renderHomePapers(papers) {
  const grid = document.querySelector(".research-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!papers || papers.length === 0) {
    grid.innerHTML = `
      <p style="
        width:100%;
        text-align:center;
        font-size:16px;
        color:#666;
        margin-top:20px;">
        No matching papers found.
      </p>
    `;
    return;
  }

  papers.forEach(paper => {
    const card = document.createElement("div");
    card.className = "research-card";

    card.innerHTML = `
      <img src="${paper.thumb}" alt="${paper.title}">
      <h3>
        ${paper.title}
        <span>
          ${paper.subtitle || ""}
          ${paper.year ? " • " + paper.year : ""}
        </span>
      </h3>
    `;

    card.addEventListener("click", () => {
      openPDF(paper.pdf);
    });

    grid.appendChild(card);
  });
}
