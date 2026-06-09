// ===== STARS CANVAS =====
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 4000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.4 + 0.1,
      dir: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed * s.dir * 0.005;
    if (s.alpha >= 0.7 || s.alpha <= 0.05) s.dir *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,240,${s.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();

// ===== BOKEH =====
function createBokeh() {
  const container = document.getElementById('bokeh');
  const colors = ['#c8a96b','#e8d4a0','#ffffff','#a0b4c8'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'bokeh-blob';
    const size = Math.random() * 180 + 80;
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*8+6}s;
      animation-delay:-${Math.random()*8}s;
    `;
    container.appendChild(el);
  }
}
createBokeh();

// ===== NAVIGATION =====
let current = 0;
const screens = document.querySelectorAll('.screen');

function goTo(index) {
  screens[current].classList.remove('active');
  current = index;
  screens[current].classList.add('active');

  if (index === 2) startCountdown();
  if (index === 8) startFireworks();
  else stopFireworks();
}

// ===== SCREEN 0: LETRA INICIAL → auto avanza =====
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('letterV').classList.add('show');
    document.getElementById('lineExpand').classList.add('show');
  }, 400);
  setTimeout(() => goTo(1), 3200);
});

// Tap en screen 1 → countdown
document.getElementById('screen-1').addEventListener('click', () => goTo(2));

// ===== COUNTDOWN =====
function startCountdown() {
  const numEl = document.getElementById('countNum');
  const ring = document.getElementById('ringProgress');
  const circumference = 339.3;
  let count = 3;
  ring.style.strokeDashoffset = 0;

  const tick = () => {
    numEl.textContent = count;
    ring.style.strokeDashoffset = circumference * (1 - count / 3);
    if (count === 0) {
      setTimeout(() => goTo(3), 600);
      return;
    }
    count--;
    setTimeout(tick, 1000);
  };
  tick();
}

// ===== REPLAY =====
function replay() {
  goTo(0);
  setTimeout(() => {
    document.getElementById('letterV').classList.remove('show');
    document.getElementById('lineExpand').classList.remove('show');
    setTimeout(() => {
      document.getElementById('letterV').classList.add('show');
      document.getElementById('lineExpand').classList.add('show');
    }, 300);
    setTimeout(() => goTo(1), 3200);
  }, 100);
}

// ===== CARRUSEL: fotos grandes + mensajes con flechas =====
const gallerySlides = [
  {
    src: "img/Foto4.jpg",
    msg: "Tu sonrisa fue de las primeras cosas que me gustaron de ti. Tiene algo que tranquiliza, que hace sentir que todo va a estar bien. No la pierdas nunca, porque ilumina más de lo que crees."
  },
  {
    src: "img/foto1.jpg",
    msg: "Me gusta que seas tú, sin fingir, sin pretender ser otra. Esa forma tuya de ser real es de las cosas que más admiro, y de las más difíciles de encontrar."
  },
  {
    src: "img/Foto5.jpg",
    msg: "Hay días en los que con solo hablar contigo todo pesa un poco menos. No sé si lo sabes, pero tu compañía se volvió uno de mis lugares favoritos."
  },
  {
    src: "img/Foto3.jpg",
    msg: "Desde el primer día algo en ti llamó mi atención, y con el tiempo entendí por qué: eres especial de una forma que no se explica, solo se siente."
  }
];

let lbIndex = 0;
let lbSeenLast = false;

function pad(n) { return String(n).padStart(2, "0"); }

function renderSlide() {
  const slide = gallerySlides[lbIndex];
  document.getElementById("lightbox-img").src = slide.src;
  document.getElementById("lightbox-msg").textContent = slide.msg;
  document.getElementById("lbCounter").textContent = pad(lbIndex + 1) + " / " + pad(gallerySlides.length);

  // Flechas: deshabilitar en los extremos
  document.getElementById("lbPrev").classList.toggle("disabled", lbIndex === 0);
  document.getElementById("lbNext").classList.toggle("disabled", lbIndex === gallerySlides.length - 1);

  // Cuando llega a la ultima, el boton continuar se resalta
  if (lbIndex === gallerySlides.length - 1) lbSeenLast = true;
  document.getElementById("lbContinue").classList.toggle("ready", lbSeenLast);

  // Puntos
  const dots = document.getElementById("lbDots");
  dots.innerHTML = "";
  gallerySlides.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "lb-dot" + (i === lbIndex ? " active" : "");
    d.onclick = (e) => { e.stopPropagation(); lbIndex = i; renderSlide(); };
    dots.appendChild(d);
  });
}

function openLightbox(i) {
  lbIndex = i || 0;
  renderSlide();
  document.getElementById("lightbox").classList.add("open");
}

function lbNext(event) {
  if (event) event.stopPropagation();
  if (lbIndex < gallerySlides.length - 1) { lbIndex++; renderSlide(); }
}

function lbPrev(event) {
  if (event) event.stopPropagation();
  if (lbIndex > 0) { lbIndex--; renderSlide(); }
}

// Boton CONTINUAR -> cierra el carrusel y va al mensaje final
function lbContinue(event) {
  if (event) event.stopPropagation();
  closeLightbox();
  goTo(7);
}

function closeLightbox(event) {
  if (event && event.target.closest(".lightbox-content")) return;
  if (event && event.target.closest(".lb-continue")) return;
  document.getElementById("lightbox").classList.remove("open");
}

// Teclado
document.addEventListener("keydown", (e) => {
  const box = document.getElementById("lightbox");
  if (!box.classList.contains("open")) return;
  if (e.key === "Escape") box.classList.remove("open");
  if (e.key === "ArrowRight") lbNext();
  if (e.key === "ArrowLeft") lbPrev();
});

// ===== FINAL: corazón rosa de partículas + fuegos rojos =====
let fwCtx, fwCanvas, fwParticles = [], heartParticles = [], fwRunning = false, fwTimer = null, heartStart = 0;

function fwResize() {
  if (!fwCanvas) return;
  fwCanvas.width = fwCanvas.offsetWidth;
  fwCanvas.height = fwCanvas.offsetHeight;
  buildHeart();
}

// Construir el corazón con la ecuación paramétrica clásica
function buildHeart() {
  heartParticles = [];
  if (!fwCanvas) return;
  const cx = fwCanvas.width / 2;
  const cy = fwCanvas.height / 2;
  const scale = Math.min(fwCanvas.width, fwCanvas.height) / 34;
  const pinks = ["#ff5fa2", "#ff8ec2", "#ff6fb5", "#ffa6d4", "#ff7ab8", "#ffffff"];
  // densidad segun el area, con limites
  let count = Math.floor((fwCanvas.width * fwCanvas.height) / 700);
  count = Math.min(Math.max(count, 1400), 2800);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    // dispersion para el efecto "polvo brillante"
    const jx = (Math.random() - 0.5) * 1.8;
    const jy = (Math.random() - 0.5) * 1.8;
    heartParticles.push({
      bx: cx + (hx + jx) * scale,
      by: cy - (hy + jy) * scale,
      size: 0.7 + Math.random() * 1.6,
      color: pinks[Math.floor(Math.random() * pinks.length)],
      phase: Math.random() * Math.PI * 2,
      tw: 0.015 + Math.random() * 0.035,   // velocidad de titileo
      dx: (Math.random() - 0.5) * 0.3,      // leve deriva
      dy: (Math.random() - 0.5) * 0.3
    });
  }
}

function launchFirework() {
  if (!fwCanvas) return;
  const x = fwCanvas.width * (0.15 + Math.random() * 0.7);
  const y = fwCanvas.height * (0.12 + Math.random() * 0.35);
  const count = 55 + Math.floor(Math.random() * 40);
  const reds = ["#ff3b3b", "#ff5252", "#e02424", "#ff6b6b", "#c81e1e", "#ff8585"];
  const color = reds[Math.floor(Math.random() * reds.length)];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1.5 + Math.random() * 4;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      color,
      size: 1.5 + Math.random() * 1.5
    });
  }
}

function fwLoop() {
  if (!fwRunning) return;

  // Desvanecer dejando estela, manteniendo el lienzo transparente (sin caja oscura)
  fwCtx.globalCompositeOperation = "destination-out";
  fwCtx.fillStyle = "rgba(0,0,0,0.20)";
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwCtx.globalCompositeOperation = "lighter";

  // Corazón rosa: aparece DESPUÉS de un retraso y entra suave (fade-in)
  const now = Date.now();
  let heartAlpha = 0;
  if (heartStart && now >= heartStart) {
    heartAlpha = Math.min((now - heartStart) / 1800, 1); // entra en ~1.8s
  }

  if (heartAlpha > 0) {
    const time = now / 1000;
    const bob = Math.sin(time * 0.8) * 4; // flotar suave de todo el corazón
    heartParticles.forEach((p) => {
      p.phase += p.tw;
      const tw = 0.30 + 0.50 * (0.5 + 0.5 * Math.sin(p.phase)); // titileo
      const px = p.bx + Math.sin(p.phase) * p.dx;
      const py = p.by + bob + Math.cos(p.phase) * p.dy;
      fwCtx.globalAlpha = tw * heartAlpha;
      fwCtx.beginPath();
      fwCtx.arc(px, py, p.size, 0, Math.PI * 2);
      fwCtx.fillStyle = p.color;
      fwCtx.fill();
    });
  }

  // Fuegos rojos
  fwParticles.forEach((p) => {
    p.vy += 0.03;
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    fwCtx.globalAlpha = Math.max(p.life, 0);
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fillStyle = p.color;
    fwCtx.fill();
  });
  fwParticles = fwParticles.filter((p) => p.life > 0);

  fwCtx.globalAlpha = 1;
  requestAnimationFrame(fwLoop);
}

let stageTimer = null;

function startFireworks() {
  fwCanvas = document.getElementById("fireworks");
  if (!fwCanvas) return;
  fwCtx = fwCanvas.getContext("2d");
  fwResize();
  fwParticles = [];
  fwRunning = true;
  heartStart = 0;              // el corazon NO aparece todavia
  fwLoop();
  launchFirework();
  if (fwTimer) clearInterval(fwTimer);
  fwTimer = setInterval(launchFirework, 1000);

  // Etapa A: mostrar "Feliz Cumpleaños"
  const a = document.getElementById("stageA");
  const b = document.getElementById("stageB");
  b.classList.remove("show");
  a.classList.add("show");

  // Despues de 4.5s: desvanecer texto y aparecer corazon + boton
  if (stageTimer) clearTimeout(stageTimer);
  stageTimer = setTimeout(() => {
    a.classList.remove("show");          // se desvanece "Feliz Cumpleaños"
    setTimeout(() => {
      heartStart = Date.now();           // empieza a aparecer el corazon
      b.classList.add("show");           // aparece el boton "Ver de nuevo"
    }, 900);
  }, 4500);
}

function stopFireworks() {
  fwRunning = false;
  if (fwTimer) { clearInterval(fwTimer); fwTimer = null; }
  if (stageTimer) { clearTimeout(stageTimer); stageTimer = null; }
  heartStart = 0;
  const a = document.getElementById("stageA");
  const b = document.getElementById("stageB");
  if (a) a.classList.remove("show");
  if (b) b.classList.remove("show");
}

window.addEventListener("resize", () => { if (fwRunning) fwResize(); });