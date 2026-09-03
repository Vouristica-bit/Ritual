# Ritual by Celic — sitio web

Sitio completo para un estudio floral: catálogo con carrito, **suscripción de flores**
con configurador de precio, **alta al boletín**, formulario de contacto, página del
taller y checkout por WhatsApp o correo.

HTML, CSS y JavaScript planos: **sin build, sin dependencias, sin servidor**. Se sube
tal cual a GitHub Pages, Netlify, Vercel o a un hosting clásico por FTP.

---

## Contenido

| Página | Qué incluye |
|---|---|
| `index.html` | Portada: hero, colecciones, favoritos, bloque de suscripción, cómo funciona, historia, opiniones, galería con lightbox y alta al boletín |
| `tienda.html` | Catálogo de 12 productos con filtros por colección, buscador, orden y vista rápida con tamaños y complementos |
| `suscripcion.html` | 3 planes + **configurador** (frecuencia × tamaño × duración × zona) con precio y ahorro en vivo, y preguntas frecuentes |
| `nosotros.html` | Historia del taller, forma de trabajar, proceso del día y galería |
| `contacto.html` | Formulario con motivo/fecha/presupuesto, datos del taller, horario, mapa y aviso de privacidad |
| `404.html` | Página de error |

Funciona además: carrito persistente entre páginas (localStorage), cajón de carrito
con zona de entrega, fecha, franja horaria y dedicatoria, cálculo de envío con envío
gratis por monto, avisos tipo *toast*, menú móvil, animaciones al hacer scroll (que se
desactivan si el sistema pide menos movimiento), datos estructurados de Schema.org,
`sitemap.xml` y `robots.txt`.

---

## 1. Verlo en tu computadora

Ábrelo con cualquier servidor estático (abrir el archivo con doble clic también
funciona, pero un servidor evita avisos del navegador):

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

---

## 2. Personalizar el negocio — un solo archivo

Todo lo del negocio está en **`assets/js/config.js`**. Lo que escribas ahí se refleja
solo en las 5 páginas (nombre, ciudad, correo, teléfono, WhatsApp, dirección, horario,
redes, moneda, zonas de envío y monto de envío gratis).

```js
contacto: {
  email: 'hola@ritualbycelic.com',
  telefono: '+52 55 1234 5678',
  whatsapp: '5215512345678',   // solo dígitos con código de país; '' oculta los botones
  ...
}
moneda: { codigo: 'MXN', locale: 'es-MX', decimales: 0 },   // USD, EUR, COP…
entrega: { avisoEnvioGratis: 1200, zonas: [ … ] }
```

Los campos marcados con `// ⚠️` en ese archivo son datos de ejemplo. **Cámbialos antes
de publicar.**

### Productos y precios

En **`assets/js/data.js`**. Añadir un producto es añadir un objeto a `PRODUCTOS`:
aparece automáticamente en la tienda, en los filtros, en el buscador, en el carrito y
en los datos estructurados de Google.

```js
{
  id: 'mi-ramo', nombre: 'Mi Ramo', coleccion: 'ramos', precio: 890,
  img: 'producto-01', badge: 'Nuevo', nuevo: true, orden: 13,
  tagline: 'Una línea de descripción',
  desc: 'Texto largo de la ficha…',
  incluye: ['12–15 tallos', 'Papel de algodón'],
  cuidado: 'Cómo cuidarlo.', duracion: '7–10 días'
}
```

En el mismo archivo están los tamaños (`TAMANOS`, con su multiplicador de precio),
los complementos (`EXTRAS`), los planes y frecuencias de suscripción, los descuentos
por duración, las opiniones, las preguntas frecuentes y la galería.

---

## 3. Que los formularios lleguen a tu correo

**Ya funcionan sin configurar nada**: validan, guardan el envío en el navegador y
ofrecen enviarlo por WhatsApp o correo. Para recibirlos en tu bandeja, pega un
endpoint en `config.js` → `endpoints`:

```js
endpoints: {
  newsletter:  'https://formspree.io/f/xxxxxxxx',
  contacto:    'https://formspree.io/f/xxxxxxxx',
  pedido:      'https://formspree.io/f/xxxxxxxx',
  suscripcion: 'https://formspree.io/f/xxxxxxxx'
}
```

Sirve cualquier servicio que acepte `POST` con JSON: Formspree, Basin, Getform,
Netlify Forms, un Google Apps Script o tu propia API. Sin endpoint no se pierde nada:
el pedido se arma igual y se envía por WhatsApp/correo con el resumen completo.

