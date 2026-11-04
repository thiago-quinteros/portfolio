/**
 * Preloader Futurista - Escáner de Glitch Cyber Neón
 * Thiago Quinteros Portfolio
 * Animación fluida de 2 segundos garantizada tanto en sesión con caché como en incógnito.
 */

export function initPreloader(onComplete) {
  const preloader = document.getElementById('cyber-preloader');
  if (!preloader) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  const SESSION_KEY = 'cyber_preloader_seen';

  // Si ya se vio en esta sesión (o al recargar con F5), saltarlo al instante y mostrar la página directamente
  if (sessionStorage.getItem(SESSION_KEY)) {
    preloader.style.display = 'none';
    preloader.remove();
    document.documentElement.classList.remove('preloader-lock');
    document.body.classList.remove('preloader-lock');
    document.documentElement.classList.add('preloader-done');
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // Respetar preferencias de accesibilidad para movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    preloader.style.display = 'none';
    preloader.remove();
    document.documentElement.classList.remove('preloader-lock');
    document.body.classList.remove('preloader-lock');
    document.documentElement.classList.add('preloader-done');
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // Bloquear el scroll y aplicar efecto Blur al contenido de la página durante el preloader
  document.documentElement.classList.add('preloader-lock');
  document.body.classList.add('preloader-lock');

  // Buffer optimizado para el arranque del SVG y hardware acceleration
  requestAnimationFrame(() => {
    preloader.classList.add('preloader-active');
  });

  // Duración óptima del nuevo preloader Synthwave:
  // 2.6s para mostrar la ambientación completa, la barra neón y la transición suave hacia la web
  const TOTAL_PRELOADER_DURATION = 2600;
  const FADE_DURATION = 600;

  setTimeout(() => {
    // Desvanecer preloader suavemente hasta 0% de opacidad
    preloader.classList.add('fade-out');
    sessionStorage.setItem(SESSION_KEY, 'true');

    // Liberar el scroll y retirar el blur suavemente
    document.documentElement.classList.remove('preloader-lock');
    document.body.classList.remove('preloader-lock');
    document.documentElement.classList.add('preloader-done');

    if (typeof onComplete === 'function') {
      onComplete();
    }

    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.remove();
    }, FADE_DURATION);
  }, TOTAL_PRELOADER_DURATION);
}
