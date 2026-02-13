/* ================= CONFIG ================= */
const ADMIN_PASSWORD = "physio-admin";
// ================= HARD ACCESS PROTECTION =================
if (localStorage.getItem("pp_admin") !== "true") {
  const allowed = confirm("Admin access required. Login?");
  if (!allowed) {
    window.location.href = "index.html";
  }
}

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
  const paperList = document.getElementById("paperList");

  /* ================= LOGIN ================= */
  window.login = function () {
    if (passwordInput.value === ADMIN_PASSWORD) {
      localStorage.setItem("pp_admin", "true");
      showPanel();
    } else {
      error.innerText = "Wrong password";
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

  if (localStorage.getItem("pp_admin") === "true") {
    showPanel();
  }
  // ================= AUTO LOGOUT (5 MINUTES) =================
/* ================= AUTO LOGOUT SYSTEM ================= */

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
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
if (localStorage.getItem("pp_admin") === "true") {

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




