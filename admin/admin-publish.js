/* ================= SUPABASE CONFIG ================= */
const SUPABASE_URL = "https://kfjcgpilaxbwddzlemqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrhF";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ================= ADMIN LOGIN ================= */
const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const error = document.getElementById("error");

async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    error.innerText = "Invalid credentials";
    return;
  }

  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

/* ================= UPLOAD PAPER ================= */
async function publish() {

  const title = document.getElementById("title").value.trim();
  const subtitle = document.getElementById("subtitle").value.trim();
  const year = document.getElementById("year").value.trim();

  const pdfFile = document.getElementById("pdfFile").files[0];
  const thumbFile = document.getElementById("imgFile").files[0];

  if (!title || !pdfFile || !thumbFile) {
    alert("Please complete all required fields.");
    return;
  }

  /* ========= UPLOAD PDF ========= */
  const pdfPath = `pdfs/${Date.now()}-${pdfFile.name}`;

  const { error: pdfError } = await supabase.storage
    .from("pdfs")
    .upload(pdfPath, pdfFile);

  if (pdfError) {
    alert("PDF upload failed.");
    return;
  }

  const { data: pdfData } = supabase.storage
    .from("pdfs")
    .getPublicUrl(pdfPath);

  /* ========= UPLOAD THUMBNAIL ========= */
  const thumbPath = `thumbs/${Date.now()}-${thumbFile.name}`;

  const { error: thumbError } = await supabase.storage
    .from("thumbnails")
    .upload(thumbPath, thumbFile);

  if (thumbError) {
    alert("Thumbnail upload failed.");
    return;
  }

  const { data: thumbData } = supabase.storage
    .from("thumbnails")
    .getPublicUrl(thumbPath);

  /* ========= INSERT INTO DATABASE ========= */
  const { error: insertError } = await supabase
    .from("papers")
    .insert([
      {
        title,
        subtitle,
        year,
        pdf_url: pdfData.publicUrl,
        thumb_url: thumbData.publicUrl,
        views: 0
      }
    ]);

  if (insertError) {
    alert("Database insert failed.");
    return;
  }

  alert("Paper published successfully!");

  document.getElementById("title").value = "";
  document.getElementById("subtitle").value = "";
  document.getElementById("year").value = "";
}
