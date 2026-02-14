/* ================= SUPABASE CONFIG ================= */
const SUPABASE_URL = "https://kfjcgpilaxbwddzlemqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrhF";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ================= FOOTER YEAR ================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= LOAD PAPERS ================= */
async function loadPapers() {

  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading papers:", error);
    return;
  }

  renderHomePapers(data);
}

document.addEventListener("DOMContentLoaded", loadPapers);

/* ================= RENDER PAPERS ================= */
function renderHomePapers(papers) {

  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!papers.length) {
    grid.innerHTML = "<p>No papers found.</p>";
    return;
  }

  papers.forEach(p => {

    const card = document.createElement("div");
    card.className = "research-card";

    card.innerHTML = `
      <img src="${p.thumb_url}" alt="${p.title}">
      <h3>
        ${p.title}
        <span>
          ${p.subtitle || ""}
          ${p.year ? " • " + p.year : ""}
        </span>
      </h3>
      <div class="view-count">${p.views || 0} Views</div>
    `;

    card.onclick = () => openPDF(p.id, p.pdf_url);

    grid.appendChild(card);
  });
}

/* ================= PDF VIEW + VIEW COUNTER ================= */
async function openPDF(id, url) {

  // Increase view count
  await supabase.rpc("increment_views", { row_id: id });

  // Open viewer
  document.getElementById("pdfFrame").src = url;
  document.getElementById("pdfViewer").classList.add("open");

  // Reload papers to refresh view count
  loadPapers();
}

function closePDF() {
  document.getElementById("pdfFrame").src = "";
  document.getElementById("pdfViewer").classList.remove("open");
}

/* ================= SEARCH ================= */
document.addEventListener("DOMContentLoaded", function () {

  const input = document.getElementById("searchInput");
  const button = document.getElementById("searchBtn");

  function runSearch() {
    const query = input.value.toLowerCase().trim();

    const cards = document.querySelectorAll(".research-card");

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  }

  input.addEventListener("input", runSearch);
  button.addEventListener("click", runSearch);

});
