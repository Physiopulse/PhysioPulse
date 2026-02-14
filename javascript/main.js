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

  // ===== VIEW COUNTER =====
  const views = JSON.parse(localStorage.getItem("paperViews") || "{}");

  if (!views[path]) {
    views[path] = 1;
  } else {
    views[path]++;
  }

  localStorage.setItem("paperViews", JSON.stringify(views));

  updateViewDisplays();

  // ===== OPEN PDF =====
  document.getElementById("pdfFrame").src = path;
  document.getElementById("pdfViewer").classList.add("open");
}


function closePDF() {
  const viewer = document.getElementById("pdfViewer");
  const frame = document.getElementById("pdfFrame");

  frame.src = "";
  viewer.classList.remove("open");
  document.body.style.overflow = "auto";
}
function updateViewDisplays() {

  const views = JSON.parse(localStorage.getItem("paperViews") || "{}");
  const cards = document.querySelectorAll(".research-card");

  cards.forEach(card => {

    const pdfPath = card.getAttribute("data-pdf");
    if (!pdfPath) return;

    const count = views[pdfPath] || 0;

    let viewEl = card.querySelector(".view-count");

    if (!viewEl) {
      viewEl = document.createElement("div");
      viewEl.className = "view-count";
      viewEl.style.marginTop = "6px";
      viewEl.style.fontSize = "13px";
      viewEl.style.color = "#777";
      card.appendChild(viewEl);
    }

  viewEl.innerText = count + " Views";


  });
}

