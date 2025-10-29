document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();

  }

}, { passive: false });

document.addEventListener('gesturestart', (e) => {
  e.preventDefault();

}, { passive: false });

document.addEventListener('dblclick', (e) => {
  e.preventDefault();

}, { passive: false });