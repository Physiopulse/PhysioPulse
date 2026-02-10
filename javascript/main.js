let ALL_PAPERS = [];

/* ================= LOAD PAPERS ================= */
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/papers.json")
    .then(res => {
      if (!res.ok) throw new Error("papers.json not found");
      return res.json();
    })
    .then(data => {
      ALL_PAPERS = data;
      renderHomePapers(ALL_PAPERS);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("researchGrid").innerHTML =
        "<p style='text-align:center;color:#666'>No papers available.</p>";
    });

  const input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("input", searchPapers);
  }
});

/* ================= SEARCH ================= */
function searchPapers() {
  const q = document.getElementById("searchInput").value
    .toLowerCase()
    .trim();

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
  grid.innerHTML = "";

  if (!papers.length) {
    grid.innerHTML =
      "<p style='text-align:center;color:#666'>No matching papers found.</p>";
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

    card.onclick = () => window.open(p.pdf, "_blank");
    grid.appendChild(card);
  });
}
