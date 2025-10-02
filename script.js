// Modal Sertifikat
function openModal(imgSrc) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal-img").src = imgSrc;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 0);
});