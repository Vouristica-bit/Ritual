#!/usr/bin/env node
/**
 * Cambia las referencias de imagen entre los SVG incluidos y tus fotos reales.
 *
 *   node tools/use-photos.mjs          → usa las fotos que encuentre en assets/img
 *   node tools/use-photos.mjs --svg    → vuelve a los SVG generados
 *
 * Solo reescribe rutas cuyo archivo destino exista realmente, así que nunca
 * deja una imagen rota.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const imgDir = join(raiz, 'assets', 'img');
const volver = process.argv.includes('--svg');
const archivos = ['index.html', 'tienda.html', 'suscripcion.html', 'nosotros.html', 'contacto.html', '404.html',
                  'assets/js/core.js', 'assets/js/data.js', 'assets/js/shop.js'];

const enDisco = readdirSync(imgDir);
const foto = {};              // nombre base -> extensión de la foto real
for (const f of enDisco) {
  const m = /^(.+)\.(jpe?g|webp|png|avif)$/i.exec(f);
  if (m) foto[m[1]] = m[2].toLowerCase();
}

let cambios = 0;
for (const rel of archivos) {
  const ruta = join(raiz, rel);
  if (!existsSync(ruta)) continue;
  let txt = readFileSync(ruta, 'utf8');
  const antes = txt;

  txt = txt.replace(/assets\/img\/([a-z0-9-]+)\.(svg|jpe?g|webp|png|avif)/gi, (m, base, ext) => {
    if (base === 'favicon') return m;
    if (volver) return existsSync(join(imgDir, base + '.svg')) ? `assets/img/${base}.svg` : m;
    return foto[base] ? `assets/img/${base}.${foto[base]}` : m;
  });

  // extensión global usada por los productos (assets/js/core.js → IMG())
  if (rel.endsWith('core.js')) {
    const ext = volver ? 'svg' : (foto['producto-01'] || 'svg');
    txt = txt.replace(/window\.IMG_EXT \|\| '[a-z]+'/, `window.IMG_EXT || '${ext}'`);
  }

  if (txt !== antes) { writeFileSync(ruta, txt); cambios++; console.log('actualizado', rel); }
}

const n = Object.keys(foto).length;
console.log(volver
  ? `Listo: referencias devueltas a los SVG (${cambios} archivos).`
  : `Listo: ${n} foto(s) detectada(s), ${cambios} archivo(s) actualizado(s).`);
if (!volver && n === 0) console.log('No encontré fotos .jpg/.webp/.png en assets/img — nada que cambiar.');
