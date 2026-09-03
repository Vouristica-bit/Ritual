/* =============================================================================
   NÚCLEO — utilidades, carrito, interfaz y formularios
   Depende de config.js y data.js (cargados antes).
   ========================================================================== */
(function () {
  'use strict';

  /* --- 1. Utilidades ------------------------------------------------------ */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const C  = window.CONFIG;

  const cfg = (path, fallback) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C) ?? (fallback ?? '');

  const money = (n) => {
    const m = C.moneda;
    try {
      return new Intl.NumberFormat(m.locale, {
        style: 'currency', currency: m.codigo,
        minimumFractionDigits: m.decimales, maximumFractionDigits: m.decimales
      }).format(n);
    } catch (e) { return '$' + Math.round(n); }
  };

  /* Ruta de imagen: permite cambiar la extensión global al usar fotos reales */
  const IMG = (name) => 'assets/img/' + name + '.' + (window.IMG_EXT || 'svg');

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  const tamano = (id) => window.TAMANOS.find((t) => t.id === id) || window.TAMANOS[1];
  const producto = (id) => window.PRODUCTOS.find((p) => p.id === id);
  const precioCon = (p, tamId) => Math.round((p.precio * tamano(tamId).factor) / 10) * 10;

  const hoyISO = () => new Date().toISOString().slice(0, 10);
  const svgIcon = (d, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}>${d}</svg>`;
  const ICON = {
    check: svgIcon('<path d="M20 6 9 17l-5-5"/>'),
    arrow: svgIcon('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
    bag: svgIcon('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
    spark: svgIcon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/>')
  };

  window.RITUAL = { $, $$, cfg, money, IMG, esc, ls, tamano, producto, precioCon, ICON, svgIcon };

  /* --- 2. Datos del negocio en el HTML ------------------------------------ */
  function hidratarConfig() {
    $$('[data-cfg]').forEach((n) => { n.textContent = cfg(n.dataset.cfg); });
    $$('[data-cfg-href]').forEach((n) => {
      const v = cfg(n.dataset.cfgHref);
      if (!v) { n.closest('[data-cfg-hide]') ? n.closest('[data-cfg-hide]').remove() : n.remove(); return; }
      n.href = v;
    });
    const mail = cfg('contacto.email'), tel = cfg('contacto.telefono');
    $$('[data-cfg-mail]').forEach((n) => { n.href = 'mailto:' + mail; if (!n.dataset.keepText) n.textContent = mail; });
    $$('[data-cfg-tel]').forEach((n) => { n.href = 'tel:' + tel.replace(/[^+\d]/g, ''); if (!n.dataset.keepText) n.textContent = tel; });
    $$('[data-cfg-wa]').forEach((n) => {
      const wa = cfg('contacto.whatsapp');
      if (!wa) { (n.closest('[data-cfg-hide]') || n).remove(); return; }
      n.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Hola ' + cfg('marca.nombre') + ', me gustaría hacer un pedido.');
      n.target = '_blank'; n.rel = 'noopener';
    });
    $$('[data-cfg-maps]').forEach((n) => {
      n.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg('contacto.mapsQuery'));
      n.target = '_blank'; n.rel = 'noopener';
    });
    $$('[data-envio-gratis]').forEach((n) => { n.textContent = money(cfg('entrega.avisoEnvioGratis')); });
    $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });
    const horario = $('[data-horario]');
    if (horario) horario.innerHTML = cfg('contacto.horario')
      .map((h) => `<div><span>${esc(h.dia)}</span><span>${esc(h.horas)}</span></div>`).join('');
    const zonas = $$('[data-zonas]');
    zonas.forEach((sel) => {
      sel.innerHTML = cfg('entrega.zonas').map((z) =>
        `<option value="${z.id}">${esc(z.nombre)}${z.costo ? ' · ' + money(z.costo) : ' · gratis'}</option>`).join('');
    });
  }

  /* --- 3. Avisos (toasts) ------------------------------------------------- */
  let toastBox;
  function toast(msg, icon) {
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'toasts';
      toastBox.setAttribute('role', 'status');
      toastBox.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastBox);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = (icon || ICON.check) + '<span>' + esc(msg) + '</span>';
    toastBox.appendChild(t);
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 400); }, 3200);
  }
  window.RITUAL.toast = toast;

  /* --- 4. Carrito --------------------------------------------------------- */
  const CART_KEY = 'ritual_carrito_v1';
  const Cart = {
    items: ls.get(CART_KEY, []),
    save() { ls.set(CART_KEY, this.items); this.emit(); },
    emit() {
      document.dispatchEvent(new CustomEvent('carrito:cambio'));
      const n = this.count();
      $$('[data-cart-count]').forEach((b) => {
        b.textContent = n;
        b.classList.toggle('is-visible', n > 0);
      });
    },
    key(id, tam, extra) { return [id, tam || '', extra || ''].join('|'); },
    add(id, tam, qty, extra) {
      const p = producto(id);
      const nombre = p ? p.nombre : (extra && extra.nombre) || id;
      const k = this.key(id, tam, extra && extra.tipo);
      const found = this.items.find((i) => i.key === k);
      if (found) found.qty += qty || 1;
      else this.items.push({
        key: k, id, tipo: (extra && extra.tipo) || 'producto', nombre,
        tam: tam || null, qty: qty || 1,
        precio: extra && extra.precio != null ? extra.precio : precioCon(p, tam),
        img: (p && p.img) || (extra && extra.img) || 'producto-01',
        meta: (extra && extra.meta) || ''
      });
      this.save();
      return nombre;
    },
    setQty(key, qty) {
      const it = this.items.find((i) => i.key === key);
      if (!it) return;
      it.qty = Math.max(0, qty);
      if (it.qty === 0) this.items = this.items.filter((i) => i.key !== key);
      this.save();
    },
    remove(key) { this.items = this.items.filter((i) => i.key !== key); this.save(); },
    clear() { this.items = []; this.save(); },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    subtotal() { return this.items.reduce((s, i) => s + i.precio * i.qty, 0); },
    zona(id) { return cfg('entrega.zonas').find((z) => z.id === id) || cfg('entrega.zonas')[0]; },
    envio(zonaId) {
      const z = this.zona(zonaId);
      if (!z.costo) return 0;
      return this.subtotal() >= cfg('entrega.avisoEnvioGratis') ? 0 : z.costo;
    },
    total(zonaId) { return this.subtotal() + this.envio(zonaId); }
  };
  window.RITUAL.Cart = Cart;

  /* --- 5. Cajón del carrito ---------------------------------------------- */
  function montarCarrito() {
    if ($('#drawerCarrito')) return;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlayGlobal';
    const zonasOpts = cfg('entrega.zonas').map((z) =>
      `<option value="${z.id}">${esc(z.nombre)}${z.costo ? ' · ' + money(z.costo) : ' · gratis'}</option>`).join('');

    const d = document.createElement('aside');
    d.className = 'drawer';
    d.id = 'drawerCarrito';
    d.setAttribute('aria-hidden', 'true');
    d.setAttribute('aria-label', 'Tu carrito');
    d.innerHTML = `
      <div class="drawer__head">
        <h2 class="drawer__title">Tu carrito</h2>
        <button class="drawer__close" type="button" data-cart-close aria-label="Cerrar carrito">${svgIcon('<path d="M18 6 6 18M6 6l12 12"/>')}</button>
      </div>
      <div class="drawer__body" id="carritoCuerpo"></div>
      <div class="drawer__foot" id="carritoPie"></div>`;
    document.body.append(overlay, d);

    overlay.addEventListener('click', cerrarTodo);
    d.addEventListener('click', (e) => { if (e.target.closest('[data-cart-close]')) cerrarCarrito(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarTodo(); });
    document.addEventListener('carrito:cambio', pintarCarrito);
    pintarCarrito();
  }

  function pintarCarrito() {
    const cuerpo = $('#carritoCuerpo'), pie = $('#carritoPie');
    if (!cuerpo) return;

    if (!Cart.items.length) {
      cuerpo.innerHTML = `<div class="cart-empty">
        ${ICON.bag}
        <p><strong>Tu carrito está vacío</strong></p>
        <p class="small">Empieza por nuestros ramos de temporada o arma tu suscripción.</p>
        <a class="btn btn--ghost btn--sm mt-2" href="tienda.html">Ver la tienda</a>
      </div>`;
      pie.innerHTML = '';
      return;
    }

    cuerpo.innerHTML = Cart.items.map((i) => `
      <article class="cart-line">
        <div class="cart-line__img"><img src="${IMG(i.img)}" alt="" width="74" height="92" loading="lazy"></div>
        <div>
          <h3 class="cart-line__name">${esc(i.nombre)}</h3>
          ${i.tam ? `<p class="cart-line__var">Tamaño ${esc(tamano(i.tam).nombre)}</p>` : ''}
          ${i.meta ? `<p class="cart-line__var">${esc(i.meta)}</p>` : ''}
          <div class="row mt-1">
            <div class="qty">
              <button type="button" data-qty="-1" data-key="${esc(i.key)}" aria-label="Quitar uno de ${esc(i.nombre)}">−</button>
              <span>${i.qty}</span>
              <button type="button" data-qty="1" data-key="${esc(i.key)}" aria-label="Añadir uno de ${esc(i.nombre)}">+</button>
            </div>
            <button type="button" class="cart-line__remove" data-remove="${esc(i.key)}">Quitar</button>
          </div>
        </div>
        <p class="price">${money(i.precio * i.qty)}</p>
      </article>`).join('');

    const st = ls.get('ritual_entrega_v1', {});
    const zonaId = st.zona || cfg('entrega.zonas')[0].id;
    const envio = Cart.envio(zonaId);
    const falta = cfg('entrega.avisoEnvioGratis') - Cart.subtotal();

    /* El formulario vive en el cuerpo desplazable; el botón de envío queda
       fijo en el pie usando el atributo form= (HTML5). */
    cuerpo.insertAdjacentHTML('beforeend', `
      <form id="formPedido" novalidate class="stack" style="--gap:.75rem;border-top:1px solid var(--line);padding-top:1.1rem">
        <p class="label">Datos de la entrega</p>
        <div class="field">
          <label for="pedZona">Zona</label>
          <select id="pedZona" name="zona">${cfg('entrega.zonas').map((z) =>
            `<option value="${z.id}"${z.id === zonaId ? ' selected' : ''}>${esc(z.nombre)}${z.costo ? ' · ' + money(z.costo) : ' · gratis'}</option>`).join('')}</select>
        </div>
        <div class="grid grid--2" style="gap:.7rem">
          <div class="field">
            <label for="pedFecha">Fecha</label>
            <input type="date" id="pedFecha" name="fecha" min="${hoyISO()}" value="${esc(st.fecha || hoyISO())}" required>
            <p class="field__error"></p>
          </div>
          <div class="field">
            <label for="pedFranja">Franja</label>
            <select id="pedFranja" name="franja">
              <option value="Mañana (9:00–14:00)">Mañana 9–14 h</option>
              <option value="Tarde (14:00–19:00)">Tarde 14–19 h</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="pedNombre">Tu nombre *</label>
          <input id="pedNombre" name="nombre" autocomplete="name" required placeholder="Quién hace el pedido">
          <p class="field__error"></p>
        </div>
        <div class="field">
          <label for="pedTel">Teléfono *</label>
          <input id="pedTel" name="telefono" inputmode="tel" autocomplete="tel" required placeholder="Para confirmar la entrega">
          <p class="field__error"></p>
        </div>
        <div class="field">
          <label for="pedDir">Dirección de entrega</label>
          <input id="pedDir" name="direccion" autocomplete="street-address" placeholder="Calle, número, colonia">
          <p class="field__error"></p>
        </div>
        <div class="field">
          <label for="pedNota">Dedicatoria para la tarjeta</label>
          <textarea id="pedNota" name="dedicatoria" rows="3" style="min-height:78px" placeholder="La escribimos a mano"></textarea>
        </div>
      </form>`);

    pie.innerHTML = `
      <div class="totals">
        <div class="totals__row"><span>Subtotal</span><span class="price">${money(Cart.subtotal())}</span></div>
        <div class="totals__row"><span>Envío</span><span class="price">${envio ? money(envio) : 'Gratis'}</span></div>
        <div class="totals__row totals__row--total"><span>Total</span><span class="price">${money(Cart.total(zonaId))}</span></div>
      </div>
      ${falta > 0 ? `<p class="form-note">Te faltan <strong>${money(falta)}</strong> para el envío gratis.</p>` : ''}
      <div class="form-msg" id="pedidoMsg" role="alert"></div>
      <button class="btn btn--full" type="submit" form="formPedido">Confirmar pedido ${ICON.arrow}</button>
      <p class="form-note center">Confirmamos por WhatsApp o correo y te enviamos el enlace de pago.</p>`;

    $('#pedZona').addEventListener('change', (e) => {
      ls.set('ritual_entrega_v1', Object.assign(ls.get('ritual_entrega_v1', {}), { zona: e.target.value }));
      pintarCarrito();
    });
    $('#pedFecha').addEventListener('change', (e) => {
      ls.set('ritual_entrega_v1', Object.assign(ls.get('ritual_entrega_v1', {}), { fecha: e.target.value }));
    });
    $('#formPedido').addEventListener('submit', enviarPedido);
  }

  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-qty]');
    if (q) {
      const it = Cart.items.find((i) => i.key === q.dataset.key);
      if (it) Cart.setQty(it.key, it.qty + Number(q.dataset.qty));
      return;
    }
    const r = e.target.closest('[data-remove]');
    if (r) { Cart.remove(r.dataset.remove); toast('Producto eliminado'); return; }
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); abrirCarrito(); }
  });

  function abrirCarrito() {
    montarCarrito();
    $('#drawerCarrito').classList.add('is-open');
    $('#drawerCarrito').setAttribute('aria-hidden', 'false');
    $('#overlayGlobal').classList.add('is-open');
    document.body.classList.add('is-locked');
    const f = $('#drawerCarrito .drawer__close'); if (f) f.focus();
  }
  function cerrarCarrito() {
    const d = $('#drawerCarrito'); if (!d) return;
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open') && !$('.mobile-nav.is-open')) {
      $('#overlayGlobal').classList.remove('is-open');
      document.body.classList.remove('is-locked');
    }
  }
  function cerrarTodo() {
    cerrarCarrito();
    $$('.modal.is-open').forEach((m) => m.classList.remove('is-open'));
    const mn = $('.mobile-nav');
    if (mn) { mn.classList.remove('is-open'); const b = $('.burger'); if (b) b.setAttribute('aria-expanded', 'false'); }
    const lb = $('.lightbox'); if (lb) lb.classList.remove('is-open');
    const ov = $('#overlayGlobal'); if (ov) ov.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  }
  window.RITUAL.abrirCarrito = abrirCarrito;
  window.RITUAL.cerrarTodo = cerrarTodo;

  /* --- 6. Envío de formularios ------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function validar(form) {
    let ok = true;
    $$('input,select,textarea', form).forEach((i) => {
      const wrap = i.closest('.field');
      const err = wrap && $('.field__error', wrap);
      let msg = '';
      if (i.type === 'checkbox') {
        if (i.hasAttribute('required') && !i.checked) msg = 'Necesitamos tu confirmación para continuar.';
      } else if (i.hasAttribute('required') && !i.value.trim()) msg = 'Este campo es obligatorio.';
      else if (i.type === 'email' && i.value && !EMAIL_RE.test(i.value)) msg = 'Revisa el correo electrónico.';
      else if (i.type === 'date' && i.value && i.value < hoyISO() && i.name === 'fecha' && i.hasAttribute('min')) msg = 'Elige una fecha a partir de hoy.';
      if (wrap) wrap.classList.toggle('field--error', !!msg);
      if (err) err.textContent = msg;
      if (msg && ok) { ok = false; i.focus(); }
    });
    return ok;
  }

  function datos(form) {
    const o = {};
    new FormData(form).forEach((v, k) => { o[k] = typeof v === 'string' ? v.trim() : v; });
    return o;
  }

  function mensaje(box, texto, tipo) {
    if (!box) return;
    box.textContent = texto;
    box.classList.remove('is-ok', 'is-err');
    box.classList.add(tipo === 'err' ? 'is-err' : 'is-ok');
  }

  async function enviar(endpoint, payload) {
    if (!endpoint) return { modo: 'local' };
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return { modo: 'remoto' };
  }

  function guardarLocal(lista, payload) {
    const arr = ls.get(lista, []);
    arr.push(Object.assign({ fecha: new Date().toISOString() }, payload));
    ls.set(lista, arr);
  }

  /* Formularios declarativos: <form data-form="newsletter|contacto|suscripcion"> */
  function conectarFormularios() {
    $$('form[data-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tipo = form.dataset.form;
        const box = $('.form-msg', form);
        if (!validar(form)) { mensaje(box, 'Revisa los campos marcados.', 'err'); return; }
        const btn = $('button[type=submit]', form);
        const txt = btn ? btn.innerHTML : '';
        if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.innerHTML = 'Enviando…'; }

        const payload = Object.assign({ origen: tipo, sitio: cfg('marca.dominio') }, datos(form));
        try {
          const res = await enviar(cfg('endpoints.' + tipo, ''), payload);
          guardarLocal('ritual_envios_' + tipo, payload);
          if (tipo === 'newsletter') {
            mensaje(box, '¡Listo! Te damos la bienvenida al ritual. Revisa tu correo para confirmar la suscripción.', 'ok');
            toast('Suscripción registrada', ICON.spark);
          } else if (tipo === 'suscripcion') {
            mensaje(box, 'Recibimos tu plan. Te escribimos en menos de 24 h para agendar la primera entrega.', 'ok');
            toast('Solicitud de plan enviada', ICON.spark);
          } else {
            mensaje(box, 'Gracias por escribir. Respondemos en horario de taller, normalmente el mismo día.', 'ok');
            toast('Mensaje enviado');
          }
          if (res.modo === 'local' && form.dataset.fallback !== 'off') {
            const asunto = 'Web · ' + tipo;
            const cuerpo = Object.entries(payload).map(([k, v]) => k + ': ' + v).join('\n');
            const link = $('[data-mail-fallback]', form);
            if (link) {
              link.href = 'mailto:' + cfg('contacto.email') + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
              link.hidden = false;
            }
          }
          form.reset();
        } catch (err) {
          mensaje(box, 'No pudimos enviar el formulario. Escríbenos a ' + cfg('contacto.email') + ' y lo resolvemos.', 'err');
        } finally {
          if (btn) { btn.removeAttribute('aria-disabled'); btn.innerHTML = txt; }
        }
      });
    });
  }

  /* --- 7. Pedido (checkout) ---------------------------------------------- */
  async function enviarPedido(e) {
    e.preventDefault();
    const form = e.target;
    const box = $('#pedidoMsg');
    const det = $('#pedDetalles');
    if (det && !det.open) det.open = true;
    if (!validar(form)) { mensaje(box, 'Faltan datos de entrega.', 'err'); return; }

    const d = datos(form);
    const zona = Cart.zona(d.zona);
    const envio = Cart.envio(d.zona);
    const lineas = Cart.items.map((i) =>
      `• ${i.qty}× ${i.nombre}${i.tam ? ' (' + tamano(i.tam).nombre + ')' : ''}${i.meta ? ' — ' + i.meta : ''} — ${money(i.precio * i.qty)}`).join('\n');

    const resumen = [
      'NUEVO PEDIDO — ' + cfg('marca.nombre'),
      '',
      lineas,
      '',
      'Subtotal: ' + money(Cart.subtotal()),
      'Envío (' + zona.nombre + '): ' + (envio ? money(envio) : 'gratis'),
      'TOTAL: ' + money(Cart.total(d.zona)),
      '',
      'Entrega: ' + d.fecha + ' · ' + d.franja,
      'Nombre: ' + d.nombre,
      'Teléfono: ' + d.telefono,
      d.direccion ? 'Dirección: ' + d.direccion : '',
      d.dedicatoria ? 'Dedicatoria: ' + d.dedicatoria : ''
    ].filter(Boolean).join('\n');

    const payload = Object.assign({ origen: 'pedido', resumen, total: Cart.total(d.zona), items: Cart.items }, d);
    try {
      await enviar(cfg('endpoints.pedido', ''), payload);
    } catch (err) { /* seguimos con WhatsApp / correo */ }
    guardarLocal('ritual_pedidos', payload);

    const wa = cfg('contacto.whatsapp');
    const waLink = wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent(resumen) : '';
    const mailLink = 'mailto:' + cfg('contacto.email') + '?subject=' + encodeURIComponent('Pedido web · ' + d.nombre) + '&body=' + encodeURIComponent(resumen);

    $('#carritoCuerpo').innerHTML = `
      <div class="cart-empty">
        ${ICON.check}
        <h3 style="font-size:1.6rem;margin:.4rem 0">Pedido listo para confirmar</h3>
        <p class="small">Guardamos tu pedido. Envíanoslo por el canal que prefieras y lo confirmamos con el enlace de pago.</p>
      </div>
      <div class="stack" style="--gap:.6rem">
        ${waLink ? `<a class="btn btn--full" href="${waLink}" target="_blank" rel="noopener">Enviar por WhatsApp</a>` : ''}
        <a class="btn btn--ghost btn--full" href="${mailLink}">Enviar por correo</a>
        <button class="btn btn--ghost btn--full" type="button" id="copiarPedido">Copiar resumen</button>
        <pre style="white-space:pre-wrap;font:400 .8rem/1.5 var(--sans);background:var(--bone);padding:1rem;border-radius:4px;border:1px solid var(--line)">${esc(resumen)}</pre>
      </div>`;
    $('#carritoPie').innerHTML = `<button class="btn btn--ghost btn--full" type="button" id="pedidoNuevo">Seguir comprando</button>`;
    $('#copiarPedido').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(resumen); toast('Resumen copiado'); }
      catch (err) { toast('Copia el texto manualmente'); }
    });
    $('#pedidoNuevo').addEventListener('click', () => { Cart.clear(); cerrarCarrito(); });
  }

  /* --- 8. Interfaz -------------------------------------------------------- */
  function header() {
    const h = $('.header');
    if (!h) return;
    let last = window.scrollY;
    const upd = () => {
      const y = window.scrollY;
      h.classList.toggle('is-solid', y > 24);
      if (!$('.mobile-nav.is-open')) h.classList.toggle('is-hidden', y > 420 && y > last + 4);
      last = y;
    };
    upd();
    window.addEventListener('scroll', upd, { passive: true });

    const b = $('.burger'), mn = $('.mobile-nav');
    if (b && mn) {
      b.addEventListener('click', () => {
        const open = mn.classList.toggle('is-open');
        b.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('is-locked', open);
        h.classList.remove('is-hidden');
      });
      $$('a', mn).forEach((a) => a.addEventListener('click', () => {
        mn.classList.remove('is-open');
        b.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      }));
    }
  }

  function reveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  function marquee() {
    $$('.marquee').forEach((m) => {
      const t = $('.marquee__track', m);
      if (t && !t.dataset.cloned) { t.dataset.cloned = '1'; m.appendChild(t.cloneNode(true)); }
    });
  }

  function acordeones() {
    $$('.accordion').forEach((acc) => {
      const panelDe = (btn) => document.getElementById(btn.getAttribute('aria-controls'))
        || btn.nextElementSibling
        || (btn.parentElement && btn.parentElement.nextElementSibling);
      $$('.accordion__btn', acc).forEach((btn) => {
        if (btn.dataset.listo) return;      // el contenido puede pintarse después (FAQ)
        btn.dataset.listo = '1';
        btn.addEventListener('click', () => {
          const panel = panelDe(btn);
          if (!panel) return;
          const abierto = btn.getAttribute('aria-expanded') === 'true';
          $$('.accordion__btn', acc).forEach((o) => {
            const p2 = panelDe(o);
            if (o !== btn && p2) { o.setAttribute('aria-expanded', 'false'); p2.style.height = '0px'; }
          });
          btn.setAttribute('aria-expanded', String(!abierto));
          panel.style.height = abierto ? '0px' : panel.scrollHeight + 'px';
        });
      });
    });
  }

  function testimonios() {
    const box = $('#testimonios');
    if (!box || !window.TESTIMONIOS) return;
    box.innerHTML = `<div class="quotes">${window.TESTIMONIOS.map((t, i) => `
      <figure class="quote${i === 0 ? ' is-active' : ''}">
        <div class="quote__stars" aria-label="5 de 5">★★★★★</div>
        <blockquote>“${esc(t.texto)}”</blockquote>
        <figcaption>${esc(t.autor)} · ${esc(t.lugar)}</figcaption>
      </figure>`).join('')}</div>
      <div class="dots" role="tablist" aria-label="Testimonios">${window.TESTIMONIOS.map((t, i) =>
        `<button type="button" role="tab" aria-current="${i === 0}" aria-label="Testimonio ${i + 1}" data-q="${i}"></button>`).join('')}</div>`;

    const quotes = $$('.quote', box), dots = $$('.dots button', box);
    let i = 0, timer;
    const ir = (n) => {
      i = (n + quotes.length) % quotes.length;
      quotes.forEach((q, k) => q.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    };
    const auto = () => { timer = setInterval(() => ir(i + 1), 6500); };
    dots.forEach((d) => d.addEventListener('click', () => { clearInterval(timer); ir(Number(d.dataset.q)); auto(); }));
    box.addEventListener('mouseenter', () => clearInterval(timer));
    box.addEventListener('mouseleave', auto);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) auto();
  }

  function galeria() {
    const box = $('#galeria');
    if (!box || !window.GALERIA) return;
    box.innerHTML = window.GALERIA.map((g, i) =>
      `<button type="button" data-lb="${i}" aria-label="Ampliar fotografía ${i + 1}">
         <img src="${IMG(g)}" alt="Trabajo del taller ${i + 1}" loading="lazy" width="400" height="400">
       </button>`).join('');

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galería');
    lb.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Cerrar">${svgIcon('<path d="M18 6 6 18M6 6l12 12"/>')}</button>
      <img alt="" src="${IMG(window.GALERIA[0])}">
      <div class="lightbox__nav">
        <button type="button" data-lb-prev aria-label="Anterior">${svgIcon('<path d="M15 18l-6-6 6-6"/>')}</button>
        <button type="button" data-lb-next aria-label="Siguiente">${svgIcon('<path d="M9 6l6 6-6 6"/>')}</button>
      </div>`;
    document.body.appendChild(lb);
    const img = $('img', lb);
    let idx = 0;
    const abrir = (n) => {
      idx = (n + window.GALERIA.length) % window.GALERIA.length;
      img.src = IMG(window.GALERIA[idx]);
      img.alt = 'Trabajo del taller ' + (idx + 1);
      lb.classList.add('is-open');
      document.body.classList.add('is-locked');
    };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lb]');
      if (b) abrir(Number(b.dataset.lb));
    });
    lb.addEventListener('click', (e) => {
      if (e.target.closest('[data-lb-next]')) abrir(idx + 1);
      else if (e.target.closest('[data-lb-prev]')) abrir(idx - 1);
      else if (e.target === lb || e.target.closest('.lightbox__close')) {
        lb.classList.remove('is-open'); document.body.classList.remove('is-locked');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') abrir(idx + 1);
      if (e.key === 'ArrowLeft') abrir(idx - 1);
    });
  }

  function faq() {
    const box = $('#faq');
    if (!box || !window.FAQ) return;
    box.innerHTML = window.FAQ.map((f, i) => `
      <div class="accordion__item">
        <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-${i}">
          <span>${esc(f.q)}</span><span class="accordion__icon" aria-hidden="true"></span>
        </button></h3>
        <div class="accordion__panel" id="faq-${i}"><div class="accordion__inner"><p>${esc(f.a)}</p></div></div>
      </div>`).join('');
    acordeones();
  }


  /* --- 8b. Datos estructurados (SEO) ------------------------------------- */
  function datosEstructurados() {
    const base = 'https://' + cfg('marca.dominio');
    const dias = { 'Lunes a viernes': ['Mo', 'Tu', 'We', 'Th', 'Fr'], 'Sábado': ['Sa'], 'Domingo': ['Su'] };
    const horas = cfg('contacto.horario').map((h) => {
      const m = /(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/.exec(h.horas);
      if (!m || !dias[h.dia]) return null;
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: dias[h.dia], opens: m[1], closes: m[2] };
    }).filter(Boolean);

    const negocio = {
      '@context': 'https://schema.org',
      '@type': 'Florist',
      '@id': base + '/#negocio',
      name: cfg('marca.nombre'),
      description: (document.querySelector('meta[name=description]') || {}).content || '',
      url: base,
      image: base + '/assets/img/hero-principal.svg',
      email: cfg('contacto.email'),
      telephone: cfg('contacto.telefono'),
      priceRange: '$$',
      currenciesAccepted: cfg('moneda.codigo'),
      paymentAccepted: 'Tarjeta, Transferencia, Efectivo',
      address: {
        '@type': 'PostalAddress',
        streetAddress: cfg('contacto.direccion'),
        addressLocality: cfg('marca.ciudad'),
        postalCode: (String(cfg('contacto.ciudadPostal')).match(/\d{4,6}/) || [''])[0]
      },
      areaServed: cfg('marca.ciudad'),
      openingHoursSpecification: horas,
      sameAs: Object.values(cfg('social')).filter(Boolean)
    };

    const bloques = [negocio];

    if (window.PRODUCTOS && $('#gridTienda')) {
      bloques.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Catálogo ' + cfg('marca.nombre'),
        itemListElement: window.PRODUCTOS.map((p, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'Product',
            name: p.nombre,
            description: p.tagline,
            image: base + '/' + IMG(p.img),
            url: base + '/tienda.html?producto=' + p.id,
            brand: { '@type': 'Brand', name: cfg('marca.nombre') },
            offers: {
              '@type': 'Offer', price: p.precio, priceCurrency: cfg('moneda.codigo'),
              availability: 'https://schema.org/InStock', url: base + '/tienda.html?producto=' + p.id
            }
          }
        }))
      });
    }

    if (window.FAQ && $('#faq')) {
      bloques.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: window.FAQ.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      });
    }

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(bloques.length === 1 ? bloques[0] : bloques);
    document.head.appendChild(tag);
  }

  /* --- 9. Arranque -------------------------------------------------------- */
  function init() {
    hidratarConfig();
    header();
    montarCarrito();
    Cart.emit();
    conectarFormularios();
    marquee();
    acordeones();
    testimonios();
    galeria();
    faq();
    reveal();
    datosEstructurados();
    document.dispatchEvent(new CustomEvent('ritual:listo'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
