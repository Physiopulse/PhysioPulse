/* ================= SUPABASE INIT ================= */
const SUPABASE_URL = "https://kfjcgpilaxbwddzlemqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrh"; // keep your real key

const { createClient } = window.supabase;
const supabaseClient = createClient("https://kfjcgpilaxbwddzlemqa.supabase.co","sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrh" );

/* ================= ELEMENTS ================= */
const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const errorBox = document.getElementById("error");

/* ================= CHECK SESSION ================= */
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    showPanel();
  }
});

/* ================= LOGIN ================= */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorBox.innerText = "Invalid credentials";
    return;
  }

  showPanel();
}

/* ================= LOGOUT ================= */
async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}

/* ================= SHOW PANEL ================= */
function showPanel() {
  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");
  loadPapers();
}

/* ================= PUBLISH ================= */
async function publish() {

  const title = document.getElementById("title").value.trim();
  const subtitle = document.getElementById("subtitle").value.trim();
  const year = document.getElementById("year").value.trim();

  const pdfFile = document.getElementById("pdfFile").files[0];
  const imgFile = document.getElementById("imgFile").files[0];

  if (!title || !pdfFile || !imgFile) {
    alert("Please complete all required fields.");
    return;
  }

  /* ===== Upload PDF ===== */
  const pdfPath = `pdfs/${Date.now()}-${pdfFile.name}`;

  const { error: pdfError } = await supabaseClient.storage
    .from("pdfs")
    .upload(pdfPath, pdfFile);

  if (pdfError) {
    alert(pdfError.message);
    return;
  }

  const { data: pdfData } = supabaseClient.storage
    .from("pdfs")
    .getPublicUrl(pdfPath);

  /* ===== Upload Image ===== */
  const imgPath = `thumbs/${Date.now()}-${imgFile.name}`;

  const { error: imgError } = await supabaseClient.storage
    .from("thumbnails")
    .upload(imgPath, imgFile);

  if (imgError) {
    alert(imgError.message);
    return;
  }

  const { data: imgData } = supabaseClient.storage
    .from("thumbnails")
    .getPublicUrl(imgPath);

  /* ===== Insert Database ===== */
  const { error: insertError } = await supabaseClient
    .from("papers")
    .insert([
      {
        title,
        subtitle,
        year,
        pdf_url: pdfData.publicUrl,
        thumb_url: imgData.publicUrl,
        views: 0
      }
    ]);

  if (insertError) {
    alert(insertError.message);
    return;
  }

  alert("Paper Published Successfully!");
  loadPapers();
}

/* ================= LOAD PAPERS ================= */
async function loadPapers() {

  const { data, error } = await supabaseClient
    .from("papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const paperList = document.getElementById("paperList");
  paperList.innerHTML = "";

  if (!data.length) {
    paperList.innerHTML = "<p>No papers published yet.</p>";
    return;
  }

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "paper";

    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.subtitle || ""} ${p.year ? " • " + p.year : ""}</small>
    `;

    paperList.appendChild(div);
  });
}





