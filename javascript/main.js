function toggleMenu() {
  document.getElementById("drawer").classList.toggle("open");
}

document.getElementById("year").textContent = new Date().getFullYear();

function openPDF(path) {
  document.getElementById("pdfFrame").src = path;
  document.getElementById("pdfViewer").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePDF() {
  document.getElementById("pdfFrame").src = "";
  document.getElementById("pdfViewer").classList.remove("open");
  document.body.style.overflow = "auto";
}
