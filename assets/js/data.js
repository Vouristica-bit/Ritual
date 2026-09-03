/* =============================================================================
   CATÁLOGO Y CONTENIDO
   Añadir un producto = añadir un objeto a PRODUCTOS (aparece solo en la tienda,
   en los filtros, en el buscador, en el carrito y en los datos estructurados).
   Las imágenes viven en assets/img/ — ver assets/img/README.md para usar fotos.
   ========================================================================== */

window.COLECCIONES = [
  { id: 'ramos',    nombre: 'Ramos de temporada', desc: 'Envueltos a mano en papel',        img: 'coleccion-ramos'    },
  { id: 'arreglos', nombre: 'Arreglos en jarrón', desc: 'Listos para colocar',              img: 'coleccion-plantas'  },
  { id: 'eternas',  nombre: 'Flor eterna',        desc: 'Preservada, dura meses',           img: 'coleccion-secas'    },
  { id: 'eventos',  nombre: 'Bodas y eventos',    desc: 'Proyectos a medida',               img: 'coleccion-eventos', esCta: true, href: 'contacto.html' }
];

window.TAMANOS = [
  { id: 'petit',   nombre: 'Petit',   factor: 0.75, desc: 'Detalle, escritorio o mesa de noche' },
  { id: 'clasico', nombre: 'Clásico', factor: 1,    desc: 'Nuestro tamaño más pedido' },
  { id: 'lujo',    nombre: 'Lujo',    factor: 1.55, desc: 'El doble de tallos, presencia total' }
];

