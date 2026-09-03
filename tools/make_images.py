#!/usr/bin/env python3
"""Genera la biblioteca de imagenes vectoriales (placeholders editoriales) del sitio.

Uso:  python3 tools/make_images.py
Salida: assets/img/*.svg

Cada archivo es una composicion floral generada de forma determinista (semilla fija),
pensada para sostener el diseno mientras se colocan las fotografias reales.
Ver assets/img/README.md para el reemplazo por fotos.
"""
import math
import os
import random

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")

PALETTES = {
    "blush": dict(bg1="#F6EDE7", bg2="#EAD6CD", petal=["#E9B7AA", "#DCA093", "#C98476", "#F3D5CC"],
                  heart="#B9705B", leaf=["#8E9F84", "#6F8266", "#A8B79C"], vase="#E4D7C7"),
    "terracota": dict(bg1="#F5E7DE", bg2="#E3C4B2", petal=["#D08C6D", "#B9705B", "#E0A985", "#F0CDB4"],
                      heart="#8C4A38", leaf=["#87977C", "#5F7157", "#AEB9A2"], vase="#D9C6B2"),
    "bruma": dict(bg1="#F4F3EE", bg2="#DCDED4", petal=["#FBF8F2", "#EDE7DC", "#DCD3C4", "#FFFFFF"],
                  heart="#C9A961", leaf=["#93A489", "#6C7E64", "#B4C0A8"], vase="#E7E4DA"),
    "ambar": dict(bg1="#F7EEDD", bg2="#EBD6AE", petal=["#E8B86A", "#D9A24E", "#F2D49B", "#C98A3C"],
                  heart="#8A5A22", leaf=["#8B9A72", "#66754F", "#AFBB98"], vase="#E5D5B8"),
    "lavanda": dict(bg1="#F2EFF3", bg2="#DAD3E0", petal=["#C9BBD6", "#B0A0C4", "#E3DAEC", "#9A88B4"],
                    heart="#6E5C86", leaf=["#8FA08D", "#68796A", "#B0BCAE"], vase="#E0DAE2"),
    "eucalipto": dict(bg1="#EFF1EB", bg2="#D3DACD", petal=["#E9EDE3", "#D7DFCE", "#C3CDB8", "#F5F7F1"],
                      heart="#7C8B6C", leaf=["#7E9077", "#5A6C55", "#A3B39A"], vase="#DCE1D5"),
}


def defs(pid, p, w, h):
    return f"""<defs>
<linearGradient id="bg{pid}" x1="0" y1="0" x2="0.35" y2="1">
  <stop offset="0" stop-color="{p['bg1']}"/><stop offset="1" stop-color="{p['bg2']}"/>
</linearGradient>
<radialGradient id="glow{pid}" cx="0.5" cy="0.22" r="0.75">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.75"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vig{pid}" cx="0.5" cy="0.45" r="0.78">
  <stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#2B241F" stop-opacity="0.26"/>
</radialGradient>
<filter id="grain{pid}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="{pid}" result="n"/>
  <feColorMatrix type="saturate" values="0" in="n" result="m"/>
  <feComponentTransfer in="m"><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
</filter>
<filter id="soft{pid}" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur stdDeviation="{max(w, h) * 0.02:.1f}"/>
</filter>
<filter id="shadow{pid}" x="-30%" y="-30%" width="160%" height="180%">
  <feDropShadow dx="0" dy="{h * 0.012:.1f}" stdDeviation="{h * 0.018:.1f}" flood-color="#4A3B33" flood-opacity="0.20"/>
</filter>
</defs>"""


def mist(rnd, p, w, h, pid, n=5):
    out = [f'<g filter="url(#soft{pid})" opacity="0.55">']
    for _ in range(n):
        cx, cy = rnd.uniform(0, w), rnd.uniform(0, h * 0.9)
        r = rnd.uniform(w * 0.12, w * 0.3)
        col = rnd.choice(p["petal"] + p["leaf"])
        out.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r:.0f}" fill="{col}" opacity="{rnd.uniform(0.10, 0.26):.2f}"/>')
    out.append("</g>")
    return "".join(out)


