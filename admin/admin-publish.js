/* ================= PASSWORD ================= */
const ADMIN_PASSWORD = "physio-admin";

/* ================= LOGIN ================= */
function login() {
  if (password.value === ADMIN_PASSWORD) {
    localStorage.setItem("pp_admin", "true");
    showPanel();
  } else {
    error.innerText = "Wrong password";
  }
}

function showPanel() {
  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("pp_admin");
  location.reload();
}

if (localStorage.getItem("pp_admin") === "true") {
  showPanel();
}

/* ================= DRAG & DROP ================= */
function setupDrop(zone, callback) {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("drag");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag");
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag");
    callback(e.dataTransfer.files[0]);
  });
}

/* PDF */
setupDrop(pdfDrop, file => {
  if (!file || file.type !== "application/pdf") {
    alert("Please drop a valid PDF");
    return;
  }
  pdfInfo.innerText = `${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`;
  pdf.value = `pdfs/${file.name}`;
});

/* IMAGE */
setupDrop(imgDrop, file => {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please drop a valid image");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.src = e.target.result;
    imgPreview.style.display = "block";
  };
  reader.readAsDataURL(file);

  thumb.value = `images/${file.name}`;
});

/* ================= PUBLISH ================= */
function publish() {
  if (!title.value || !pdf.value || !thumb.value) {
    alert("Please complete all fields");
    return;
  }

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers") || "[]");

  papers.push({
    title: title.value,
    subtitle: subtitle.value,
    pdf: pdf.value,
    thumb: thumb.value
  });

  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));
  alert("Paper published successfully!");
}
/* ======================================================
   DELETE / UNPUBLISH FEATURE
   ====================================================== */

function renderPapers() {
  const list = document.getElementById("paperList");
  if (!list) return;

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers") || "[]");
  list.innerHTML = "";

  if (papers.length === 0) {
    list.innerHTML = "<p>No papers published yet.</p>";
    return;
  }

  papers.forEach((p, index) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.padding = "12px";
    div.style.borderRadius = "10px";
    div.style.marginBottom = "10px";
    div.style.background = "#f9f9f9";

    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.subtitle || ""}</small><br>
      <button onclick="deletePaper(${index})"
        style="
          margin-top:8px;
          background:#c0392b;
          color:#fff;
          border:none;
          padding:6px 14px;
          border-radius:6px;
          cursor:pointer
        ">
        Delete
      </button>
    `;

    list.appendChild(div);
  });
}

function deletePaper(index) {
  if (!confirm("Are you sure you want to unpublish this paper?")) return;

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers") || "[]");
  papers.splice(index, 1);
  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

  renderPapers();
  alert("Paper unpublished successfully.");
}

/* Re-render after publish */
const originalPublish = publish;
publish = function () {
  originalPublish();
  renderPapers();
};

/* Render on admin load */
renderPapers();