window.PRODUCTOS = [
  {
    id: 'ritual-blush', nombre: 'Ritual Blush', coleccion: 'ramos', precio: 890, img: 'producto-01',
    badge: 'Más vendido', best: true, orden: 1,
    tagline: 'Peonías, rosa garden y lisianthus en tonos rubor',
    desc: 'El ramo con el que empezó todo. Una composición suave y luminosa que mezcla peonías de temporada con rosa garden, lisianthus y un follaje ligero de eucalipto. Envuelto a mano en papel de algodón y sellado con nuestro lazo de lino.',
    incluye: ['12–15 tallos de temporada', 'Papel de algodón y lazo de lino', 'Tarjeta escrita a mano', 'Sobre de alimento floral'],
    cuidado: 'Corta 2 cm de los tallos en diagonal y cambia el agua cada 48 horas. Mantén el ramo lejos del sol directo y de fuentes de calor.',
    duracion: '7–10 días'
  },
  {
    id: 'bruma', nombre: 'Bruma', coleccion: 'ramos', precio: 950, img: 'producto-02', orden: 2,
    tagline: 'Blancos, cremas y verdes en clave minimalista',
    desc: 'Un ramo monocromático de rosa avalanche, ranúnculo blanco y astrantia, contrastado con hojas de olivo. Discreto, elegante y perfecto para oficinas, agradecimientos y condolencias.',
    incluye: ['12–15 tallos de temporada', 'Papel kraft natural', 'Tarjeta escrita a mano', 'Sobre de alimento floral'],
    cuidado: 'Retira las hojas que queden bajo el agua y recorta los tallos cada tres días para prolongar la vida del ramo.',
    duracion: '7–10 días'
  },
  {
    id: 'anfora-terracota', nombre: 'Ánfora Terracota', coleccion: 'arreglos', precio: 1290, img: 'producto-03',
    badge: 'Con jarrón', orden: 3,
    tagline: 'Dalias y clavel en cerámica artesanal',
    desc: 'Arreglo cálido montado en una ánfora de cerámica hecha a mano por un taller local. Dalias, clavel antiguo y craspedia sobre una base de follaje. Llega listo para colocar: sin tijeras, sin agua, sin prisa.',
    incluye: ['Ánfora de cerámica artesanal (18 cm)', '18–22 tallos de temporada', 'Espuma hidratada y musgo', 'Tarjeta escrita a mano'],
    cuidado: 'Añade un chorrito de agua cada dos días directamente en la base. El jarrón es reutilizable y apto para lavado a mano.',
    duracion: '8–12 días'
  },
  {
    id: 'sol-de-miel', nombre: 'Sol de Miel', coleccion: 'ramos', precio: 820, img: 'producto-04',
    badge: 'Nuevo', nuevo: true, orden: 4,
    tagline: 'Ámbar, mostaza y ocre para días grises',
    desc: 'Girasol enano, rosa toffee, craspedia y solidago. Un ramo con energía de mediodía, pensado para cumpleaños, buenas noticias y mudanzas nuevas.',
    incluye: ['12–14 tallos de temporada', 'Papel de algodón tono hueso', 'Tarjeta escrita a mano', 'Sobre de alimento floral'],
    cuidado: 'Usa agua a temperatura ambiente y cámbiala cada 48 horas. Retira los pétalos externos cuando empiecen a marcarse.',
    duracion: '7–12 días'
  },
  {
    id: 'hora-violeta', nombre: 'Hora Violeta', coleccion: 'arreglos', precio: 1150, img: 'producto-05', orden: 5,
    tagline: 'Lisianthus, matthiola y lavanda en jarrón de vidrio',
    desc: 'Nuestra composición más romántica: lisianthus doble, matthiola perfumada y ramas de lavanda seca en un jarrón de vidrio soplado. Perfume suave y presencia discreta.',
    incluye: ['Jarrón de vidrio soplado (20 cm)', '16–20 tallos de temporada', 'Agua tratada y alimento floral', 'Tarjeta escrita a mano'],
    cuidado: 'Cambia el agua cada tres días y mantén el arreglo en una zona ventilada, sin sol directo.',
    duracion: '8–12 días'
  },
  {
    id: 'verde-ritual', nombre: 'Verde Ritual', coleccion: 'eternas', precio: 690, img: 'producto-06', orden: 6,
    tagline: 'Eucalipto y ruscus preservados',
    desc: 'Follaje preservado que conserva su textura y color durante meses. Cero mantenimiento: ni agua ni luz. Ideal para recibidores, baños y regalos que viajan.',
    incluye: ['Maceta de cerámica mate (16 cm)', 'Eucalipto, ruscus y avena preservados', 'Base de musgo natural', 'Tarjeta escrita a mano'],
    cuidado: 'No riegues. Sacude el polvo con un pincel suave cada par de semanas y evita la humedad extrema.',
    duracion: '12–18 meses'
  },
  {
    id: 'rubor', nombre: 'Rubor', coleccion: 'arreglos', precio: 1090, img: 'producto-07', orden: 7,
    tagline: 'Rosa garden y ranúnculo en copa baja',
    desc: 'Una copa baja y compacta para mesas de centro y comedores: rosa garden, ranúnculo, hipérico y eucalipto baby. Se ve bien desde todos los ángulos.',
    incluye: ['Copa de cerámica esmaltada (14 cm)', '14–18 tallos de temporada', 'Espuma hidratada', 'Tarjeta escrita a mano'],
    cuidado: 'Riega la base con medio vaso de agua cada dos días. Retira las flores marchitas para que el resto abra mejor.',
    duracion: '7–10 días'
  },
  {
    id: 'campo-abierto', nombre: 'Campo Abierto', coleccion: 'ramos', precio: 780, img: 'producto-08', orden: 8,
    tagline: 'Silvestre, suelto y generoso',
    desc: 'El ramo que parece recién cortado del campo: flor de zanahoria, escabiosa, amaranto y espigas. Sin simetría, con mucho movimiento.',
    incluye: ['15–18 tallos de temporada', 'Papel kraft y cordel de yute', 'Tarjeta escrita a mano', 'Sobre de alimento floral'],
    cuidado: 'Es un ramo de flor delicada: manténlo fresco y cambia el agua a diario para que dure más.',
    duracion: '5–8 días'
  },
  {
    id: 'nube', nombre: 'Nube', coleccion: 'arreglos', precio: 1390, img: 'producto-09',
    badge: 'Edición limitada', orden: 9,
    tagline: 'Hortensia, rosa y algodón en blanco absoluto',
    desc: 'Volumen y silencio. Hortensia blanca, rosa avalanche y ramas de algodón en un jarrón de cerámica alta. Nuestro arreglo favorito para inauguraciones y regalos corporativos.',
    incluye: ['Jarrón de cerámica alta (24 cm)', '20–26 tallos de temporada', 'Agua tratada y alimento floral', 'Tarjeta escrita a mano'],
    cuidado: 'La hortensia bebe mucho: revisa el nivel de agua cada día y rocía los pétalos con un atomizador.',
    duracion: '8–14 días'
  },
  {
    id: 'ambar-eterno', nombre: 'Ámbar Eterno', coleccion: 'eternas', precio: 1490, img: 'producto-10',
    badge: 'Dura 1 año', best: true, orden: 10,
    tagline: 'Flor preservada en tonos miel y trigo',
    desc: 'Composición de flor preservada y seca —helichrysum, avena, lagurus y rosa preservada— montada en jarrón de cerámica. Un regalo que no hay que cuidar y no se marchita.',
    incluye: ['Jarrón de cerámica mate (18 cm)', 'Flor preservada y seca seleccionada', 'Base de musgo natural', 'Tarjeta escrita a mano'],
    cuidado: 'Mantén la composición seca y lejos de la luz solar directa para conservar el color.',
    duracion: '12–24 meses'
  },
  {
    id: 'primer-beso', nombre: 'Primer Beso', coleccion: 'ramos', precio: 690, img: 'producto-11', orden: 11,
    tagline: 'Un ramo pequeño para decirlo sin decirlo',
    desc: 'Tulipán, ranúnculo y wax flower en un formato compacto y asequible. El “solo porque sí” de nuestra carta.',
    incluye: ['9–11 tallos de temporada', 'Papel de algodón y lazo de lino', 'Tarjeta escrita a mano'],
    cuidado: 'El tulipán sigue creciendo dentro del agua: recorta los tallos si el ramo se abre demasiado.',
    duracion: '5–8 días'
  },
  {
    id: 'bosque', nombre: 'Bosque', coleccion: 'eternas', precio: 1190, img: 'producto-12', orden: 12,
    tagline: 'Verdes secos, ramas y textura',
    desc: 'Un ramo seco de eucalipto, ruscus, avena y ramas de algodón. Escultórico, longevo y perfecto para espacios de trabajo.',
    incluye: ['Ramo seco atado a mano', 'Papel kraft y cordel de yute', 'Tarjeta escrita a mano'],
    cuidado: 'Sin agua. Colócalo en un jarrón seco y evita zonas húmedas como la cocina o el baño.',
    duracion: '12–18 meses'
  }
];

