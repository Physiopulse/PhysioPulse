

/* ================= INIT ================= */
const SUPABASE_URL = "https://kfjcgpilaxbwddzlemqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrh";

const supabase = window.supabase.createClient(
  "https://kfjcgpilaxbwddzlemqa.supabase.co",
  "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrh"
);

/* ================= ELEMENTS ================= */
const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const errorEl = document.getElementById("error");

const loginBtn = document.getElementById("loginBtn");
const publishBtn = document.getElementById("publishBtn");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.addEventListener("click", login);
publishBtn.addEventListener("click", publish);
logoutBtn.addEventListener("click", logout);

/* ================= SESSION CHECK ================= */
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) showPanel();
});

/* ================= LOGIN ================= */
async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

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
  loginBox.style.display = "none";
  panel.style.display = "block";
  loadPapers();
}

/* ================= LOGOUT ================= */
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

/* ================= PUBLISH ================= */
async function publish() {

  const title = document.getElementById("title").value.trim();
  const subtitle = document.getElementById("subtitle").value.trim();
  const year = document.getElementById("year").value.trim();
  const pdfFile = document.getElementById("pdfFile").files[0];
  const imgFile = document.getElementById("imgFile").files[0];

  if (!title || !pdfFile || !imgFile) {
    alert("Fill all fields");
    return;
  }

  /* Upload PDF */
  const pdfName = Date.now() + "-" + pdfFile.name;

  const { error: pdfError } = await supabase.storage
    .from("pdfs")
    .upload(pdfName, pdfFile);

  if (pdfError) {
    alert(pdfError.message);
    return;
  }

  const { data: pdfData } = supabase.storage
    .from("pdfs")
    .getPublicUrl(pdfName);

  /* Upload Image */
  const imgName = Date.now() + "-" + imgFile.name;

  const { error: imgError } = await supabase.storage
    .from("thumbnails")
    .upload(imgName, imgFile);

  if (imgError) {
    alert(imgError.message);
    return;
  }

  const { data: imgData } = supabase.storage
    .from("thumbnails")
    .getPublicUrl(imgName);

  /* Insert DB */
  const { error: insertError } = await supabase
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

  alert("Published successfully!");
  loadPapers();
}

/* ================= LOAD PAPERS ================= */
async function loadPapers() {

  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return;

  const list = document.getElementById("paperList");
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = "<p>No papers yet.</p>";
    return;
  }

  data.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.subtitle || ""} ${p.year ? " • " + p.year : ""}</small>
      <hr>
    `;
    list.appendChild(div);
  });
}






