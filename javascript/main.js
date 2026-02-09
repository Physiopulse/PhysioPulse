function toggleMenu() {
  document.getElementById("drawer").classList.toggle("open");
}

document.getElementById("year").textContent = new Date().getFullYear();

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
// ================= SEARCH PAPERS =================
function searchPapers() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();

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

