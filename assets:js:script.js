{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Mobile menu toggle + A11y\
const btn = document.getElementById('mobile-menu-button');\
const menu = document.getElementById('mobile-menu');\
\
if (btn && menu) \{\
  btn.addEventListener('click', () => \{\
    const expanded = btn.getAttribute('aria-expanded') === 'true';\
    btn.setAttribute('aria-expanded', String(!expanded));\
    menu.classList.toggle('hidden');\
  \});\
\}\
}

// ===== Fondo dinámico reactivo al scroll =====
(function () {
  const root = document.documentElement;
  const bgEl = document.querySelector('.dynamic-bg');
  if (!bgEl) return;

  // Throttle sencillo para no saturar el hilo de render
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = doc.scrollHeight - doc.clientHeight || 1;
      const p = Math.min(1, Math.max(0, scrollTop / scrollHeight)); // 0→1

      // Aparece progresivamente entre 0% y 35% del scroll
      const appear = Math.min(1, p / 0.35);

      // Movimiento sutil: rotación y desplazamiento
      const rot = (p * 120).toFixed(2) + 'deg'; // hasta ~120º
      const shift = (p * 20).toFixed(2) + '%';  // desplaza focos

      root.style.setProperty('--scroll-p', p.toFixed(4));
      root.style.setProperty('--bg-opacity', appear.toFixed(3));
      root.style.setProperty('--rot', rot);
      root.style.setProperty('--shift', shift);
      ticking = false;
    });
  };

  // Prefiere menos movimiento => solo aparece sin desplazarse
  const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyReduced = () => {
    if (mediaReduce.matches) {
      root.style.setProperty('--rot', '0deg');
      root.style.setProperty('--shift', '0%');
    }
  };
  mediaReduce.addEventListener?.('change', applyReduced);
  applyReduced();

  // Inicializa en carga y escucha scroll
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