def leaf(x, y, ang, ln, wd, col, op=1.0):
    return (f'<path d="M0 0 C {wd:.1f} {-ln*0.32:.1f}, {wd:.1f} {-ln*0.68:.1f}, 0 {-ln:.1f} '
            f'C {-wd:.1f} {-ln*0.68:.1f}, {-wd:.1f} {-ln*0.32:.1f}, 0 0 Z" fill="{col}" opacity="{op:.2f}" '
            f'transform="translate({x:.1f} {y:.1f}) rotate({ang:.1f})"/>')


def bloom(rnd, p, x, y, r, kind):
    g = [f'<g transform="translate({x:.1f} {y:.1f})">']
    if kind == "peony":
        for layer, (rr, k) in enumerate(((1.0, 7), (0.72, 6), (0.45, 5))):
            for i in range(k):
                a = 360 * i / k + rnd.uniform(-14, 14) + layer * 18
                d = r * rr * 0.52
                cx, cy = d * math.cos(math.radians(a)), d * math.sin(math.radians(a))
                col = p["petal"][layer % len(p["petal"])]
                g.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r*rr*0.56:.1f}" ry="{r*rr*0.46:.1f}" '
                         f'fill="{col}" opacity="{0.9 - layer*0.06:.2f}" transform="rotate({a:.0f} {cx:.1f} {cy:.1f})"/>')
        g.append(f'<circle r="{r*0.16:.1f}" fill="{p["heart"]}" opacity="0.55"/>')
    elif kind == "daisy":
        k = 9
        for i in range(k):
            a = 360 * i / k + rnd.uniform(-5, 5)
            g.append(f'<ellipse cx="0" cy="{-r*0.6:.1f}" rx="{r*0.22:.1f}" ry="{r*0.6:.1f}" '
                     f'fill="{p["petal"][i % 2]}" opacity="0.95" transform="rotate({a:.0f})"/>')
        g.append(f'<circle r="{r*0.26:.1f}" fill="{p["heart"]}"/>')
    elif kind == "rose":
        for i, s in enumerate((1.0, 0.78, 0.56, 0.34)):
            col = p["petal"][i % len(p["petal"])]
            g.append(f'<circle r="{r*s:.1f}" fill="{col}" opacity="{0.95 - i*0.05:.2f}"/>')
        g.append(f'<path d="M0 {-r*0.3:.1f} A {r*0.3:.1f} {r*0.3:.1f} 0 1 1 {-r*0.24:.1f} {r*0.18:.1f}" '
                 f'fill="none" stroke="{p["heart"]}" stroke-opacity="0.35" stroke-width="{max(1, r*0.07):.1f}"/>')
    elif kind == "tulip":
        for a, sc in ((-24, 0.9), (0, 1.0), (24, 0.9)):
            g.append(f'<path d="M0 0 C {-r*0.5:.1f} {-r*0.4:.1f}, {-r*0.42:.1f} {-r*1.1:.1f}, 0 {-r*1.25*sc:.1f} '
                     f'C {r*0.42:.1f} {-r*1.1:.1f}, {r*0.5:.1f} {-r*0.4:.1f}, 0 0 Z" '
                     f'fill="{rnd.choice(p["petal"])}" opacity="0.94" transform="rotate({a})"/>')
    else:  # filler
        for _ in range(rnd.randint(7, 11)):
            a, d = rnd.uniform(0, 360), rnd.uniform(0, r)
            g.append(f'<circle cx="{d*math.cos(math.radians(a)):.1f}" cy="{d*math.sin(math.radians(a)):.1f}" '
                     f'r="{rnd.uniform(r*0.14, r*0.28):.1f}" fill="{rnd.choice(p["petal"])}" opacity="0.9"/>')
    g.append("</g>")
    return "".join(g)


