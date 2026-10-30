/**
 * Portfolio Thiago Quinteros - Cyber Wave Canvas Animation
 * Fondo optimizado para alto rendimiento y bajo consumo de batería en PC y Android.
 * Movimiento continuo y dinámico con perspectiva infinita.
 */

export function initBackgroundAnimation() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrameId = null;
  let isRunning = false;
  let lastTime = 0;

  // Detección de preferencia de movimiento reducido (Accesibilidad & Ahorro de recursos)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ajuste de densidad de píxeles (Clamp para cuidar batería en móviles con pantallas de alta resolución)
  function updateDimensions() {
    width = window.innerWidth;
    height = window.innerHeight;

    const isMobile = width < 768;
    const maxDpr = isMobile ? 1 : 1.25;
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (prefersReducedMotion) {
      renderStaticFrame();
    }
  }

  // --- Esferas Violetas Flotantes (Burbujas Neón de la imagen de referencia) ---
  const orbs = [
    {
      x: 0.18,
      y: 0.82,
      baseRadius: 170,
      vx: 0.00014,
      vy: -0.00010,
      glowColor: '#a855f7',
      ringColor: '#c084fc',
      pulseSpeed: 0.0018,
      pulsePhase: 0
    },
    {
      x: 0.82,
      y: 0.35,
      baseRadius: 130,
      vx: -0.00011,
      vy: 0.00012,
      glowColor: '#7928ca',
      ringColor: '#d8b4fe',
      pulseSpeed: 0.0022,
      pulsePhase: 2.1
    },
    {
      x: 0.72,
      y: 0.88,
      baseRadius: 210,
      vx: 0.00008,
      vy: -0.00009,
      glowColor: '#9333ea',
      ringColor: '#c084fc',
      pulseSpeed: 0.0015,
      pulsePhase: 4.2
    },
    {
      x: 0.35,
      y: 0.22,
      baseRadius: 85,
      vx: 0.00010,
      vy: 0.00008,
      glowColor: '#6b21a8',
      ringColor: '#a855f7',
      pulseSpeed: 0.0024,
      pulsePhase: 1.2
    }
  ];

  function drawOrb(orb, time) {
    const cx = orb.x * width;
    const cy = orb.y * height;
    const pulse = Math.sin(time * orb.pulseSpeed + orb.pulsePhase) * 0.06;
    const radius = Math.max(40, orb.baseRadius * (1 + pulse) * (width < 640 ? 0.65 : 1));

    // 1. Resplandor exterior suave
    const outerGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.4);
    outerGrad.addColorStop(0, 'rgba(121, 40, 202, 0.16)');
    outerGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.06)');
    outerGrad.addColorStop(1, 'rgba(5, 2, 10, 0)');

    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cuerpo translúcido de la esfera
    const bodyGrad = ctx.createRadialGradient(
      cx - radius * 0.25,
      cy - radius * 0.25,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    bodyGrad.addColorStop(0, 'rgba(192, 132, 252, 0.15)');
    bodyGrad.addColorStop(0.5, 'rgba(121, 40, 202, 0.12)');
    bodyGrad.addColorStop(0.85, 'rgba(59, 7, 100, 0.25)');
    bodyGrad.addColorStop(1, 'rgba(10, 3, 20, 0.45)');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Aro perimetral luminoso (Borde de cristal neón)
    ctx.strokeStyle = orb.ringColor;
    ctx.lineWidth = width < 640 ? 1.5 : 2;
    ctx.globalAlpha = 0.55 + pulse * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 4. Borde brillante de luna creciente / reflejo luminoso
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = width < 640 ? 2 : 2.8;
    ctx.globalAlpha = 0.75 + pulse;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI * 0.65, Math.PI * 0.15);
    ctx.stroke();
    ctx.restore();
  }

  // --- Cuadrícula Cyber Wave Dinámica, con Mayor Desplazamiento y Alto Rendimiento ---
  function drawWaveGrid(time) {
    const isMobile = width < 640;
    const numHorizontal = isMobile ? 12 : 18;
    const numVertical = isMobile ? 14 : 24;

    // Velocidades calibradas: movimiento ágil, visible y continuo (sin bucles estáticos de 6s)
    const flowSpeed = 0.00045; // Desplazamiento de avance continuo hacia el usuario
    const waveSpeed = 0.0024;  // Ondulación ágil de las líneas (3x más rápida que antes)
    const lateralSpeed = 0.0016;

    // Desfase continuo infinito para avance cinético
    const continuousFlow = (time * flowSpeed) % 1.0;
    const horizonY = height * 0.44;
    const maxTravelHeight = height * 0.62;

    ctx.lineWidth = 1;

    // 1. LÍNEAS HORIZONTALES: Avance continuo en perspectiva con amplio rango de ondulación
    for (let i = 0; i <= numHorizontal; i++) {
      const cycleProgress = ((i / numHorizontal) + continuousFlow) % 1.0;
      
      // Progresión de perspectiva exponencial
      const yOffset = Math.pow(cycleProgress, 1.75) * maxTravelHeight;
      const y = horizonY + yOffset;

      // Opacidad con desvanecimiento en bordes para que entren y salgan suavemente
      const fadeAlpha = Math.sin(cycleProgress * Math.PI);
      const alpha = Math.min(0.36, fadeAlpha * 0.42);

      if (alpha <= 0.01) continue;

      ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;

      ctx.beginPath();
      // Mayor distancia de ondulación (de 30px en el horizonte a 85px en primer plano)
      const waveAmplitude = 25 + cycleProgress * 65;
      const wave = Math.sin(time * waveSpeed + cycleProgress * 4.2) * waveAmplitude;
      const lateralShift = Math.cos(time * lateralSpeed + cycleProgress * 3) * (15 + cycleProgress * 25);

      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(
        width * 0.5 + lateralShift, 
        y + wave, 
        width, 
        y
      );
      ctx.stroke();
    }

    // 2. LÍNEAS VERTICALES: Convergencia con balanceo cinético dinámico
    const centerX = width * 0.5;
    const globalSway = Math.sin(time * lateralSpeed) * (width * 0.04);

    for (let i = 0; i <= numVertical; i++) {
      const progress = (i / numVertical) - 0.5; // De -0.5 a 0.5
      const absProgress = Math.abs(progress);
      
      const alpha = Math.max(0.04, 0.26 - absProgress * 0.2);
      ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;

      // Ondulación lateral orgánica para cada línea
      const lineWave = Math.sin(time * waveSpeed * 0.8 + progress * 5) * (12 + (1 - absProgress) * 20);

      const topX = centerX + progress * (width * 0.42) + (globalSway * 0.4);
      const bottomX = centerX + progress * (width * 1.45) + globalSway + lineWave;

      ctx.beginPath();
      ctx.moveTo(topX, horizonY);
      ctx.quadraticCurveTo(
        centerX + progress * (width * 0.88) + lineWave,
        height * 0.72,
        bottomX,
        height
      );
      ctx.stroke();
    }

    // 3. CÚPULA SUPERIOR: Líneas de techo cósmico inspiradas en el template de referencia
    const numDome = isMobile ? 6 : 9;
    for (let j = 1; j <= numDome; j++) {
      const progress = j / numDome;
      const domeY = horizonY - (Math.pow(progress, 1.45) * (horizonY * 0.88));
      const domeAlpha = Math.min(0.2, progress * 0.24);
      
      ctx.strokeStyle = `rgba(168, 85, 247, ${domeAlpha})`;
      const domeWave = Math.sin(time * waveSpeed * 0.9 + progress * 3) * (15 + progress * 25);

      ctx.beginPath();
      ctx.moveTo(0, domeY);
      ctx.quadraticCurveTo(width * 0.5, domeY - domeWave, width, domeY);
      ctx.stroke();
    }
  }

  function drawBackground() {
    ctx.fillStyle = '#05020a';
    ctx.fillRect(0, 0, width, height);

    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.1,
      width * 0.5,
      height * 0.5,
      width * 0.8
    );
    bgGrad.addColorStop(0, 'rgba(46, 12, 82, 0.45)');
    bgGrad.addColorStop(0.5, 'rgba(18, 6, 36, 0.6)');
    bgGrad.addColorStop(1, 'rgba(5, 2, 10, 0.95)');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  function animate(timestamp) {
    if (!isRunning) return;

    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    orbs.forEach(orb => {
      orb.x += orb.vx * delta;
      orb.y += orb.vy * delta;

      if (orb.x < -0.1) orb.x = 1.1;
      if (orb.x > 1.1) orb.x = -0.1;
      if (orb.y < -0.1) orb.y = 1.1;
      if (orb.y > 1.1) orb.y = -0.1;
    });

    drawBackground();
    drawWaveGrid(timestamp);
    orbs.forEach(orb => drawOrb(orb, timestamp));

    animationFrameId = requestAnimationFrame(animate);
  }

  function renderStaticFrame() {
    drawBackground();
    drawWaveGrid(1000);
    orbs.forEach(orb => drawOrb(orb, 1000));
  }

  function startLoop() {
    if (!isRunning && !prefersReducedMotion) {
      isRunning = true;
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  function stopLoop() {
    if (isRunning) {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateDimensions();
    }, 150);
  }, { passive: true });

  updateDimensions();
  startLoop();
}
