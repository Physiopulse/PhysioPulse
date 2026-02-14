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

/* ================= LOAD PAPERS FROM SUPABASE ================= */
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

/* ================= RENDER PAPERS ================= */
function renderHomePapers(papers) {
  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!papers || papers.length === 0) {
    grid.innerHTML = `
      <p style="text-align:center;width:100%;color:#666">
        No research papers found.
      </p>`;
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

/* ================= OPEN PDF + INCREMENT VIEWS ================= */
async function openPDF(id, pdfUrl) {

  // increment view count
  const { data } = await supabase
    .from("papers")
    .select("views")
    .eq("id", id)
    .single();

  const newViews = (data?.views || 0) + 1;

  await supabase
    .from("papers")
    .update({ views: newViews })
    .eq("id", id);

  loadPapers();

  // open viewer
  document.getElementById("pdfFrame").src = pdfUrl;
  document.getElementById("pdfViewer").classList.add("open");
}

function closePDF() {
  document.getElementById("pdfFrame").src = "";
  document.getElementById("pdfViewer").classList.remove("open");
}

/* ================= SEARCH ================= */
document.addEventListener("DOMContentLoaded", () => {

  loadPapers();

  const input = document.getElementById("searchInput");
  const button = document.getElementById("searchBtn");

  if (!input || !button) return;

  async function runSearch() {

    const query = input.value.toLowerCase().trim();

    if (!query) {
      loadPapers();
      return;
    }

    const { data } = await supabase
      .from("papers")
      .select("*");

    const filtered = data.filter(p =>
      p.title.toLowerCase().includes(query) ||
      (p.subtitle || "").toLowerCase().includes(query) ||
      (p.year || "").toLowerCase().includes(query)
    );

    renderHomePapers(filtered);
  }

  input.addEventListener("input", runSearch);
  button.addEventListener("click", runSearch);
});