def arrangement(rnd, p, w, h, pid, base_y, spread, top, vessel):
    """Tallos + follaje + flores saliendo de un jarron o papel."""
    out = []
    bx = w * 0.5
    stems = []
    n = rnd.randint(9, 12)
    for i in range(n):
        t = (i + 0.5) / n
        tip_x = bx + (t - 0.5) * spread * 2
        tip_y = base_y - (top + rnd.uniform(-h * 0.05, h * 0.05)) * (1 - abs(t - 0.5) * 0.55)
        stems.append((tip_x, tip_y))
    # tallos
    for tx, ty in stems:
        cx = (bx + tx) / 2 + rnd.uniform(-w * 0.04, w * 0.04)
        out.append(f'<path d="M{bx:.1f} {base_y:.1f} Q {cx:.1f} {(base_y+ty)/2:.1f} {tx:.1f} {ty:.1f}" '
                   f'fill="none" stroke="{rnd.choice(p["leaf"])}" stroke-width="{rnd.uniform(2.2, 4.2):.1f}" '
                   f'stroke-linecap="round" opacity="0.85"/>')
    # follaje
    for tx, ty in stems:
        for _ in range(rnd.randint(2, 4)):
            k = rnd.uniform(0.25, 0.85)
            lx, ly = bx + (tx - bx) * k, base_y + (ty - base_y) * k
            ang = rnd.choice((-1, 1)) * rnd.uniform(35, 85)
            out.append(leaf(lx, ly, ang, rnd.uniform(h * 0.05, h * 0.11), rnd.uniform(w * 0.012, w * 0.028),
                            rnd.choice(p["leaf"]), rnd.uniform(0.7, 0.95)))
    # vasija
    if vessel == "vase":
        vw, vh = w * 0.17, h * 0.2
        out.append(f'<g filter="url(#shadow{pid})"><path d="M{bx-vw:.1f} {base_y-vh*0.1:.1f} '
                   f'C {bx-vw*0.75:.1f} {base_y+vh*0.75:.1f}, {bx-vw*0.6:.1f} {base_y+vh:.1f}, {bx:.1f} {base_y+vh:.1f} '
                   f'C {bx+vw*0.6:.1f} {base_y+vh:.1f}, {bx+vw*0.75:.1f} {base_y+vh*0.75:.1f}, {bx+vw:.1f} {base_y-vh*0.1:.1f} Z" '
                   f'fill="{p["vase"]}"/></g>')
        out.append(f'<ellipse cx="{bx:.1f}" cy="{base_y-vh*0.1:.1f}" rx="{vw:.1f}" ry="{vw*0.22:.1f}" fill="#000" opacity="0.10"/>')
        out.append(f'<ellipse cx="{bx:.1f}" cy="{base_y+vh:.1f}" rx="{vw*1.35:.1f}" ry="{vw*0.16:.1f}" '
                   f'fill="#4A3B33" opacity="0.13" filter="url(#soft{pid})"/>')
    elif vessel == "wrap":
        ww = w * 0.24
        out.append(f'<g filter="url(#shadow{pid})"><path d="M{bx-ww:.1f} {base_y-h*0.14:.1f} '
                   f'Q {bx:.1f} {base_y-h*0.10:.1f} {bx+ww:.1f} {base_y-h*0.14:.1f} '
                   f'L {bx+ww*0.14:.1f} {base_y+h*0.20:.1f} '
                   f'Q {bx:.1f} {base_y+h*0.22:.1f} {bx-ww*0.14:.1f} {base_y+h*0.20:.1f} Z" '
                   f'fill="#FBF6EE" opacity="0.97"/></g>')
        out.append(f'<path d="M{bx-ww*0.62:.1f} {base_y+h*0.03:.1f} Q {bx:.1f} {base_y+h*0.075:.1f} {bx+ww*0.62:.1f} {base_y+h*0.03:.1f}" '
                   f'fill="none" stroke="{p["heart"]}" stroke-width="{h*0.006:.1f}" opacity="0.45" stroke-linecap="round"/>')
        out.append(f'<path d="M{bx-ww*0.55:.1f} {base_y-h*0.11:.1f} L {bx-ww*0.06:.1f} {base_y+h*0.19:.1f}" '
                   f'fill="none" stroke="#E6DBCB" stroke-width="{h*0.004:.1f}" opacity="0.8"/>')
    # flores
    kinds = ["peony", "rose", "daisy", "tulip", "filler"]
    rnd.shuffle(stems)
    for i, (tx, ty) in enumerate(stems):
        kind = kinds[i % len(kinds)] if i > 1 else rnd.choice(("peony", "rose"))
        out.append(bloom(rnd, p, tx, ty, rnd.uniform(h * 0.055, h * 0.095), kind))
    return "".join(out)


