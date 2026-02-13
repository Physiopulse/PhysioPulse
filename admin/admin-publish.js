// ================= SECURE HASHED PASSWORD =================
const ADMIN_HASH =
  "8c6976e5b5410415bde908bd4dee15dfb16f5f8d8e8b5f9d2d1a3c6d53295d85";

document.addEventListener("DOMContentLoaded", function () {

  const loginBox = document.getElementById("loginBox");
  const panel = document.getElementById("panel");
  const error = document.getElementById("error");
  const passwordInput = document.getElementById("password");

  const titleInput = document.getElementById("title");
  const subtitleInput = document.getElementById("subtitle");
  const yearInput = document.getElementById("year");
  const pdfFile = document.getElementById("pdfFile");
  const imgFile = document.getElementById("imgFile");
  const imgPreview = document.getElementById("imgPreview");
  const paperList = document.getElementById("paperList");

  /* ================= LOGIN LIMITER ================= */
  let loginAttempts = 0;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 10 * 60 * 1000;

   function isLocked() {
   const lockUntil = localStorage.getItem("admin_lock_until");
    if (!lockUntil) return false;
    return Date.now() < parseInt(lockUntil);
  }

  /* ================= HASH FUNCTION ================= */
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  /* ================= LOGIN ================= */
  window.login = async function () {

    if (isLocked()) {
      alert("Too many failed attempts. Try again later.");
      return;
    }

    const enteredHash = await hashPassword(passwordInput.value.trim());

    if (enteredHash === ADMIN_HASH) {

      const sessionToken = btoa(Date.now() + "-" + Math.random());
      localStorage.setItem("pp_admin", sessionToken);

      showPanel();
      startInactivityTimer();

    } else {

      loginAttempts++;
      error.innerText = "Wrong password";

      if (loginAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_TIME;
        localStorage.setItem("admin_lock_until", lockUntil);
        alert("Admin locked for 10 minutes.");
      }
    }
  };

  function showPanel() {
    loginBox.classList.add("hidden");
    panel.classList.remove("hidden");
    renderPapers();
  }

  window.logout = function () {
    localStorage.removeItem("pp_admin");
    location.reload();
  };

  /* ================= SESSION CHECK ================= */
  if (localStorage.getItem("pp_admin")) {
    showPanel();
    startInactivityTimer();
  }

  /* ================= AUTO LOGOUT ================= */
  const INACTIVITY_LIMIT = 5 * 60 * 1000;
  let inactivityTimer;

  function startInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      localStorage.removeItem("pp_admin");
      alert("Session expired.");
      location.reload();
    }, INACTIVITY_LIMIT);
  }

  document.addEventListener("mousemove", startInactivityTimer);
  document.addEventListener("keydown", startInactivityTimer);
  document.addEventListener("click", startInactivityTimer);

  /* ================= IMAGE PREVIEW ================= */
  imgFile.addEventListener("change", function () {
    const file = imgFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      imgPreview.src = e.target.result;
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  /* ================= PUBLISH ================= */
  window.publish = function () {

    if (!titleInput.value || !pdfFile.files.length || !imgFile.files.length) {
      alert("Please complete all required fields.");
      return;
    }

    const pdfPath = "pdfs/" + pdfFile.files[0].name;
    const thumbPath = "images/" + imgFile.files[0].name;

    const papers = JSON.parse(
      localStorage.getItem("physiopulse_papers") || "[]"
    );

    papers.unshift({
      title: titleInput.value.trim(),
      subtitle: subtitleInput.value.trim(),
      year: yearInput.value.trim(),
      pdf: pdfPath,
      thumb: thumbPath
    });

    localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

    alert("Paper published successfully!");

    renderPapers();

    titleInput.value = "";
    subtitleInput.value = "";
    yearInput.value = "";
  };

  /* ================= LIST & DELETE ================= */
  function renderPapers() {

    const papers = JSON.parse(
      localStorage.getItem("physiopulse_papers") || "[]"
    );

    paperList.innerHTML = "";

    if (papers.length === 0) {
      paperList.innerHTML = "<p>No papers published yet.</p>";
      return;
    }

    papers.forEach((p, i) => {

      const div = document.createElement("div");
      div.className = "paper";

      div.innerHTML = `
        <strong>${p.title}</strong><br>
        <small>${p.subtitle || ""} ${p.year ? " • " + p.year : ""}</small><br>
        <button onclick="deletePaper(${i})"
          style="margin-top:8px;background:#c0392b;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer">
          Delete
        </button>
      `;

      paperList.appendChild(div);
    });
  }

  window.deletePaper = function (i) {
    if (!confirm("Unpublish this paper?")) return;

    const papers = JSON.parse(
      localStorage.getItem("physiopulse_papers") || "[]"
    );

    papers.splice(i, 1);
    localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

    renderPapers();
  };

});



