/* ================= CONFIG ================= */
// ================= SECURE HASHED PASSWORD =================
const ADMIN_HASH = "9d5e3ecdeb94b0cfa2e63d0dfd8eaa1c6c3dbb0a2f6d6a31d2b1e8a71c2e0d52"; 
// ================= HARD ACCESS PROTECTION =================
if (localStorage.getItem("pp_admin") !== "true") {
  const allowed = confirm("Admin access required. Login?");
  if (!allowed) {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // ================= ADMIN ROUTE PROTECTION =================
const allowedPath = "pp-portal-8437.html";

if (!window.location.pathname.includes(allowedPath)) {
  window.location.href = "index.html";
}
  // ================= BASIC ANTI-TAMPER =================
if (!window.crypto || !window.crypto.subtle) {
  document.body.innerHTML = "<h1>Unsupported Environment</h1>";
}


  const loginBox = document.getElementById("loginBox");
  const panel = document.getElementById("panel");
  const error = document.getElementById("error");
  const passwordInput = document.getElementById("password");

  const titleInput = document.getElementById("title");
  const subtitleInput = document.getElementById("subtitle");
  const yearInput = document.getElementById("year");
  const pdfFile = document.getElementById("pdfFile");
  const imgFile = document.getElementById("imgFile");
  const paperList = document.getElementById("paperList");
  // ================= DEVTOOLS DETECTION =================
setInterval(function () {
  if (window.outerWidth - window.innerWidth > 160 ||
      window.outerHeight - window.innerHeight > 160) {

    document.body.innerHTML = "<h1>Access Restricted</h1>";
  }
}, 1000);


  /* ================= LOGIN ================= */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

window.login = async function () {

  if (isLocked()) {
    alert("Too many failed attempts. Try again later.");
    return;
  }

  const enteredHash = await hashPassword(passwordInput.value);

  if (enteredHash === ADMIN_HASH) {

    const sessionToken = btoa(Date.now() + "-" + Math.random());
    localStorage.setItem("pp_admin", sessionToken);
    showPanel();

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

/* ================= AUTO LOGOUT SYSTEM ================= */

const INACTIVITY_LIMIT = 5 * 60 * 1000;// 5 minutes
let inactivityTimer;

// Start timer only if logged in
function startInactivityTimer() {

  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {

    localStorage.removeItem("pp_admin");
    alert("Session expired due to inactivity.");
    window.location.reload();

  }, INACTIVITY_LIMIT);
}

// Reset timer on user activity
function resetInactivityTimer() {
  startInactivityTimer();
}

// Only activate when admin is logged in
if (localStorage.getItem("pp_admin")) {

  startInactivityTimer();

  document.addEventListener("mousemove", resetInactivityTimer);
  document.addEventListener("keydown", resetInactivityTimer);
  document.addEventListener("click", resetInactivityTimer);
  document.addEventListener("scroll", resetInactivityTimer);

}

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

    papers.push({
      title: titleInput.value.trim(),
      subtitle: subtitleInput.value.trim(),
      year: yearInput ? yearInput.value.trim() : "",
      pdf: pdfPath,
      thumb: thumbPath
    });

    localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

    alert("Paper published successfully!");

    renderPapers();

    titleInput.value = "";
    subtitleInput.value = "";
    if (yearInput) yearInput.value = "";
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
// ================= DISABLE RIGHT CLICK =================
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});
// ================= BLOCK DEVTOOLS SHORTCUTS =================
document.addEventListener("keydown", function(e) {
  if (e.key === "F12" ||
     (e.ctrlKey && e.shiftKey && e.key === "I") ||
     (e.ctrlKey && e.key === "U")) {
    e.preventDefault();
  }
});