def compose(name, w, h, pal, seed, vessel="wrap", crop=0.86):
    p = PALETTES[pal]
    rnd = random.Random(seed)
    pid = seed
    body = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-label="Composicion floral {name}" preserveAspectRatio="xMidYMid slice">',
            defs(pid, p, w, h),
            f'<rect width="{w}" height="{h}" fill="url(#bg{pid})"/>',
            mist(rnd, p, w, h, pid),
            f'<rect width="{w}" height="{h}" fill="url(#glow{pid})"/>']
    body.append(arrangement(rnd, p, w, h, pid, h * crop, w * 0.30, h * 0.58, vessel))
    body.append(f'<rect width="{w}" height="{h}" fill="url(#vig{pid})"/>')
    body.append(f'<rect width="{w}" height="{h}" filter="url(#grain{pid})" opacity="0.10"/>')
    body.append("</svg>")
    with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
        f.write("".join(body))
    return name


SPECS = [
    # nombre,            w,    h,   paleta,      semilla, vasija
    ("hero-principal",   1400, 1750, "blush",     11, "wrap"),
    ("hero-detalle",     900,  1100, "bruma",     12, "vase"),
    ("hero-taller",      900,  700,  "eucalipto", 13, "vase"),
    ("coleccion-ramos",  1000, 1250, "blush",     21, "wrap"),
    ("coleccion-plantas",1000, 1250, "eucalipto", 22, "vase"),
    ("coleccion-secas",  1000, 1250, "ambar",     23, "vase"),
    ("coleccion-eventos",1000, 1250, "lavanda",   24, "wrap"),
    ("producto-01",      1000, 1200, "blush",     31, "wrap"),
    ("producto-02",      1000, 1200, "bruma",     32, "wrap"),
    ("producto-03",      1000, 1200, "terracota", 33, "vase"),
    ("producto-04",      1000, 1200, "ambar",     34, "wrap"),
    ("producto-05",      1000, 1200, "lavanda",   35, "vase"),
    ("producto-06",      1000, 1200, "eucalipto", 36, "vase"),
    ("producto-07",      1000, 1200, "blush",     37, "vase"),
    ("producto-08",      1000, 1200, "terracota", 38, "wrap"),
    ("producto-09",      1000, 1200, "bruma",     39, "vase"),
    ("producto-10",      1000, 1200, "ambar",     40, "vase"),
    ("producto-11",      1000, 1200, "lavanda",   41, "wrap"),
    ("producto-12",      1000, 1200, "eucalipto", 42, "wrap"),
    ("nosotros-taller",  1200, 900,  "bruma",     51, "vase"),
    ("nosotros-manos",   900,  1100, "blush",     52, "wrap"),
    ("suscripcion",      1300, 950,  "blush",     61, "vase"),
    ("galeria-01",       800,  800,  "blush",     71, "wrap"),
    ("galeria-02",       800,  800,  "eucalipto", 72, "vase"),
    ("galeria-03",       800,  800,  "ambar",     73, "vase"),
    ("galeria-04",       800,  800,  "lavanda",   74, "wrap"),
    ("galeria-05",       800,  800,  "terracota", 75, "vase"),
    ("galeria-06",       800,  800,  "bruma",     76, "vase"),
]

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, w, h, pal, seed, vessel in SPECS:
        compose(name, w, h, pal, seed, vessel)
    print(f"{len(SPECS)} imagenes generadas en {OUT}")