**Cobros:** el checkout genera el pedido y lo manda por WhatsApp o correo para
confirmar y enviar el enlace de pago. Si quieres cobrar en línea, el punto de
enganche es `enviarPedido()` en `assets/js/core.js` (ahí tienes el carrito, los
totales y los datos de entrega listos para pasárselos a Stripe, Mercado Pago o Conekta).

---

## 4. Poner tus fotografías

Las imágenes que vienen son composiciones vectoriales generadas
(`tools/make_images.py`) para que el sitio se vea terminado desde el primer momento.
Para usar tus fotos: guárdalas en `assets/img/` con los nombres de la tabla de
[`assets/img/README.md`](assets/img/README.md) y ejecuta:

```bash
node tools/use-photos.mjs        # detecta tus .jpg/.webp y actualiza todas las rutas
node tools/use-photos.mjs --svg  # vuelve a las imágenes generadas
```

Solo cambia las rutas de los archivos que existan, así que nunca deja una imagen rota.

---

## 5. Publicar

**GitHub Pages** — Settings → Pages → Source: `Deploy from a branch`, rama y carpeta
`/ (root)`. Queda en `https://usuario.github.io/repo/`.

**Netlify / Vercel** — arrastra la carpeta o conecta el repositorio. No hay comando de
build; el directorio a publicar es la raíz.

**Hosting clásico** — sube todos los archivos por FTP a `public_html`.

**Dominio propio (`ritualbycelic.com`)** — apunta el DNS a tu hosting y después:

1. reemplaza `https://ritualbycelic.com/` en las etiquetas `canonical` y `og:url` de
   las 5 páginas si tu dominio es otro;
2. actualiza `sitemap.xml` y `robots.txt`;
3. ajusta `marca.dominio` en `config.js`.

---

## 6. Antes de publicar (lista de verificación)

- [ ] Datos reales en `config.js` (correo, teléfono, WhatsApp, dirección, horario, redes)
- [ ] Moneda y precios revisados
- [ ] **Opiniones**: `TESTIMONIOS` en `data.js` trae textos de ejemplo → pon reseñas reales
- [ ] **Aviso de privacidad**: el texto de `contacto.html#legal` es de ejemplo → pon el tuyo
- [ ] Fotografías propias (paso 4) y `og:image` apuntando a una foto real
- [ ] Endpoints de formularios conectados y probados
- [ ] Zonas y costos de envío correctos
- [ ] `sitemap.xml` con tu dominio

---

## Estructura

```
index.html  tienda.html  suscripcion.html  nosotros.html  contacto.html  404.html
robots.txt  sitemap.xml
assets/
  css/styles.css        sistema de diseño (tokens, componentes, responsive)
  js/config.js          ⚙️ datos del negocio  ← edita esto
  js/data.js            catálogo, planes, opiniones, preguntas
  js/core.js            carrito, cajón, formularios, checkout, interfaz, SEO
  js/shop.js            tarjetas, filtros, buscador, vista rápida
  js/suscripcion.js     planes y configurador de suscripción
  img/                  imágenes (ver assets/img/README.md)
tools/
  make_images.py        regenera las imágenes vectoriales
  use-photos.mjs        cambia entre imágenes generadas y tus fotos
```

## Notas técnicas

- Tipografías Cormorant Garamond + Jost desde Google Fonts, con pila de respaldo del
  sistema si no cargan.
- Accesibilidad: navegación por teclado, `aria-*` en menú, carrito, modal y acordeones,
  enlace para saltar al contenido, foco visible y respeto a `prefers-reduced-motion`.
- Sin dependencias externas: el peso total de JS propio es de unos 40 KB sin comprimir.
- Probado en Chromium (escritorio 1440 px y móvil 390 px): carrito, filtros, buscador,
  vista rápida, configurador, formularios, lightbox y menú móvil.

## Sobre el sitio de referencia

`ritualbycelic.com` está bloqueado por la política de red del entorno donde se
construyó este proyecto, así que no fue posible leer su HTML ni descargar sus
fotografías. El diseño reproduce el lenguaje visual de un estudio floral editorial
(serif alta, paleta hueso/rubor/terracota/salvia, retícula amplia, fotografía a
sangre) y toda la identidad —textos, colores, tipografías e imágenes— es
reemplazable desde los archivos indicados arriba.
