// Navbar toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Auto close menu after click
  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove("active");
    });
  });
});

// Modal Viewer
(function () {
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const inner = document.getElementById('modal-inner');
  const zoomIn = document.getElementById('zoom-in');
  const zoomOut = document.getElementById('zoom-out');
  const zoomFit = document.getElementById('zoom-fit');

  let scale = 1, dragging = false, dragStart = {x:0,y:0}, translate = {x:0,y:0}, fitMode = true;

  function apply() {
    modalImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
  }

  function fitToScreen() {
    const w = inner.clientWidth, h = inner.clientHeight;
    const ratio = Math.min(w / modalImg.naturalWidth, h / modalImg.naturalHeight, 1);
    scale = ratio; translate = {x:0,y:0}; fitMode = true; apply();
  }

  function openModal(src) {
    modal.classList.add("open");
    modalImg.src = src;
    document.body.style.overflow = "hidden";
    modalImg.onload = () => fitToScreen();
  }
  window.openModal = openModal;

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  zoomIn.addEventListener("click", () => { scale *= 1.2; fitMode=false; apply(); });
  zoomOut.addEventListener("click", () => { scale /= 1.2; fitMode=false; apply(); });
  zoomFit.addEventListener("click", () => fitToScreen());

  modalImg.addEventListener("pointerdown", e => {
    if (fitMode) return;
    dragging = true; dragStart = {x:e.clientX,y:e.clientY};
    modalImg.setPointerCapture(e.pointerId);
    modalImg.classList.add("grabbing");
  });
  modalImg.addEventListener("pointermove", e => {
    if (!dragging) return;
    translate.x += e.clientX - dragStart.x;
    translate.y += e.clientY - dragStart.y;
    dragStart = {x:e.clientX,y:e.clientY};
    apply();
  });
  modalImg.addEventListener("pointerup", e => {
    dragging = false; modalImg.classList.remove("grabbing");
  });

  inner.addEventListener("dblclick", () => {
    if (fitMode) { scale = 1; translate = {x:0,y:0}; fitMode=false; apply(); }
    else fitToScreen();
  });
})();
