/* Página de detalle: lee ?p=<slug> y arma el proyecto desde data/proyectos.js */
(() => {
  const { esc, lleno, ROLES, portadaDe, hoja, imgTag, tilt } = window.ARQ;
  const PROYECTOS = (window.PROYECTOS || []).filter(Boolean);
  const root = document.querySelector('[data-project]');
  const slug = new URLSearchParams(location.search).get('p');
  const idx = PROYECTOS.findIndex((p) => p.slug === slug);
  const p = PROYECTOS[idx];
  const crumb = '<a class="crumb" href="index.html#proyectos">Volver a proyectos</a>';

  if (!p) {
    root.innerHTML = `${crumb}<div class="project__head"><h1>Proyecto no encontrado</h1></div>
      <p class="notice">La dirección no corresponde a ningún proyecto publicado. Puede volver al índice de proyectos o llamar al <a href="tel:7293318801">729 331 8801</a>.</p>`;
    return;
  }

  document.title = `${p.nombre} | ORMAE Arquitectura`;
  const desc = p.resumen || [p.tipo, p.ubicacion, p.anio].filter(lleno).join(', ');
  if (desc) document.querySelector('meta[name="description"]')?.setAttribute('content', `${p.nombre}: ${desc}`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', p.nombre);
  const cov = portadaDe(p);
  if (cov) document.querySelector('meta[property="og:image"]')?.setAttribute('content', cov.src);

  const facts = [['Tipo', p.tipo], ['Ubicación', p.ubicacion], ['Año', p.anio]].filter(([, v]) => lleno(v));
  const resto = (p.imagenes || []).filter((im) => im !== cov);
  const todas = cov ? [cov, ...resto] : resto;

  const html = [];
  html.push(crumb);
  html.push(`<header class="project__head"><h1>${esc(p.nombre)}</h1>${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}</header>`);
  if (p.resumen) html.push(`<p class="lead project__summary">${esc(p.resumen)}</p>`);

  html.push(`<figure class="cover"><div class="cover__frame" style="view-transition-name: cover">${cov
    ? `<button class="shot" type="button" data-open="0" aria-label="Ampliar: ${esc(cov.alt || 'portada')}">${imgTag(cov, { prioridad: true })}</button>`
    : hoja('portada')}</div></figure>`);

  if (p.pendiente) {
    html.push(`<p class="notice">Este espacio está reservado para un proyecto del despacho. Su nombre, ubicación, año, descripción, decisiones de diseño, créditos e imágenes se publicarán al recibirse.</p>`);
  }

  if (lleno(p.descripcion) || lleno(p.decisiones)) {
    html.push(`<div class="project__body">
      ${lleno(p.descripcion) ? `<section aria-labelledby="t-desc"><h2 id="t-desc">El proyecto</h2><div class="prose" style="margin-top: var(--space-lg)">${p.descripcion.map((t) => `<p>${esc(t)}</p>`).join('')}</div></section>` : ''}
      ${lleno(p.decisiones) ? `<section aria-labelledby="t-dec"><h2 id="t-dec">Decisiones de diseño</h2><ol class="decisions" style="margin-top: var(--space-lg)">${p.decisiones.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></section>` : ''}
    </div>`);
  }

  if (p.panorama && p.panorama.src) {
    html.push(`<section class="project__section" aria-labelledby="t-pano"><h2 id="t-pano">Recorrido 360°</h2>
      <div class="viewer"><div class="viewer__pano" id="pano" role="application" aria-label="${esc(p.panorama.alt || 'Panorama 360°')}. Arrastre o use las flechas del teclado para mirar alrededor."></div>
      <div class="viewer__bar"><span>Arrastre, deslice con el dedo o use las flechas para mirar alrededor.</span></div></div></section>`);
  }

  if (p.secuencia && lleno(p.secuencia.frames)) {
    const n = p.secuencia.frames.length;
    html.push(`<section class="project__section" aria-labelledby="t-seq"><h2 id="t-seq">Vista en rotación</h2>
      <div class="viewer" data-seq>
        <div class="viewer__stage" tabindex="0" role="img" aria-roledescription="visor en rotación" aria-label="${esc(p.secuencia.alt || 'Secuencia en rotación')}. Use las flechas izquierda y derecha para girar.">
          <img src="${esc(p.secuencia.frames[0])}" alt="" width="${p.secuencia.ancho || 1600}" height="${p.secuencia.alto || 900}">
        </div>
        <div class="viewer__bar">
          <label for="seq-range">Girar</label>
          <input id="seq-range" type="range" min="0" max="${n - 1}" value="0" step="1">
          <span data-seq-count aria-live="off">1 de ${n}</span>
        </div>
      </div></section>`);
  }

  if (resto.length) {
    html.push(`<section class="project__section" aria-labelledby="t-gal"><h2 id="t-gal">Imágenes</h2><div class="gallery">${resto.map((im, i) => {
      const ancha = (im.ancho || 16) / (im.alto || 10) >= 1.3 || im.rol === 'plano';
      return `<figure${ancha ? ' class="is-wide"' : ''}><button class="shot" type="button" data-open="${i + (cov ? 1 : 0)}" aria-label="Ampliar: ${esc(im.alt || ROLES[im.rol] || 'imagen')}">${imgTag(im)}</button>${im.rol || im.pie ? `<figcaption>${esc(im.pie || ROLES[im.rol] || im.rol)}</figcaption>` : ''}</figure>`;
    }).join('')}</div></section>`);
  }

  if (lleno(p.creditos)) {
    html.push(`<section class="project__section" aria-labelledby="t-cred"><h2 id="t-cred">Créditos</h2><dl class="facts">${p.creditos.map((c) => `<div><dt>${esc(c.rol)}</dt><dd>${esc(c.nombre)}</dd></div>`).join('')}</dl></section>`);
  }

  if (PROYECTOS.length > 1) {
    const sig = PROYECTOS[(idx + 1) % PROYECTOS.length];
    html.push(`<a class="next" href="proyecto.html?p=${encodeURIComponent(sig.slug)}"><span>Siguiente proyecto</span><b>${esc(sig.nombre)}</b></a>`);
  }

  root.innerHTML = html.join('');
  root.querySelectorAll('.shot').forEach(tilt);

  /* ---------- Ampliación de imágenes ---------- */
  const dlg = document.querySelector('[data-lightbox]');
  if (dlg && todas.length) {
    const box = dlg.querySelector('[data-lb-img]'), count = dlg.querySelector('[data-lb-count]');
    let at = 0, opener = null;
    const show = (i) => {
      at = (i + todas.length) % todas.length;
      const im = todas[at];
      box.innerHTML = `<img src="${esc(im.src)}" alt="${esc(im.alt || '')}" width="${im.ancho || 1600}" height="${im.alto || 1000}">`;
      count.textContent = `${at + 1} de ${todas.length}${im.rol ? `, ${ROLES[im.rol] || im.rol}` : ''}`;
      dlg.querySelector('[data-lb-prev]').hidden = dlg.querySelector('[data-lb-next]').hidden = todas.length < 2;
    };
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-open]'); if (!b) return;
      opener = b; show(Number(b.dataset.open)); dlg.showModal();
    });
    dlg.querySelector('[data-lb-close]').addEventListener('click', () => dlg.close());
    dlg.querySelector('[data-lb-prev]').addEventListener('click', () => show(at - 1));
    dlg.querySelector('[data-lb-next]').addEventListener('click', () => show(at + 1));
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
    dlg.addEventListener('close', () => opener?.focus());
    let x0 = null;
    box.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    box.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) show(at + (dx < 0 ? 1 : -1)); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Visor de secuencia (giro real a partir de fotos consecutivas) ---------- */
  const seq = root.querySelector('[data-seq]');
  if (seq) {
    const frames = p.secuencia.frames;
    const stage = seq.querySelector('.viewer__stage'), img = stage.querySelector('img');
    const range = seq.querySelector('input[type="range"]'), count = seq.querySelector('[data-seq-count]');
    const cache = frames.map((src) => { const i = new Image(); i.decoding = 'async'; i.src = src; return i; });
    let cur = 0;
    const go = (i) => { cur = ((i % frames.length) + frames.length) % frames.length; img.src = cache[cur].src; range.value = cur; count.textContent = `${cur + 1} de ${frames.length}`; };
    range.addEventListener('input', () => go(Number(range.value)));
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
    });
    let startX = null, startFrame = 0;
    const paso = () => Math.max(6, stage.clientWidth / (frames.length * 1.2));
    stage.addEventListener('pointerdown', (e) => { startX = e.clientX; startFrame = cur; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', (e) => { if (startX === null) return; go(startFrame - Math.round((e.clientX - startX) / paso())); });
    const fin = () => { startX = null; };
    stage.addEventListener('pointerup', fin); stage.addEventListener('pointercancel', fin);
  }

  /* ---------- Panorama 360° (Pannellum, cargado solo cuando hace falta) ---------- */
  if (p.panorama && p.panorama.src) {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css';
    document.head.append(css);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js';
    s.onload = () => window.pannellum.viewer('pano', {
      type: 'equirectangular', panorama: p.panorama.src, autoLoad: true, showZoomCtrl: true, showFullscreenCtrl: true,
      keyboardZoom: true, mouseZoom: false, compass: false, hfov: 100, strings: { loadingLabel: 'Cargando…', loadButtonLabel: 'Cargar panorama' }
    });
    s.onerror = () => { document.getElementById('pano').innerHTML = `<img src="${esc(p.panorama.src)}" alt="${esc(p.panorama.alt || '')}" loading="lazy">`; };
    document.body.append(s);
  }
})();
