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
  const imgTag = (im, { prioridad = false, cls = '', sizes = '' } = {}) => {
    const w = im.ancho || 1600, h = im.alto || 1000;
    return `<img ${cls ? `class="${cls}" ` : ''}src="${esc(im.src)}"${im.srcset ? ` srcset="${esc(im.srcset)}" sizes="${esc(sizes || im.sizes || '100vw')}"` : ''} width="${w}" height="${h}" alt="${esc(im.alt || '')}" decoding="async"${prioridad ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
  };

  window.ARQ = { esc, lleno, pad, ROLES, portadaDe, hoja, imgTag, reduce, finePointer };

  /* ---------- Menú móvil ---------- */
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  if (nav && toggle) {
    const set = (open) => { nav.toggleAttribute('data-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.querySelector('.nav__toggle-label').textContent = open ? 'Cerrar' : 'Menú'; document.documentElement.classList.toggle('menu-open', open); };
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
        const hero = document.querySelector('[data-hero]');
        const clara = !!hero && hero.getBoundingClientRect().bottom > nav.offsetHeight * 2 && scrollY < 40;
        nav.classList.toggle('nav--clear', clara);
        nav.classList.toggle('nav--dark', sobre && !clara);
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

  /* ---------- Portada en video: intro del logotipo, bucle del recorrido y plano en 3D ---------- */
  const heroEl = document.querySelector('[data-hero]');
  const video = document.querySelector('[data-hero-video]');
  if (heroEl && video) {
    const INTRO_END = 3.6;   // segundos de la intro del logotipo dentro del video
    const LOOP_FROM = 4.2;   // el bucle repite solo el recorrido arquitectónico
    const toggle = document.querySelector('[data-video-toggle]');
    let pausedByUser = false;
    const POSTER = 'assets/video/portada-poster.jpg';
    const plane = document.querySelector('[data-hero-plane]');
    // Escala para pasar de "contener" (la intro completa, también en vertical) a "cubrir" la pantalla
    const medir = () => {
      const w = plane.clientWidth, h = plane.clientHeight, r = 16 / 9;
      const cw = Math.min(w, h * r), ch = cw / r;
      heroEl.style.setProperty('--cover', Math.max(w / cw, h / ch).toFixed(4));
    };
    medir(); addEventListener('resize', medir);
    const terminarIntro = () => heroEl.classList.remove('is-intro');
    const bloqueado = () => { if (video.paused && !pausedByUser) { video.poster = POSTER; terminarIntro(); heroEl.classList.add('is-blocked'); } };
    if (reduce.matches) {
      // Movimiento reducido: el video queda visible y quieto; se reproduce solo si la persona lo pide
      heroEl.classList.remove('is-intro');
      video.removeAttribute('autoplay'); video.pause(); video.poster = POSTER; pausedByUser = true;
      video.loop = true;
    } else {
      heroEl.classList.add('is-intro');
      video.loop = false;
      video.play().catch(bloqueado);
      video.addEventListener('timeupdate', () => {
        if (video.currentTime >= INTRO_END) terminarIntro();
        if (toggle && isFinite(video.duration)) toggle.style.setProperty('--vp', (video.currentTime / video.duration).toFixed(3));
        if (isFinite(video.duration) && video.currentTime >= video.duration - 0.35) video.currentTime = LOOP_FROM;
      });
      video.addEventListener('ended', () => {
        video.addEventListener('seeked', () => video.play().catch(() => {}), { once: true });
        video.currentTime = LOOP_FROM;
      });
      video.addEventListener('error', terminarIntro);
      video.querySelector('source:last-of-type')?.addEventListener('error', terminarIntro);
      // Ahorro de batería o de datos puede impedir la reproducción automática: queda la imagen y el botón
      setTimeout(bloqueado, 1600);
      setTimeout(terminarIntro, 5000);
    }
    const sync = () => {
      const playing = !video.paused;
      if (toggle) { toggle.querySelector('.hero__toggle-label').textContent = playing ? 'Pausar video' : 'Reproducir video'; toggle.setAttribute('aria-pressed', String(!playing)); toggle.classList.toggle('is-paused', !playing); }
    };
    video.addEventListener('play', sync); video.addEventListener('pause', sync);
    sync();
    toggle?.addEventListener('click', () => {
      if (video.paused) { pausedByUser = false; heroEl.classList.remove('is-blocked'); video.play().catch(() => {}); } else { pausedByUser = true; video.pause(); }
      terminarIntro();
    });
    // Se detiene fuera de pantalla para ahorrar batería
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !pausedByUser && !heroEl.classList.contains('is-blocked')) video.play().catch(() => {});
        else if (!e.isIntersecting) video.pause();
      }, { threshold: 0.05 }).observe(heroEl);
    }
    // Puntero: el plano del video y el texto se desplazan en capas distintas
    let raf = 0;
    heroEl.addEventListener('pointermove', (e) => {
      if (reduce.matches || !finePointer.matches || e.pointerType === 'touch') return;
      const r = heroEl.getBoundingClientRect();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        heroEl.classList.add('is-tilting');
        heroEl.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        heroEl.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    });
    heroEl.addEventListener('pointerleave', () => { heroEl.classList.remove('is-tilting'); heroEl.style.setProperty('--mx', '0'); heroEl.style.setProperty('--my', '0'); });
    // Scroll: el plano se inclina hacia atrás y se aleja
    let rs = 0;
    const onScroll = () => {
      cancelAnimationFrame(rs);
      rs = requestAnimationFrame(() => {
        const k = reduce.matches ? 0 : Math.min(1, Math.max(0, scrollY / Math.max(1, heroEl.offsetHeight)));
        heroEl.style.setProperty('--hscroll', k.toFixed(3));
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Monograma en capas (Estudio): se ensambla al entrar en pantalla y se separa con el puntero ---------- */
  const plate = document.querySelector('[data-plate]');
  if (plate) {
    let hover = 1, enter = 1, rp = 0;
    const sync = () => {
      plate.style.setProperty('--sep', Math.max(hover, 1 + enter * 3.2).toFixed(3));
      plate.style.setProperty('--scroll', enter.toFixed(3));
    };
    window.ARQ.tilt(plate, {
      target: plate, max: 12,
      onMove: (x, y) => { hover = 1 + 1.6 * Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2 + 0.35); sync(); },
      onLeave: () => { hover = 1; sync(); }
    });
    const onScroll = () => {
      cancelAnimationFrame(rp);
      rp = requestAnimationFrame(() => {
        if (reduce.matches) { enter = 0; sync(); return; }
        const r = plate.getBoundingClientRect(), vh = innerHeight;
        const prog = (vh - r.top) / (vh * 0.5 + r.height * 0.5);   // 0 al asomarse, 1 al centrarse
        enter = Math.min(1, Math.max(0, 1 - prog));
        sync();
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Estudio, alcances, correo y redes ---------- */
  const studio = document.querySelector('[data-studio]');
  if (studio && lleno(SITIO.estudio)) {
    const [primero, ...resto] = SITIO.estudio;
    const ig = (SITIO.redes || []).find((r) => r && /instagram/i.test(r.url || ''));
    studio.innerHTML = `<p class="lead">${esc(primero)}</p>`
      + (SITIO.cita ? `<blockquote class="studio__quote"><p>${esc(SITIO.cita)}</p></blockquote>` : '')
      + resto.map((p) => `<p>${esc(p)}</p>`).join('')
      + (SITIO.firma ? `<p class="studio__sign">${esc(SITIO.firma)}</p>` : '')
      + (ig ? `<p class="studio__more"><a href="${esc(ig.url)}" rel="me noopener" target="_blank">Ver el trabajo diario en Instagram</a></p>` : '');
  }
  // Servicios: etapas reales del despacho, cuando se capturen
  const etapas = document.querySelector('[data-etapas]');
  if (etapas && lleno(SITIO.etapas)) {
    etapas.innerHTML = SITIO.etapas.map((e) => `<li><h3>${esc(e.titulo)}</h3>${e.texto ? `<p>${esc(e.texto)}</p>` : ''}</li>`).join('');
    etapas.hidden = false;
  }
  const scope = document.querySelector('[data-scope]');
  if (scope && lleno(SITIO.alcances)) { scope.innerHTML = SITIO.alcances.map((a) => `<li>${esc(a)}</li>`).join(''); scope.hidden = false; }
  const extra = document.querySelector('[data-contact-extra]');
  if (extra) {
    const links = [];
    if (SITIO.correo) links.push(`<a href="mailto:${esc(SITIO.correo)}">${esc(SITIO.correo)}</a>`);
    (SITIO.redes || []).forEach((r) => { if (r && r.url && !/instagram/i.test(r.url)) links.push(`<a href="${esc(r.url)}" rel="me noopener" target="_blank">${esc(r.nombre || r.url)}</a>`); });
    extra.innerHTML = links.join('');
  }

  /* ---------- Carrusel de proyectos y filtros ---------- */
  const ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
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
        <figure class="card__img" data-slot="tarjeta-${esc(p.slug)}" data-alt="Portada del proyecto, vertical 4:5">${cov ? imgTag(cov, { sizes: '(min-width: 60rem) 32rem, 80vw' }) : hoja('portada')}</figure>
        <span class="card__meta">
          <span class="card__num">${pad(i + 1)}</span>
          <span class="card__name">${esc(p.nombre || 'Proyecto sin nombre')}</span>
          <span class="card__info">${esc(meta)}</span>
          <span class="card__year">${lleno(p.anio) ? esc(p.anio) : ''}</span>
          ${p.resumen ? `<span class="card__sum">${esc(p.resumen)}</span>` : ''}
          <span class="card__go">Ver proyecto${ARROW}</span>
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
    const bar = document.querySelector('[data-rail-progress]');
    if (bar) bar.style.setProperty('--p', max > 4 ? (list.scrollLeft / max).toFixed(3) : '1');
  };
  const mover = (dir) => list.scrollBy({ left: dir * paso(), behavior: reduce.matches ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  const coverflow = () => {
    const box = list.getBoundingClientRect(), mid = box.left + box.width / 2;
    list.querySelectorAll('.card').forEach((card) => {
      if (reduce.matches) { card.style.removeProperty('--cf-r'); card.style.removeProperty('--cf-z'); return; }
      const r = card.getBoundingClientRect();
      const d = Math.max(-1.4, Math.min(1.4, (r.left + r.width / 2 - mid) / box.width * 1.6));
      card.style.setProperty('--cf-r', (d * -16).toFixed(2) + 'deg');
      card.style.setProperty('--cf-z', (Math.abs(d) * -70).toFixed(1) + 'px');
    });
  };
  list.addEventListener('scroll', () => requestAnimationFrame(() => { estado(); coverflow(); }), { passive: true });
  addEventListener('resize', coverflow);
  requestAnimationFrame(coverflow);
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
      `<button class="chip" type="button" data-k="${f.k}" data-v="" aria-pressed="true">Todos <span class="chip__n">${reales.length}</span></button>` +
      f.vals.map((v) => `<button class="chip" type="button" data-k="${f.k}" data-v="${esc(v)}" aria-pressed="false">${esc(v)} <span class="chip__n">${reales.filter((p) => String(p[f.k]) === v).length}</span></button>`).join('') +
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

  // Servicios: los tipos de proyecto publicados, cada uno abre el portafolio ya filtrado
  const ambitos = document.querySelector('[data-ambitos]'), ambList = document.querySelector('[data-ambitos-list]');
  if (ambitos && ambList) {
    const tipos = [...new Set(reales.map((p) => p.tipo).filter(lleno))];
    if (tipos.length) {
      ambList.innerHTML = tipos.map((tipo) => {
        const n = reales.filter((p) => p.tipo === tipo).length;
        return `<li><a class="ambito" href="#proyectos" data-apply-k="tipo" data-apply-v="${esc(tipo)}"><span class="ambito__name">${esc(tipo)}</span><span class="ambito__n">${n === 1 ? '1 proyecto' : n + ' proyectos'}</span>${ARROW}</a></li>`;
      }).join('');
      ambitos.hidden = false;
      ambList.addEventListener('click', (e) => {
        const a = e.target.closest('[data-apply-k]'); if (!a) return;
        const chip = filtersEl && filtersEl.querySelector(`.chip[data-k="${a.dataset.applyK}"][data-v="${CSS.escape(a.dataset.applyV)}"]`);
        if (chip) chip.click();
      });
    }
  }

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
