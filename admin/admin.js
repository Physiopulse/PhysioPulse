function addPDF() {
  const data = {
    title: pdfTitle.value,
    pdf: pdfUrl.value,
    thumb: thumbUrl.value
  };

  const list = JSON.parse(localStorage.getItem("pdfs") || "[]");
  list.push(data);
  localStorage.setItem("pdfs", JSON.stringify(list));

  alert("PDF added successfully!");
}

function addEditor() {
  const data = {
    name: editorName.value,
    role: editorRole.value,
    img: editorImg.value,
    section: editorSection.value
  };

  const list = JSON.parse(localStorage.getItem("editors") || "[]");
  list.push(data);
  localStorage.setItem("editors", JSON.stringify(list));

  alert("Editorial member added!");
}
