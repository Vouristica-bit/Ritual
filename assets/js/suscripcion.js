/* =============================================================================
   CONFIGURADOR DE SUSCRIPCIÓN
   Calcula precio por entrega, total mensual, ahorro y arma la solicitud.
   ========================================================================== */
(function () {
  'use strict';
  const R = window.RITUAL;
  const { $, $$, money, esc, cfg, ICON, Cart, toast, tamano } = R;

  const F = () => window.FRECUENCIAS;
  const T = () => window.TAMANOS;
  const K = () => window.COMPROMISOS;

  function calcular(e) {
    const f = F().find((x) => x.id === e.frecuencia) || F()[1];
    const t = tamano(e.tamano);
    const k = K().find((x) => x.id === e.compromiso) || K()[0];
    const bruto = Math.round((f.base * t.factor) / 10) * 10;
    const porEntrega = Math.round((bruto * (1 - k.descuento)) / 10) * 10;
    const mensual = porEntrega * f.entregasMes;
    const ahorroMes = (bruto - porEntrega) * f.entregasMes;
    return { f, t, k, bruto, porEntrega, mensual, ahorroMes, total: porEntrega * f.entregasMes * k.meses };
  }

  function pintarPlanes() {
    const box = $('#planes-grid');
    if (!box) return;
    box.innerHTML = window.PLANES.map((p, i) => {
      const c = calcular({ frecuencia: p.frecuencia, tamano: p.tamano, compromiso: 'flex' });
      return `<article class="plan reveal reveal-d${i} ${p.destacado ? 'is-featured' : ''}">
        ${p.destacado ? '<span class="badge badge--clay" style="top:-.7rem;left:1.4rem">El más elegido</span>' : ''}
        <p class="eyebrow">${esc(p.nombre)}</p>
        <p class="plan__price">${money(c.mensual)}<small> / mes</small></p>
        <p class="muted small">${esc(p.resumen)}</p>
        <ul>${p.incluye.map((x) => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}</ul>
        <button class="btn ${p.destacado ? '' : 'btn--ghost'}" type="button"
          data-plan="${esc(p.id)}" data-frecuencia="${esc(p.frecuencia)}" data-tamano="${esc(p.tamano)}">
          Elegir ${esc(p.nombre)}
        </button>
      </article>`;
    }).join('');
  }

  function configurador() {
    const panel = $('#builder');
    if (!panel) return;

    const estado = { frecuencia: 'quincenal', tamano: 'clasico', compromiso: 'flex', zona: cfg('entrega.zonas')[0].id };

    panel.innerHTML = `
      <div class="builder__panel">
        <div>
          <p class="label" style="margin-bottom:.7rem">1 · ¿Cada cuánto quieres flores?</p>
          <div class="options options--3">
            ${F().map((f) => `<label class="option">
              <input type="radio" name="frec" value="${f.id}"${f.id === estado.frecuencia ? ' checked' : ''}>
              <span class="option__title">${esc(f.nombre)}</span>
              <span class="option__desc">${esc(f.desc)} · ${f.entregasMes} ${f.entregasMes === 1 ? 'entrega' : 'entregas'}/mes</span>
            </label>`).join('')}
          </div>
        </div>
        <div>
          <p class="label" style="margin-bottom:.7rem">2 · Tamaño de cada entrega</p>
          <div class="options options--3">
            ${T().map((t) => `<label class="option">
              <input type="radio" name="tam" value="${t.id}"${t.id === estado.tamano ? ' checked' : ''}>
              <span class="option__title">${esc(t.nombre)}</span>
              <span class="option__desc">${esc(t.desc)}</span>
            </label>`).join('')}
          </div>
        </div>
        <div>
          <p class="label" style="margin-bottom:.7rem">3 · Duración</p>
          <div class="options options--2">
            ${K().map((k) => `<label class="option">
              <input type="radio" name="comp" value="${k.id}"${k.id === estado.compromiso ? ' checked' : ''}>
              <span class="option__title">${esc(k.nombre)}${k.descuento ? `<span class="option__tag">−${Math.round(k.descuento * 100)} %</span>` : ''}</span>
              <span class="option__desc">${esc(k.desc)}</span>
            </label>`).join('')}
          </div>
        </div>
        <div>
          <p class="label" style="margin-bottom:.7rem">4 · Entrega</p>
          <div class="field"><label for="susZona" class="sr-only">Zona de entrega</label>
            <select id="susZona">${cfg('entrega.zonas').map((z) =>
              `<option value="${z.id}">${esc(z.nombre)}${z.costo ? ' · ' + money(z.costo) + ' por entrega' : ' · envío incluido'}</option>`).join('')}</select></div>
        </div>
      </div>

      <aside class="builder__summary" aria-live="polite">
        <p class="eyebrow" style="color:var(--blush)">Tu ritual</p>
        <h3 id="susTitulo">Ritual quincenal</h3>
        <div class="totals" style="gap:.55rem">
          <div class="summary-line"><span>Por entrega</span><strong id="susEntrega"></strong></div>
          <div class="summary-line"><span>Entregas al mes</span><strong id="susEntregas"></strong></div>
          <div class="summary-line"><span>Envío</span><strong id="susEnvio"></strong></div>
          <div class="totals__row totals__row--total"><span>Al mes</span><span class="price" id="susMensual"></span></div>
        </div>
        <p class="save-pill" id="susAhorro" hidden></p>
        <p class="small" style="color:#C6BCAE" id="susNota"></p>
        <button class="btn btn--light btn--full" type="button" id="susAdd">Empezar mi suscripción</button>
        <p class="small center" style="color:#9F958A">Pausa, salta una entrega o cancela cuando quieras.</p>
      </aside>`;

    function render() {
      const c = calcular(estado);
      const zona = Cart.zona(estado.zona);
      const envio = zona.costo || 0;
      const envioTexto = envio ? money(envio) + ' / entrega' : 'Incluido';
      $('#susTitulo').textContent = 'Ritual ' + c.f.nombre.toLowerCase() + ' · ' + c.t.nombre;
      $('#susEntrega').innerHTML = c.bruto !== c.porEntrega
        ? `<span class="strike">${money(c.bruto)}</span> ${money(c.porEntrega)}`
        : money(c.porEntrega);
      $('#susEntregas').textContent = c.f.entregasMes;
      $('#susEnvio').textContent = envioTexto;
      $('#susMensual').textContent = money(c.mensual + envio * c.f.entregasMes);
      const ah = $('#susAhorro');
      if (c.ahorroMes > 0) { ah.hidden = false; ah.textContent = 'Ahorras ' + money(c.ahorroMes) + ' al mes'; }
      else ah.hidden = true;
      $('#susNota').textContent = c.k.meses > 1
        ? 'Compromiso de ' + c.k.meses + ' meses · ' + money(c.total) + ' en total'
        : 'Sin compromiso: puedes cancelar antes de la siguiente entrega.';
    }

    panel.addEventListener('change', (e) => {
      const n = e.target.name;
      if (n === 'frec') estado.frecuencia = e.target.value;
      if (n === 'tam') estado.tamano = e.target.value;
      if (n === 'comp') estado.compromiso = e.target.value;
      if (e.target.id === 'susZona') estado.zona = e.target.value;
      render();
    });

    $('#susAdd').addEventListener('click', () => {
      const c = calcular(estado);
      Cart.add('suscripcion-' + estado.frecuencia + '-' + estado.tamano + '-' + estado.compromiso, null, 1, {
        tipo: 'suscripcion',
        nombre: 'Suscripción ' + c.f.nombre + ' · ' + c.t.nombre,
        precio: c.porEntrega,
        img: 'suscripcion',
        meta: c.f.entregasMes + ' entregas/mes · ' + c.k.nombre
      });
      toast('Suscripción añadida al carrito', ICON.spark);
      R.abrirCarrito();
    });

    /* Los botones de los planes destacados preconfiguran el builder */
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-plan]');
      if (!b) return;
      estado.frecuencia = b.dataset.frecuencia;
      estado.tamano = b.dataset.tamano;
      const rf = $('input[name=frec][value="' + estado.frecuencia + '"]');
      const rt = $('input[name=tam][value="' + estado.tamano + '"]');
      if (rf) rf.checked = true;
      if (rt) rt.checked = true;
      render();
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('Plan ' + b.textContent.replace('Elegir', '').trim() + ' cargado en el configurador');
    });

    render();
  }

  document.addEventListener('ritual:listo', () => {
    pintarPlanes();
    configurador();
  });
})();
