let ALL_PAPERS = [];

/* ================= LOAD DATA ================= */
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
  const q = document.getElementById("searchInput").value.toLowerCase().trim();

  if (!q) {
    renderHomePapers(ALL_PAPERS);
    return;
  }

  const filtered = ALL_PAPERS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.subtitle.toLowerCase().includes(q) ||
    p.year.includes(q)
  );

  renderHomePapers(filtered);
}

/* ================= RENDER ================= */
function renderHomePapers(papers) {
  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML = "<p>No papers found.</p>";
    return;
  }

  papers.forEach(p => {
    const card = document.createElement("div");
    card.className = "research-card";
    card.innerHTML = `
      <img src="${p.thumb}">
      <h3>${p.title}<span>${p.subtitle} • ${p.year}</span></h3>
    `;
    card.onclick = () => window.open(p.pdf, "_blank");
    grid.appendChild(card);
  });
}
