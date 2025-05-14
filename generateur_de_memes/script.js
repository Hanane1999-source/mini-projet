// Récupération des éléments DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageInput = document.getElementById("imageUpload");
const textInput = document.getElementById("memeText");
const gallery = document.getElementById("gallery");
const fontFamily = document.getElementById("fontFamily");
const fontSize = document.getElementById("fontSize");
const fontColor = document.getElementById("fontColor");
const bold = document.getElementById("bold");
const italic = document.getElementById("italic");
const highlight = document.getElementById("highlight");
const highlightColor = document.getElementById("highlightColor");

let img = new Image();
let textX = 50;
let textY = 50;
let dragging = false;
let offsetX, offsetY;

// Dessine le mème sur le canvas
function drawMeme() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (img.src) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  const text = textInput.value.trim();
  if (text) {
    let font = "";
    if (italic.checked) font += "italic ";
    if (bold.checked) font += "bold ";
    font += fontSize.value + "px '" + fontFamily.value + "'";
    ctx.font = font;
    if (highlight.checked) {
      const textWidth = ctx.measureText(text).width;
      const textHeight = parseInt(fontSize.value, 10);
      ctx.fillStyle = highlightColor.value;
      ctx.fillRect(textX - 5, textY - textHeight, textWidth + 10, textHeight + 10);
    }
    ctx.fillStyle = fontColor.value;
    ctx.fillText(text, textX, textY);
  }
}

// Chargement de l'image
imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    img.onload = drawMeme;
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Mise à jour du texte
textInput.addEventListener("input", drawMeme);
fontFamily.addEventListener("change", drawMeme);
fontSize.addEventListener("input", drawMeme);
fontColor.addEventListener("input", drawMeme);
bold.addEventListener("change", drawMeme);
italic.addEventListener("change", drawMeme);
highlight.addEventListener("change", drawMeme);
highlightColor.addEventListener("input", drawMeme);

// Déplacement du texte sur le canvas
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (Math.abs(x - textX) < 150 && Math.abs(y - textY) < 50) {
    dragging = true;
    offsetX = x - textX;
    offsetY = y - textY;
  }
});
canvas.addEventListener("mousemove", e => {
  if (dragging) {
    const rect = canvas.getBoundingClientRect();
    textX = e.clientX - rect.left - offsetX;
    textY = e.clientY - rect.top - offsetY;
    drawMeme();
  }
});
canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);

// Télécharger le mème
function downloadMeme() {
  if (!img.src || !textInput.value.trim()) {
    alert("Ajoutez une image et un texte pour créer un mème !");
    return;
  }
  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL();
  link.click();
  addToGallery(canvas.toDataURL());
}

// Partager le mème
function shareMeme() {
  if (!img.src || !textInput.value.trim()) {
    alert("Ajoutez une image et un texte pour partager !");
    return;
  }
  canvas.toBlob(blob => {
    const file = new File([blob], "meme.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: "Mème",
        text: "Voici un mème que j’ai créé !"
      }).catch(console.error);
    } else {
      alert("Partage non supporté sur ce navigateur.");
    }
  });
}

// Ajout à la galerie
function addToGallery(dataUrl) {
  const image = document.createElement("img");
  image.src = dataUrl;
  gallery.appendChild(image);
}
