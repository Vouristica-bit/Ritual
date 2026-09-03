# Imágenes

Las imágenes que vienen en esta carpeta son **composiciones vectoriales (.svg)
generadas** con `tools/make_images.py`. Sostienen el diseño para que el sitio se
vea terminado desde el primer momento, pero están pensadas para reemplazarse por
las fotografías reales del taller.

## Cómo poner tus fotos (2 minutos)

1. Exporta tus fotos en **.jpg** (o `.webp`) con estos nombres y proporciones:

   | Archivo             | Proporción | Dónde se usa                        |
   |---------------------|-----------|--------------------------------------|
   | `hero-principal`    | 4:5       | Foto grande de la portada            |
   | `hero-detalle`      | 1:1       | Foto pequeña sobrepuesta en portada  |
   | `coleccion-ramos`   | 3:4       | Tarjeta de colección «Ramos»         |
   | `coleccion-plantas` | 3:4       | Tarjeta «Arreglos en jarrón»         |
   | `coleccion-secas`   | 3:4       | Tarjeta «Flor eterna»                |
   | `coleccion-eventos` | 3:4       | Tarjeta «Bodas y eventos»            |
   | `producto-01 … 12`  | 4:5       | Fotos de los 12 productos            |
   | `nosotros-taller`   | 16:10     | Página Nosotros                      |
   | `nosotros-manos`    | 3:4       | Página Nosotros / portada            |
   | `suscripcion`       | 16:10     | Bloque de suscripción                |
   | `galeria-01 … 06`   | 1:1       | Galería / Instagram                  |

2. Colócalas en esta carpeta (`assets/img/`).
3. Ejecuta en la raíz del proyecto:

   ```bash
   node tools/use-photos.mjs
   ```

   El script detecta las fotos y cambia todas las referencias `.svg` → `.jpg`
   (o `.webp`) en el HTML y en el JS. Si solo reemplazas algunas, las demás
   siguen usando el SVG sin romperse.

Para revertir: `node tools/use-photos.mjs --svg`

## Regenerar los SVG

```bash
python3 tools/make_images.py
```

Las paletas y las composiciones están al principio de ese archivo.
