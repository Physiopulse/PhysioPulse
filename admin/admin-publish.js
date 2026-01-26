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
  renderPapers();
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

  zone.addEventListener("dragleave", () => zone.classList.remove("drag"));

  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag");
    callback(e.dataTransfer.files[0]);
  });
}

setupDrop(pdfDrop, file => {
  if (file?.type !== "application/pdf") {
    alert("Please drop a valid PDF");
    return;
  }
  pdfInfo.innerText = `${file.name}`;
  pdfInput.value = `pdfs/${file.name}`;
});

setupDrop(imgDrop, file => {
  if (!file?.type.startsWith("image/")) {
    alert("Please drop a valid image");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.src = e.target.result;
    imgPreview.style.display = "block";
  };
  reader.readAsDataURL(file);
  thumbInput.value = `images/${file.name}`;
});

/* ================= PUBLISH ================= */
function publish() {
  if (!titleInput.value || !pdfInput.value || !thumbInput.value) {
    alert("Please complete all fields");
    return;
  }

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers") || "[]");

  papers.push({
    title: titleInput.value,
    subtitle: subtitleInput.value,
    pdf: pdfInput.value,
    thumb: thumbInput.value
  });

  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

  titleInput.value = "";
  subtitleInput.value = "";
  pdfInput.value = "";
  thumbInput.value = "";
  pdfInfo.innerText = "";
  imgPreview.style.display = "none";

  renderPapers();
  alert("Paper published successfully!");
}

/* ================= DELETE ================= */
function renderPapers() {
  paperList.innerHTML = "";

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers") || "[]");

  if (papers.length === 0) {
    paperList.innerHTML = "<p>No papers published yet.</p>";
    return;
  }

  papers.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "paper-item";
    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.subtitle || ""}</small><br>
      <button onclick="deletePaper(${i})">Delete</button>
    `;
    paperList.appendChild(div);
  });
}

function deletePaper(index) {
  if (!confirm("Unpublish this paper?")) return;

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers") || "[]");
  papers.splice(index, 1);
  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));
  renderPapers();
}
function handlePDFDrop(file) {
  if (file?.type !== "application/pdf") {
    alert("Please drop a valid PDF");
    return;
  }
  pdfInfo.innerText = file.name;
  pdfInput.value = `pdfs/${file.name}`;
}

function handleImageDrop(file) {
  if (!file?.type.startsWith("image/")) {
    alert("Please drop a valid image");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.src = e.target.result;
    imgPreview.style.display = "block";
  };
  reader.readAsDataURL(file);
  thumbInput.value = `images/${file.name}`;
}

/* ================= SAFE DOM INIT ================= */
window.addEventListener("DOMContentLoaded", () => {

  window.loginBox = document.getElementById("loginBox");
  window.panel = document.getElementById("panel");
  window.error = document.getElementById("error");

  window.titleInput = document.getElementById("title");
  window.subtitleInput = document.getElementById("subtitle");
  window.pdfInput = document.getElementById("pdf");
  window.thumbInput = document.getElementById("thumb");

  window.pdfDrop = document.getElementById("pdfDrop");
  window.imgDrop = document.getElementById("imgDrop");
  window.pdfInfo = document.getElementById("pdfInfo");
  window.imgPreview = document.getElementById("imgPreview");
  window.paperList = document.getElementById("paperList");

  setupDrop(pdfDrop, handlePDFDrop);
  setupDrop(imgDrop, handleImageDrop);

  if (localStorage.getItem("pp_admin") === "true") {
    showPanel();
  }
});


