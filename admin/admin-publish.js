// ================= CORRECT HASH =================
const ADMIN_HASH = "8c2069ca7865c8b85ca99bdd0070805544ff5c6f94033f3d58e4162f70d23eee";

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

    const enteredHash = await hashPassword(passwordInput.value.trim());

    if (enteredHash === ADMIN_HASH) {

      localStorage.setItem("pp_admin", "active-session");

      loginBox.classList.add("hidden");
      panel.classList.remove("hidden");

      renderPapers();

    } else {
      error.innerText = "Wrong password";
    }
  };

  /* ================= LOGOUT ================= */
  window.logout = function () {
    localStorage.removeItem("pp_admin");
    location.reload();
  };

  /* ================= SESSION CHECK ================= */
  if (localStorage.getItem("pp_admin")) {
    loginBox.classList.add("hidden");
    panel.classList.remove("hidden");
    renderPapers();
  }

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

  /* ================= LIST ================= */
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

  /* ================= DELETE ================= */
  window.deletePaper = function (i) {

    if (!confirm("Unpublish this paper?")) return;

    const papers = JSON.parse(
      localStorage.getItem("physiopulse_papers") || "[]"
    );

    papers.splice(i, 1);
    localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

    renderPapers();
  };
/* ================= DISABLE RIGHT CLICK (ADMIN ONLY) ================= */

document.addEventListener("contextmenu", function (e) {

  // Only block if admin panel is visible
  if (!panel.classList.contains("hidden")) {
    e.preventDefault();
  }

});

});




