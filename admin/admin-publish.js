// ================= CONFIG =================
const ADMIN_PASSWORD = "physio-admin";

// ================= LOGIN =================
function login() {
  const pass = document.getElementById("password").value;

  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("pp_admin", "true");
    showPanel();
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

function showPanel() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("panel").classList.remove("hidden");
  renderPapers();
}

function logout() {
  localStorage.removeItem("pp_admin");
  location.reload();
}

if (localStorage.getItem("pp_admin") === "true") {
  showPanel();
}

// ================= FILE PICKERS =================
let selectedPDF = "";
let selectedImage = "";

document.getElementById("pdfFile")?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file || file.type !== "application/pdf") {
    alert("Select a valid PDF");
    return;
  }
  selectedPDF = file.name;
});

document.getElementById("imgFile")?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    alert("Select a valid image");
    return;
  }

  selectedImage = file.name;

  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById("imgPreview");
    img.src = ev.target.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// ================= PUBLISH =================
function publish() {
  const title = document.getElementById("title").value.trim();
  const subtitle = document.getElementById("subtitle").value.trim();

  if (!title || !selectedPDF || !selectedImage) {
    alert("Please fill all fields and select files");
    return;
  }

  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  papers.push({
    title: title,
    subtitle: subtitle,
    pdf: "pdfs/" + selectedPDF,
    thumb: "images/" + selectedImage
  });

  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

  alert("Paper published successfully!");

  document.getElementById("title").value = "";
  document.getElementById("subtitle").value = "";
  document.getElementById("pdfFile").value = "";
  document.getElementById("imgFile").value = "";
  document.getElementById("imgPreview").style.display = "none";

  selectedPDF = "";
  selectedImage = "";

  renderPapers();
}

// ================= RENDER / DELETE =================
function renderPapers() {
  const list = document.getElementById("paperList");
  list.innerHTML = "";

  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  if (papers.length === 0) {
    list.innerHTML = "<p>No papers published yet.</p>";
    return;
  }

  papers.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "paper";
    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.subtitle || ""}</small><br>
      <button class="danger" onclick="deletePaper(${i})">Delete</button>
    `;
    list.appendChild(div);
  });
}

function deletePaper(index) {
  if (!confirm("Unpublish this paper?")) return;

  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  papers.splice(index, 1);
  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));
  renderPapers();
}
