// Navbar toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});

// Modal image viewer
(function () {
  const modal = document.getElementById('modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalInner = document.getElementById('modal-inner');

  const btnZoomIn = document.getElementById('zoom-in');
  const btnZoomOut = document.getElementById('zoom-out');
  const btnZoomFit = document.getElementById('zoom-fit');

  let scale = 1;
  let isOpen = false;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let translate = { x: 0, y: 0 };
  let natural = { w: 0, h: 0 };
  let fitMode = true;

  function applyTransform() {
    modalImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    translate = { x: 0, y: 0 };
    modalImg.classList.remove('grabbing');
    applyTransform();
  }

  function fitToScreen() {
    const containerW = modalInner.clientWidth;
    const containerH = modalInner.clientHeight;
    if (!natural.w || !natural.h) return;
    const ratio = Math.min(containerW / natural.w, containerH / natural.h, 1);
    scale = ratio;
    translate = { x: 0, y: 0 };
    applyTransform();
    fitMode = true;
  }

  function showNatural() {
    scale = 1;
    translate = { x: 0, y: 0 };
    applyTransform();
    fitMode = false;
  }

  function toggleFitOriginal() {
    if (fitMode) showNatural();
    else fitToScreen();
  }

  function zoomBy(factor) {
    const prevScale = scale;
    let next = scale * factor;
    next = Math.max(0.5, Math.min(5, next));
    const cx = modalInner.clientWidth / 2;
    const cy = modalInner.clientHeight / 2;
    translate.x = (translate.x - cx) * (next / prevScale) + cx;
    translate.y = (translate.y - cy) * (next / prevScale) + cy;
    scale = next;
    fitMode = false;
    applyTransform();
  }

  window.openModal = function (src) {
    modalImg.src = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    isOpen = true;
    document.body.style.overflow = 'hidden';
    resetTransform();

    modalImg.onload = () => {
      natural.w = modalImg.naturalWidth;
      natural.h = modalImg.naturalHeight;
      const containerW = modalInner.clientWidth;
      const containerH = modalInner.clientHeight;
      if (natural.w <= containerW && natural.h <= containerH) {
        showNatural();
      } else {
        fitToScreen();
      }
    };
  };

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    isOpen = false;
    document.body.style.overflow = '';
    resetTransform();
  }

  modalClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });
  modalBackdrop.addEventListener('click', closeModal);
  document.querySelector('.modal-window').addEventListener('click', (e) => e.stopPropagation());

  btnZoomIn.addEventListener('click', () => zoomBy(1.25));
  btnZoomOut.addEventListener('click', () => zoomBy(1 / 1.25));
  btnZoomFit.addEventListener('click', toggleFitOriginal);

  modalInner.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomBy(e.deltaY > 0 ? 1 / 1.12 : 1.12);
  }, { passive: false });

  modalInner.addEventListener('dblclick', toggleFitOriginal);

  modalImg.addEventListener('pointerdown', (e) => {
    if (scale <= 1 && fitMode) return;
    isDragging = true;
    modalImg.setPointerCapture(e.pointerId);
    dragStart = { x: e.clientX, y: e.clientY };
    modalImg.classList.add('grabbing');
  });

  modalImg.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    dragStart = { x: e.clientX, y: e.clientY };
    translate.x += dx;
    translate.y += dy;
    applyTransform();
  });

  modalImg.addEventListener('pointerup', (e) => {
    isDragging = false;
    modalImg.releasePointerCapture(e.pointerId);
    modalImg.classList.remove('grabbing');
  });

  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === '+' || e.key === '=') zoomBy(1.25);
    if (e.key === '-') zoomBy(1 / 1.25);
    if (e.key.toLowerCase() === 'f') toggleFitOriginal();
  });

  window.addEventListener('resize', () => {
    if (!isOpen) return;
    if (fitMode) fitToScreen();
  });
})();