/* Complementos que se suman al carrito desde la vista rápida */
window.EXTRAS = [
  { id: 'vela',    nombre: 'Vela de soya · Higo y cedro', precio: 390 },
  { id: 'jarron',  nombre: 'Jarrón de cerámica artesanal', precio: 480 },
  { id: 'tarjeta', nombre: 'Tarjeta caligrafiada a mano',  precio: 60 }
];

/* Planes de suscripción destacados (el configurador calcula cualquier combinación) */
window.PLANES = [
  {
    id: 'esencial', nombre: 'Esencial', frecuencia: 'mensual', tamano: 'petit', destacado: false,
    resumen: 'Una entrega al mes. Para empezar el ritual sin compromiso.',
    incluye: ['1 ramo Petit al mes', 'Flor de temporada seleccionada por el taller', 'Cambia o pausa cuando quieras', 'Envío incluido en zona centro']
  },
  {
    id: 'ritual', nombre: 'El Ritual', frecuencia: 'quincenal', tamano: 'clasico', destacado: true,
    resumen: 'Dos entregas al mes en tamaño Clásico. Nuestro plan más elegido.',
    incluye: ['2 ramos Clásicos al mes', 'Prioridad en flor de temporada', 'Jarrón de regalo en la primera entrega', 'Envío incluido en zona centro', '10 % de descuento en la tienda']
  },
  {
    id: 'estudio', nombre: 'Estudio', frecuencia: 'semanal', tamano: 'lujo', destacado: false,
    resumen: 'Una entrega semanal en tamaño Lujo. Para casas, lobbies y oficinas.',
    incluye: ['4 arreglos Lujo al mes', 'Cambio de jarrón y retiro del anterior', 'Diseño coordinado con tu espacio', 'Envío y montaje incluidos', '15 % de descuento en la tienda']
  }
];

window.FRECUENCIAS = [
  { id: 'semanal',   nombre: 'Semanal',   entregasMes: 4, base: 780, desc: 'Cada 7 días' },
  { id: 'quincenal', nombre: 'Quincenal', entregasMes: 2, base: 860, desc: 'Cada 15 días' },
  { id: 'mensual',   nombre: 'Mensual',   entregasMes: 1, base: 940, desc: 'Una vez al mes' }
];

