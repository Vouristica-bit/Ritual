/* =============================================================================
   TIENDA — tarjetas, filtros, buscador, orden y vista rápida
   Se usa en index.html (destacados) y en tienda.html (catálogo completo).
   ========================================================================== */
(function () {
  'use strict';
  const R = window.RITUAL;
  const { $, $$, money, IMG, esc, ICON, svgIcon, producto, precioCon, tamano, Cart, toast } = R;

  const nombreColeccion = (id) => (window.COLECCIONES.find((c) => c.id === id) || {}).nombre || id;

  /* --- Tarjeta ------------------------------------------------------------ */
  function tarjeta(p, i) {
    const badge = p.badge
      ? `<span class="badge ${p.best ? 'badge--clay' : p.nuevo ? 'badge--moss' : 'badge--gold'}">${esc(p.badge)}</span>`
      : '';
    return `
      <article class="card product media-zoom reveal ${i % 4 === 1 ? 'reveal-d1' : i % 4 === 2 ? 'reveal-d2' : i % 4 === 3 ? 'reveal-d3' : ''}" data-id="${esc(p.id)}">
        <div class="product__media">
          ${badge}
          <a class="media media--tall" href="tienda.html?producto=${encodeURIComponent(p.id)}" data-qv="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">
            <img src="${IMG(p.img)}" alt="${esc(p.nombre)} — ${esc(p.tagline)}" loading="lazy" width="500" height="625">
          </a>
          <div class="product__quick">
            <button class="btn btn--sm btn--light" type="button" data-qv="${esc(p.id)}">Vista rápida</button>
            <button class="btn btn--sm" type="button" data-add="${esc(p.id)}">Añadir</button>
          </div>
        </div>
        <div class="product__body">
          <h3 class="product__title"><a href="tienda.html?producto=${encodeURIComponent(p.id)}" data-qv="${esc(p.id)}">${esc(p.nombre)}</a></h3>
          <p class="product__meta">${esc(p.tagline)}</p>
          <div class="product__foot">
            <span class="product__price price">${money(p.precio)}</span>
            <span class="product__meta">${esc(nombreColeccion(p.coleccion))}</span>
          </div>
        </div>
      </article>`;
  }

  function pintar(cont, lista) {
    if (!lista.length) {
      cont.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <h3>Sin resultados</h3>
        <p class="muted mt-1">Prueba con otra palabra o quita los filtros.</p>
        <button class="btn btn--ghost btn--sm mt-2" type="button" data-reset-filtros>Ver todo el catálogo</button>
      </div>`;
      return;
    }
    cont.innerHTML = lista.map(tarjeta).join('');
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }), { threshold: 0.06 });
      $$('.reveal', cont).forEach((n) => io.observe(n));
    } else {
      $$('.reveal', cont).forEach((n) => n.classList.add('is-in'));
    }
  }

  /* --- Colecciones ------------------------------------------------------- */
  function pintarColecciones() {
    const box = $('#colecciones');
    if (!box) return;
    box.innerHTML = window.COLECCIONES.map((c, i) => {
      const n = window.PRODUCTOS.filter((p) => p.coleccion === c.id).length;
      const href = c.esCta ? c.href : 'tienda.html?coleccion=' + c.id;
      return `<a class="collection media-zoom reveal reveal-d${i}" href="${href}">
        <div class="media"><img src="${IMG(c.img)}" alt="${esc(c.nombre)}" loading="lazy" width="500" height="666"></div>
        ${n ? `<span class="collection__count">${n} piezas</span>` : `<span class="collection__count">A medida</span>`}
        <div class="collection__body"><h3>${esc(c.nombre)}</h3><p>${esc(c.desc)}</p></div>
      </a>`;
    }).join('');
  }

  /* --- Vista rápida ------------------------------------------------------ */
  let modal;
  function montarModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalProducto';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `<div class="modal__panel">
      <button class="modal__close" type="button" data-modal-close aria-label="Cerrar">${svgIcon('<path d="M18 6 6 18M6 6l12 12"/>')}</button>
      <div class="qv" id="qvContenido"></div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-modal-close]')) cerrar();
    });
    return modal;
  }

  function cerrar() {
    if (!modal) return;
    modal.classList.remove('is-open');
    const ov = $('#overlayGlobal');
    if (ov) ov.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    const url = new URL(location.href);
    if (url.searchParams.has('producto')) { url.searchParams.delete('producto'); history.replaceState({}, '', url); }
  }

  function abrirQV(id) {
    const p = producto(id);
    if (!p) return;
    montarModal();
    const tamDefault = 'clasico';
    $('#qvContenido').innerHTML = `
      <div class="qv__media"><div class="media"><img src="${IMG(p.img)}" alt="${esc(p.nombre)}" width="600" height="750"></div></div>
      <div class="qv__body">
        <p class="eyebrow">${esc(nombreColeccion(p.coleccion))}</p>
        <h2 id="qvTitulo">${esc(p.nombre)}</h2>
        <p class="qv__price price" id="qvPrecio">${money(precioCon(p, tamDefault))}</p>
        <p>${esc(p.desc)}</p>

        <div class="qv__section">
          <p class="label" style="margin-bottom:.5rem">Tamaño</p>
          <div class="options options--3" id="qvTamanos">
            ${window.TAMANOS.map((t) => `
              <label class="option">
                <input type="radio" name="qvTam" value="${t.id}"${t.id === tamDefault ? ' checked' : ''}>
                <span class="option__title">${esc(t.nombre)}<span class="price">${money(precioCon(p, t.id))}</span></span>
                <span class="option__desc">${esc(t.desc)}</span>
              </label>`).join('')}
          </div>
        </div>

        <div class="qv__section">
          <p class="label" style="margin-bottom:.5rem">Añade un detalle</p>
          <div class="options" id="qvExtras">
            ${window.EXTRAS.map((x) => `
              <label class="option" style="flex-direction:row;align-items:center;gap:.7rem">
                <input type="checkbox" value="${x.id}" style="position:static;opacity:1;width:17px;height:17px;accent-color:var(--clay)">
                <span class="option__title" style="flex:1">${esc(x.nombre)}<span class="price">+ ${money(x.precio)}</span></span>
              </label>`).join('')}
          </div>
        </div>

        <div class="qv__section row" style="gap:.7rem">
          <div class="qty">
            <button type="button" id="qvMenos" aria-label="Menos">−</button><span id="qvQty">1</span>
            <button type="button" id="qvMas" aria-label="Más">+</button>
          </div>
          <button class="btn" type="button" id="qvAdd" style="flex:1">Añadir al carrito · <span id="qvTotal">${money(precioCon(p, tamDefault))}</span></button>
        </div>

        <div class="qv__section">
          <ul class="qv__list">
            ${p.incluye.map((x) => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}
            <li>${ICON.check}<span>Duración estimada: ${esc(p.duracion)}</span></li>
          </ul>
        </div>

        <div class="qv__section">
          <details><summary class="label" style="cursor:pointer">Cómo cuidarlo</summary>
            <p class="small muted mt-1">${esc(p.cuidado)}</p></details>
        </div>
      </div>`;

    let qty = 1;
    const tamSel = () => ($('input[name=qvTam]:checked') || {}).value || tamDefault;
    const extrasSel = () => $$('#qvExtras input:checked').map((i) => window.EXTRAS.find((x) => x.id === i.value));
    const recalcular = () => {
      const base = precioCon(p, tamSel());
      const extra = extrasSel().reduce((s, x) => s + x.precio, 0);
      $('#qvPrecio').textContent = money(base);
      $('#qvTotal').textContent = money((base + extra) * qty);
    };
    $('#qvTamanos').addEventListener('change', recalcular);
    $('#qvExtras').addEventListener('change', recalcular);
    $('#qvMas').addEventListener('click', () => { qty++; $('#qvQty').textContent = qty; recalcular(); });
    $('#qvMenos').addEventListener('click', () => { qty = Math.max(1, qty - 1); $('#qvQty').textContent = qty; recalcular(); });
    $('#qvAdd').addEventListener('click', () => {
      Cart.add(p.id, tamSel(), qty);
      extrasSel().forEach((x) => Cart.add(x.id, null, qty, { tipo: 'extra', nombre: x.nombre, precio: x.precio, img: p.img, meta: 'Complemento' }));
      cerrar();
      toast(p.nombre + ' añadido al carrito', ICON.bag);
      R.abrirCarrito();
    });

    modal.setAttribute('aria-label', p.nombre);
    modal.classList.add('is-open');
    $('#overlayGlobal').classList.add('is-open');
    document.body.classList.add('is-locked');
    $('.modal__close', modal).focus();
    const url = new URL(location.href);
    url.searchParams.set('producto', p.id);
    history.replaceState({}, '', url);
  }

  /* --- Catálogo con filtros ---------------------------------------------- */
  function catalogo() {
    const grid = $('#gridTienda');
    if (!grid) return;
    const estado = { coleccion: 'todo', q: '', orden: 'destacados' };
    const params = new URLSearchParams(location.search);
    if (params.get('coleccion')) estado.coleccion = params.get('coleccion');

    const filtros = $('#filtros');
    if (filtros) {
      filtros.innerHTML = [{ id: 'todo', nombre: 'Todo' }]
        .concat(window.COLECCIONES.filter((c) => !c.esCta))
        .map((c) => `<button class="chip" type="button" data-filtro="${c.id}" aria-pressed="${c.id === estado.coleccion}">${esc(c.nombre)}</button>`)
        .join('');
    }

    function lista() {
      let out = window.PRODUCTOS.slice();
      if (estado.coleccion !== 'todo') out = out.filter((p) => p.coleccion === estado.coleccion);
      if (estado.q) {
        const q = estado.q.toLowerCase();
        out = out.filter((p) => (p.nombre + ' ' + p.tagline + ' ' + p.desc + ' ' + nombreColeccion(p.coleccion)).toLowerCase().includes(q));
      }
      const ord = {
        destacados: (a, b) => (b.best ? 1 : 0) - (a.best ? 1 : 0) || a.orden - b.orden,
        nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || b.orden - a.orden,
        precioAsc: (a, b) => a.precio - b.precio,
        precioDesc: (a, b) => b.precio - a.precio,
        nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es')
      };
      return out.sort(ord[estado.orden] || ord.destacados);
    }

    function render() {
      const l = lista();
      pintar(grid, l);
      const c = $('#conteo');
      if (c) c.textContent = l.length + (l.length === 1 ? ' pieza' : ' piezas');
      if (filtros) $$('[data-filtro]', filtros).forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.filtro === estado.coleccion)));
      const url = new URL(location.href);
      estado.coleccion === 'todo' ? url.searchParams.delete('coleccion') : url.searchParams.set('coleccion', estado.coleccion);
      history.replaceState({}, '', url);
      const titulo = $('#tituloColeccion');
      if (titulo) titulo.textContent = estado.coleccion === 'todo' ? 'Toda la carta' : nombreColeccion(estado.coleccion);
    }

    document.addEventListener('click', (e) => {
      const f = e.target.closest('[data-filtro]');
      if (f) { estado.coleccion = f.dataset.filtro; render(); return; }
      if (e.target.closest('[data-reset-filtros]')) {
        estado.coleccion = 'todo'; estado.q = '';
        const b = $('#buscar'); if (b) b.value = '';
        render();
      }
    });
    const buscar = $('#buscar');
    if (buscar) {
      let t;
      buscar.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => { estado.q = buscar.value.trim(); render(); }, 180);
      });
    }
    const orden = $('#orden');
    if (orden) orden.addEventListener('change', () => { estado.orden = orden.value; render(); });

    render();
  }

  /* --- Bloques de destacados en la home ---------------------------------- */
  function destacados() {
    $$('[data-productos]').forEach((cont) => {
      const modo = cont.dataset.productos;
      const limite = Number(cont.dataset.limite || 4);
      let l = window.PRODUCTOS.slice();
      if (modo === 'destacados') l = l.filter((p) => p.best || p.nuevo || p.badge).concat(l).filter((p, i, a) => a.indexOf(p) === i);
      if (modo === 'nuevos') l = l.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
      if (cont.dataset.coleccion) l = window.PRODUCTOS.filter((p) => p.coleccion === cont.dataset.coleccion);
      pintar(cont, l.slice(0, limite));
    });
  }

  /* --- Escuchas globales -------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); abrirQV(qv.dataset.qv); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = producto(add.dataset.add);
      Cart.add(p.id, 'clasico', 1);
      toast(p.nombre + ' añadido al carrito', ICON.bag);
    }
  });

  document.addEventListener('ritual:listo', () => {
    pintarColecciones();
    destacados();
    catalogo();
    const pid = new URLSearchParams(location.search).get('producto');
    if (pid && producto(pid)) setTimeout(() => abrirQV(pid), 250);
  });

  window.RITUAL.abrirProducto = abrirQV;
})();
