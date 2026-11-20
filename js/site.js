/* Comportamiento compartido y de la portada. El contenido vive en data/proyectos.js. */
(() => {
  const SITIO = window.SITIO || {};
  const PROYECTOS = (window.PROYECTOS || []).filter(Boolean);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lleno = (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  const pad = (n) => String(n).padStart(2, '0');
  const ROLES = { portada: 'Portada', 'vista general': 'Vista general', exterior: 'Exterior', interior: 'Interior', detalle: 'Detalle', plano: 'Plano' };
  const portadaDe = (p) => (p.imagenes || []).find((i) => i.rol === 'portada') || (p.imagenes || [])[0] || null;
  const hoja = (rol) => `<div class="sheet" role="img" aria-label="Imagen pendiente de entrega"><b>Imagen por publicar</b><span>${esc(ROLES[rol] || 'Portada')}</span></div>`;
  const imgTag = (im, { prioridad = false, cls = '' } = {}) => {
    const w = im.ancho || 1600, h = im.alto || 1000;
    return `<img ${cls ? `class="${cls}" ` : ''}src="${esc(im.src)}"${im.srcset ? ` srcset="${esc(im.srcset)}" sizes="${esc(im.sizes || '100vw')}"` : ''} width="${w}" height="${h}" alt="${esc(im.alt || '')}" decoding="async"${prioridad ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
  };

  window.ARQ = { esc, lleno, pad, ROLES, portadaDe, hoja, imgTag, reduce, finePointer };

  /* ---------- Menú móvil ---------- */
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  if (nav && toggle) {
    const set = (open) => { nav.toggleAttribute('data-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Cerrar' : 'Menú'; };
    toggle.addEventListener('click', () => set(!nav.hasAttribute('data-open')));
    nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.hasAttribute('data-open')) { set(false); toggle.focus(); } });
  }

  /* ---------- La barra se vuelve tinta sobre las secciones oscuras ---------- */
  if (nav) {
    const oscuras = [...document.querySelectorAll('[data-dark]')];
    let raf = 0;
    const tono = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = nav.offsetHeight / 2;
        const sobre = oscuras.some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
        nav.classList.toggle('nav--dark', sobre);
      });
    };
    addEventListener('scroll', tono, { passive: true });
    addEventListener('resize', tono);
    tono();
  }

  /* ---------- Inclinación discreta en profundidad (solo puntero fino, nunca con movimiento reducido) ---------- */
  window.ARQ.tilt = (el, { target = el, max = 5, onMove, onLeave } = {}) => {
    if (!el || el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      if (reduce.matches || !finePointer.matches || e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.classList.add('is-tilting');
        target.style.setProperty('--rx', ((0.5 - y) * max).toFixed(2) + 'deg');
        target.style.setProperty('--ry', ((x - 0.5) * max).toFixed(2) + 'deg');
        onMove && onMove(x, y);
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      target.classList.remove('is-tilting');
      target.style.setProperty('--rx', '0deg');
      target.style.setProperty('--ry', '0deg');
      onLeave && onLeave();
    });
  };
  document.querySelectorAll('[data-tilt]').forEach((el) => window.ARQ.tilt(el));

  /* ---------- Monograma en capas: el puntero en toda la portada lo gira; el scroll separa las capas ---------- */
  const heroEl = document.querySelector('[data-hero]'), plate = document.querySelector('[data-plate]');
  if (heroEl && plate) {
    let hover = 1, scroll = 0, raf = 0;
    const sync = () => { plate.style.setProperty('--sep', Math.max(hover, 1 + scroll * 2.6).toFixed(3)); plate.style.setProperty('--scroll', scroll.toFixed(3)); };
    window.ARQ.tilt(heroEl, {
      target: plate, max: 10,
      onMove: (x, y) => { hover = 1 + 1.4 * Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2 + 0.35); sync(); },
      onLeave: () => { hover = 1; sync(); }
    });
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (reduce.matches) { scroll = 0; sync(); return; }
        scroll = Math.min(1, Math.max(0, scrollY / Math.max(1, heroEl.offsetHeight * 0.9)));
        sync();
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Portada: foto protagonista cuando exista ---------- */
  const slot = document.querySelector('[data-slot="portada"]');
  if (slot && SITIO.portada && SITIO.portada.src) {
    const im = new Image();
    im.src = SITIO.portada.src;
    im.alt = SITIO.portada.alt || '';
    im.width = SITIO.portada.ancho || 2400; im.height = SITIO.portada.alto || 1600;
    im.fetchPriority = 'high';
    im.addEventListener('error', () => { im.remove(); slot.removeAttribute('data-has-photo'); }, { once: true });
    slot.prepend(im);
    slot.setAttribute('data-has-photo', '');
    const cap = slot.querySelector('figcaption');
    if (cap) { if (SITIO.portada.pie) cap.textContent = SITIO.portada.pie; else cap.remove(); }
  }

  /* ---------- Estudio, alcances, correo y redes ---------- */
  const studio = document.querySelector('[data-studio]');
  if (studio && lleno(SITIO.estudio)) studio.innerHTML = SITIO.estudio.map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${esc(p)}</p>`).join('') + (SITIO.firma ? `<p class="studio__sign">${esc(SITIO.firma)}</p>` : '');
  const scope = document.querySelector('[data-scope]');
  if (scope && lleno(SITIO.alcances)) scope.innerHTML = SITIO.alcances.map((a) => `<li>${esc(a)}</li>`).join('');
  const extra = document.querySelector('[data-contact-extra]');
  if (extra) {
    const links = [];
    if (SITIO.correo) links.push(`<a href="mailto:${esc(SITIO.correo)}">${esc(SITIO.correo)}</a>`);
    (SITIO.redes || []).forEach((r) => { if (r && r.url) links.push(`<a href="${esc(r.url)}" rel="me noopener" target="_blank">${esc(r.nombre || r.url)}</a>`); });
    extra.innerHTML = links.join('');
  }

  /* ---------- Carrusel de proyectos y filtros ---------- */
  const list = document.querySelector('[data-index]');
  if (!list) return;
  const filtersEl = document.querySelector('[data-filters]');
  const status = document.querySelector('[data-filter-status]');
  const railNav = document.querySelector('[data-rail-nav]');
  const prev = document.querySelector('[data-rail-prev]'), next = document.querySelector('[data-rail-next]');

  list.innerHTML = PROYECTOS.map((p, i) => {
    const meta = p.pendiente ? 'Por publicar' : [p.tipo, p.ubicacion].filter(lleno).join(', ');
    const cov = portadaDe(p);
    return `<li data-reveal style="--i:${i}" data-slug="${esc(p.slug)}"${p.pendiente ? ' class="is-pending"' : ''}>
      <a class="card" href="proyecto.html?p=${encodeURIComponent(p.slug)}">
        <figure class="card__img" data-slot="tarjeta-${esc(p.slug)}" data-alt="Portada del proyecto, vertical 4:5">${cov ? imgTag(cov) : hoja('portada')}</figure>
        <span class="card__meta">
          <span class="card__num">${pad(i + 1)}</span>
          <span class="card__name">${esc(p.nombre || 'Proyecto sin nombre')}</span>
          <span class="card__info">${esc(meta)}</span>
          <span class="card__year">${lleno(p.anio) ? esc(p.anio) : ''}</span>
        </span>
      </a></li>`;
  }).join('');
  list.querySelectorAll('.card').forEach((card) => window.ARQ.tilt(card, { target: card.querySelector('.card__img') }));

  // La portada de la tarjeta vuela hacia la página del proyecto (View Transitions entre documentos)
  list.addEventListener('click', (e) => {
    const card = e.target.closest('.card'); if (!card) return;
    card.querySelector('.card__img').style.viewTransitionName = 'cover';
  });
  addEventListener('pageshow', () => { list.querySelectorAll('.card__img').forEach((el) => { el.style.viewTransitionName = ''; }); });

  // Botones, arrastre con ratón y teclado
  const paso = () => { const li = list.querySelector('li[data-slug]:not([hidden])'); return li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || 0) : list.clientWidth * 0.8; };
  const estado = () => {
    const max = list.scrollWidth - list.clientWidth;
    if (railNav) railNav.hidden = max <= 4;
    if (prev) prev.disabled = list.scrollLeft <= 4;
    if (next) next.disabled = list.scrollLeft >= max - 4;
  };
  const mover = (dir) => list.scrollBy({ left: dir * paso(), behavior: reduce.matches ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  list.addEventListener('scroll', () => requestAnimationFrame(estado), { passive: true });
  addEventListener('resize', estado);
  list.addEventListener('keydown', (e) => {
    if (e.target !== list) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  });
  let x0 = null, s0 = 0, movido = false;
  list.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    x0 = e.clientX; s0 = list.scrollLeft; movido = false;
  });
  addEventListener('pointermove', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (!movido && Math.abs(dx) > 6) { movido = true; list.classList.add('is-dragging'); }
    if (movido) list.scrollLeft = s0 - dx;
  });
  addEventListener('pointerup', () => {
    if (x0 === null) return;
    x0 = null;
    if (movido) {
      const quedo = list.scrollLeft;
      list.classList.remove('is-dragging');
      list.scrollLeft = quedo;
      list.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
      setTimeout(() => { movido = false; }, 0);
    }
  });
  list.addEventListener('dragstart', (e) => e.preventDefault());

  // Filtros: solo aparecen si ayudan (cuatro proyectos publicados o más, y al menos dos valores distintos)
  const reales = PROYECTOS.filter((p) => !p.pendiente);
  const FACETAS = [['tipo', 'Tipo'], ['ubicacion', 'Ubicación'], ['anio', 'Año']];
  const activos = {};
  const facetas = reales.length >= 4 ? FACETAS.map(([k, label]) => {
    const vals = [...new Set(reales.map((p) => p[k]).filter(lleno).map(String))].sort((a, b) => (k === 'anio' ? b - a : a.localeCompare(b, 'es')));
    return { k, label, vals };
  }).filter((f) => f.vals.length >= 2) : [];

  const aplicar = () => {
    let n = 0;
    list.querySelectorAll('li[data-slug]').forEach((li) => {
      const p = PROYECTOS.find((x) => x.slug === li.dataset.slug);
      const ok = Object.entries(activos).every(([k, v]) => !v || String(p[k]) === v);
      li.hidden = !ok; if (ok) { n++; li.classList.add('is-in'); }
    });
    let vacio = list.querySelector('[data-empty]');
    if (!n) {
      if (!vacio) { vacio = document.createElement('li'); vacio.className = 'rail__empty'; vacio.dataset.empty = ''; vacio.innerHTML = '<span>Ningún proyecto coincide con esa combinación.</span><button class="btn btn--secondary" type="button" data-clear>Quitar filtros</button>'; list.append(vacio); }
    } else if (vacio) vacio.remove();
    if (status) status.textContent = n === 1 ? '1 proyecto' : `${n} proyectos`;
    list.scrollLeft = 0;
    estado();
  };

  if (filtersEl && facetas.length) {
    filtersEl.innerHTML = facetas.map((f) => `<fieldset><legend>${f.label}</legend><div class="chips">` +
      `<button class="chip" type="button" data-k="${f.k}" data-v="" aria-pressed="true">Todos</button>` +
      f.vals.map((v) => `<button class="chip" type="button" data-k="${f.k}" data-v="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('') +
      `</div></fieldset>`).join('');
    filtersEl.hidden = false;
    filtersEl.addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      activos[b.dataset.k] = b.dataset.v;
      filtersEl.querySelectorAll(`.chip[data-k="${b.dataset.k}"]`).forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      aplicar();
    });
  }
  list.addEventListener('click', (e) => {
    if (!e.target.closest('[data-clear]')) return;
    Object.keys(activos).forEach((k) => { activos[k] = ''; });
    filtersEl.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.v === '')));
    aplicar();
    filtersEl.querySelector('.chip')?.focus();
  });
  estado();

  // Entradas en profundidad: secciones y tarjetas
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  } else document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));

  // Sección actual en la navegación
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  if (links.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => { if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const sec = document.querySelector(a.getAttribute('href')); if (sec) so.observe(sec); });
    const hero = document.querySelector('.hero');
    if (hero) so.observe(hero);
  }
})();