window.COMPROMISOS = [
  { id: 'flex', nombre: 'Sin compromiso', meses: 1,  descuento: 0,    desc: 'Cancela o pausa cuando quieras' },
  { id: 'm3',   nombre: '3 meses',        meses: 3,  descuento: 0.05, desc: 'Ahorra 5 %' },
  { id: 'm6',   nombre: '6 meses',        meses: 6,  descuento: 0.10, desc: 'Ahorra 10 % + jarrón de regalo' },
  { id: 'm12',  nombre: '12 meses',       meses: 12, descuento: 0.15, desc: 'Ahorra 15 % + taller para dos' }
];

/* ⚠️ TESTIMONIOS DE EJEMPLO — sustitúyelos por reseñas reales de tus clientes
   antes de publicar el sitio. */
window.TESTIMONIOS = [
  { texto: 'Pedí un ramo a las once de la mañana y llegó antes de la comida, impecable y con la tarjeta escrita a mano. Se convirtió en mi regalo por defecto.', autor: 'Nombre del cliente', lugar: 'Suscripción quincenal' },
  { texto: 'Llevamos ocho meses con flores frescas en la recepción. Cambian la paleta cada temporada sin que tengamos que pedirlo.', autor: 'Nombre del cliente', lugar: 'Plan Estudio · Oficina' },
  { texto: 'Hicieron las flores de nuestra boda con lo que había en temporada y fue mil veces mejor que la referencia que llevábamos.', autor: 'Nombre del cliente', lugar: 'Boda' },
  { texto: 'El arreglo duró casi dos semanas. Me escribieron a los tres días para preguntar cómo iba. Nadie hace eso.', autor: 'Nombre del cliente', lugar: 'Ánfora Terracota' },
  { texto: 'La flor preservada de la oficina sigue intacta un año después. La mejor compra del año.', autor: 'Nombre del cliente', lugar: 'Ámbar Eterno' }
];

window.FAQ = [
  { q: '¿Cuándo llegan mis flores?', a: 'Los pedidos hechos antes de las 14:00 se entregan el mismo día en la zona centro. Fuera de ese horario, la entrega pasa al día siguiente. En envíos nacionales el tiempo es de 24 a 48 horas.' },
  { q: '¿Puedo elegir el día de entrega?', a: 'Sí. En el carrito puedes seleccionar la fecha y una franja horaria (mañana o tarde). También puedes programar una entrega con semanas de anticipación: guardamos la fecha y te avisamos el día anterior.' },
  { q: '¿Las flores son siempre las de la foto?', a: 'Trabajamos con flor de temporada del mercado, así que la composición puede variar. Respetamos siempre la paleta, el tamaño y el valor del arreglo que elegiste, y en muchos casos mejora según lo que llega ese día.' },
  { q: '¿Cómo funciona la suscripción?', a: 'Eliges frecuencia, tamaño y duración; nosotros nos encargamos del resto. Cada entrega es una composición nueva con lo mejor de la semana. Puedes pausar, saltar una entrega o cancelar desde tu cuenta o escribiéndonos, sin penalización.' },
  { q: '¿Puedo pausar o cambiar mi plan?', a: 'Sí, hasta 48 horas antes de la siguiente entrega. Los planes con compromiso de 3, 6 o 12 meses admiten dos pausas de hasta un mes cada una.' },
  { q: '¿Qué formas de pago aceptan?', a: 'Tarjeta de crédito y débito, transferencia y efectivo contra entrega en la zona centro. Para empresas emitimos factura y trabajamos con pago mensual consolidado.' },
  { q: '¿Hacen bodas y eventos?', a: 'Sí, es una parte importante del taller. Trabajamos un número limitado de proyectos por mes para poder acompañarlos de cerca: escríbenos con la fecha, el lugar y una idea de presupuesto y te enviamos una propuesta.' },
  { q: '¿Qué pasa si algo llega mal?', a: 'Tenemos garantía de frescura de 7 días. Si algo no llegó como esperabas, mándanos una foto dentro de las 24 horas siguientes y reponemos el arreglo o devolvemos el importe.' }
];

window.GALERIA = ['galeria-01', 'galeria-02', 'galeria-03', 'galeria-04', 'galeria-05', 'galeria-06'];
