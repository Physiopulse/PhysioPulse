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
function publish(){
  if(!title.value || !pdfFile.files[0] || !imgFile.files[0]){
    alert("Fill all fields");
    return;
  }

  const pdfPath = "pdfs/" + pdfFile.files[0].name;
  const imgPath = "images/" + imgFile.files[0].name;

  const papers = JSON.parse(localStorage.getItem("physiopulse_papers")||"[]");

  papers.push({
    title:title.value,
    subtitle:subtitle.value,
    pdf:pdfPath,
    thumb:imgPath
  });

  localStorage.setItem("physiopulse_papers",JSON.stringify(papers));
  alert("Published successfully");

  title.value="";
  subtitle.value="";
  pdfFile.value="";
  imgFile.value="";
  imgPreview.style.display="none";

  renderPapers();
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
