/* ================= SUPABASE INIT ================= */
const { createClient } = window.supabase;

const supabase = createClient(
  "https://kfjcgpilaxbwddzlemqa.supabase.co",
  "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrhF"
);

/* ================= ELEMENTS ================= */
const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const errorEl = document.getElementById("error");
const paperList = document.getElementById("paperList");

/* ================= AUTO SESSION CHECK ================= */
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    showPanel();
  }
});

/* ================= LOGIN ================= */
async function login() {

  errorEl.innerText = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorEl.innerText = "Enter email and password";
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorEl.innerText = "Invalid credentials";
    return;
  }

  showPanel();
}

/* ================= SHOW PANEL ================= */
function showPanel() {
  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");
  loadPapers();
}

/* ================= LOGOUT ================= */
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

/* ================= PUBLISH PAPER ================= */
async function publish() {

  const title = document.getElementById("title").value.trim();
  const subtitle = document.getElementById("subtitle").value.trim();
  const year = document.getElementById("year").value.trim();
  const pdfFile = document.getElementById("pdfFile").files[0];
  const thumbFile = document.getElementById("imgFile").files[0];

  if (!title || !pdfFile || !thumbFile) {
    alert("Fill all required fields.");
    return;
  }

  /* ===== Upload PDF ===== */
  const pdfPath = `${Date.now()}-${pdfFile.name}`;

  const { error: pdfError } = await supabase.storage
    .from("pdfs")
    .upload(pdfPath, pdfFile);

  if (pdfError) {
    alert("PDF upload failed: " + pdfError.message);
    return;
  }

  const { data: pdfData } = supabase.storage
    .from("pdfs")
    .getPublicUrl(pdfPath);

  /* ===== Upload Thumbnail ===== */
  const thumbPath = `${Date.now()}-${thumbFile.name}`;

  const { error: thumbError } = await supabase.storage
    .from("thumbnails")
    .upload(thumbPath, thumbFile);

  if (thumbError) {
    alert("Thumbnail upload failed: " + thumbError.message);
    return;
  }

  const { data: thumbData } = supabase.storage
    .from("thumbnails")
    .getPublicUrl(thumbPath);

  /* ===== Insert into DB ===== */
  const { error: insertError } = await supabase
    .from("papers")
    .insert([
      {
        title: title,
        subtitle: subtitle,
        year: year,
        pdf_url: pdfData.publicUrl,
        thumb_url: thumbData.publicUrl,
        views: 0
      }
    ]);

  if (insertError) {
    alert("Database insert failed: " + insertError.message);
    return;
  }

  alert("Paper published successfully!");

  document.getElementById("title").value = "";
  document.getElementById("subtitle").value = "";
  document.getElementById("year").value = "";
  document.getElementById("pdfFile").value = "";
  document.getElementById("imgFile").value = "";

  loadPapers();
}

/* ================= LOAD PUBLISHED PAPERS ================= */
async function loadPapers() {

  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  paperList.innerHTML = "";

  if (!data.length) {
    paperList.innerHTML = "<p>No papers published yet.</p>";
    return;
  }

  data.forEach(paper => {
    const div = document.createElement("div");
    div.className = "paper";
    div.innerHTML = `
      <strong>${paper.title}</strong><br>
      <small>${paper.subtitle || ""} ${paper.year ? " • " + paper.year : ""}</small>
    `;
    paperList.appendChild(div);
  });
}
