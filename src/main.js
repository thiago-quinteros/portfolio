import './style.css';
import { initBackgroundAnimation } from './background.js';
import { initPreloader } from './preloader.js';

// Función activa para bloquear y eliminar cualquier elemento inyectado por extensiones de IA (Sider, etc.)
function removeAIExtensionWidgets() {
  const siderSelectors = [
    '#sider-container',
    '#sider-sidebar',
    '#sider-root',
    '#sider-assistant',
    'sider-sidebar',
    'sider-app',
    '[data-sider]',
    '[id*="sider"]',
    '[class*="sider"]',
    '#chatgpt-sidebar',
    '#ch-sidebar',
    '[id^="ch-plugin-"]',
    'div[style*="z-index: 2147483647"]',
    'div[style*="z-index: 9999999"]'
  ];

  function purge() {
    siderSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // Asegurarse de no tocar elementos legítimos de nuestra app
        if (!el.closest('#cyber-preloader') && !el.closest('.portfolio-container')) {
          el.remove();
        }
      });
    });
  }

  purge();
  // Monitorear inserciones dinámicas de extensiones
  const observer = new MutationObserver(() => {
    purge();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

removeAIExtensionWidgets();
function initHudToggle() {
  const toggleBtn = document.getElementById('hud-toggle');
  if (!toggleBtn) return;

  const iconEye = toggleBtn.querySelector('.icon-eye');
  const iconEyeOff = toggleBtn.querySelector('.icon-eye-off');
  const label = toggleBtn.querySelector('.hud-toggle-label');

  toggleBtn.addEventListener('click', () => {
    const isHidden = document.body.classList.toggle('hud-hidden');
    
    if (isHidden) {
      if (iconEye) iconEye.style.display = 'none';
      if (iconEyeOff) iconEyeOff.style.display = 'block';
      if (label) label.textContent = 'Mostrar HUD';
      toggleBtn.setAttribute('title', 'Mostrar interfaz del portfolio');
    } else {
      if (iconEye) iconEye.style.display = 'block';
      if (iconEyeOff) iconEyeOff.style.display = 'none';
      if (label) label.textContent = 'Ocultar HUD';
      toggleBtn.setAttribute('title', 'Ocultar interfaz para ver el fondo');
    }
  });
}

// Inicializar preloader de forma aislada y arrancar el fondo Canvas cuando esté finalizando
// para que el preloader no compita por CPU/GPU ni sufra caídas de rendimiento por caché
initPreloader(() => {
  initBackgroundAnimation();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHudToggle);
} else {
  initHudToggle();
}
