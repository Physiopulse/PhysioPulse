/* ================= CONFIG ================= */
const ADMIN_PASSWORD = "physio-admin";

/* ================= ELEMENTS ================= */
const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const error = document.getElementById("error");

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const pdfFile = document.getElementById("pdfFile");
const imgFile = document.getElementById("imgFile");
const imgPreview = document.getElementById("imgPreview");
const paperList = document.getElementById("paperList");

/* ================= LOGIN ================= */
function login(){
  if(password.value === ADMIN_PASSWORD){
    localStorage.setItem("pp_admin","true");
    showPanel();
  }else{
    error.innerText = "Wrong password";
  }
}

function showPanel(){
  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");
  renderPapers();
}

function logout(){
  localStorage.removeItem("pp_admin");
  location.reload();
}

if(localStorage.getItem("pp_admin")==="true"){
  showPanel();
}

/* ================= PREVIEW IMAGE ================= */
imgFile.addEventListener("change",()=>{
  const file = imgFile.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    imgPreview.src = e.target.result;
    imgPreview.style.display="block";
  };
  reader.readAsDataURL(file);
});

/* ================= PUBLISH ================= */
function publish() {

  const titleInput = document.getElementById("title");
  const subtitleInput = document.getElementById("subtitle");
  const yearInput = document.getElementById("year");
  const pdfInput = document.getElementById("pdf");
  const thumbInput = document.getElementById("thumb");

  if (!titleInput.value || !pdfInput.value || !thumbInput.value) {
    alert("Please complete all required fields");
    return;
  }

  const papers = JSON.parse(
    localStorage.getItem("physiopulse_papers") || "[]"
  );

  papers.push({
    title: titleInput.value,
    subtitle: subtitleInput.value,
    year: yearInput ? yearInput.value : "",
    pdf: pdfInput.value,
    thumb: thumbInput.value
  });

  localStorage.setItem("physiopulse_papers", JSON.stringify(papers));

  alert("Paper published successfully!");

}

/* ================= LIST & DELETE ================= */
function renderPapers(){
  const papers = JSON.parse(localStorage.getItem("physiopulse_papers")||"[]");
  paperList.innerHTML = "";

  if(papers.length===0){
    paperList.innerHTML="<p>No papers published yet.</p>";
    return;
  }

  papers.forEach((p,i)=>{
    const div=document.createElement("div");
    div.className="paper";
    div.innerHTML=`
      <strong>${p.title}</strong><br>
      <small>${p.subtitle||""}</small><br>
      <button onclick="deletePaper(${i})"
        style="margin-top:8px;background:#c0392b;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer">
        Delete
      </button>
    `;
    paperList.appendChild(div);
  });
}

function deletePaper(i){
  if(!confirm("Unpublish this paper?")) return;
  const papers = JSON.parse(localStorage.getItem("physiopulse_papers")||"[]");
  papers.splice(i,1);
  localStorage.setItem("physiopulse_papers",JSON.stringify(papers));
  renderPapers();
}





