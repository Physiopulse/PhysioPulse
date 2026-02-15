/* ================= SUPABASE CONFIG ================= */

const { createClient } = window.supabase;

const supabase = createClient(
  "https://kfjcgpilaxbwddzlemqa.supabase.co",
  "sb_publishable_MsZECRHn-hpaXhAcZR_P-g_451qrrhF"
);

/* ================= ELEMENTS ================= */

const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const error = document.getElementById("error");

/* ================= AUTO SESSION CHECK ================= */

document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    loginBox.classList.add("hidden");
    panel.classList.remove("hidden");
  }
});

/* ================= LOGIN ================= */

async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    error.innerText = loginError.message;
    return;
  }

  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");
}

/* ================= LOGOUT ================= */

async function logout() {
  await supabaseClient.auth.signOut();
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
    alert("Please complete all required fields.");
    return;
  }

  /* ========= UPLOAD PDF ========= */

  const pdfPath = `${Date.now()}-${pdfFile.name}`;

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

  /* ========= UPLOAD THUMB ========= */

  const thumbPath = `${Date.now()}-${thumbFile.name}`;

  const { error: thumbError } = await supabaseClient.storage
    .from("thumbnails")
    .upload(thumbPath, thumbFile);

  if (thumbError) {
    alert(thumbError.message);
    return;
  }

  const { data: thumbData } = supabaseClient.storage
    .from("thumbnails")
    .getPublicUrl(thumbPath);

  /* ========= INSERT INTO DATABASE ========= */

  const { error: insertError } = await supabaseClient
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
    alert(insertError.message);
    return;
  }

  alert("Paper published successfully!");

  document.getElementById("title").value = "";
  document.getElementById("subtitle").value = "";
  document.getElementById("year").value = "";
  document.getElementById("pdfFile").value = "";
  document.getElementById("imgFile").value = "";
}


