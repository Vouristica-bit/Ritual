/* =============================================================================
   CONFIGURACIÓN DEL NEGOCIO — edita SOLO este archivo para personalizar el sitio
   -----------------------------------------------------------------------------
   Todo lo que escribas aquí se refleja automáticamente en las 5 páginas:
   textos con  data-cfg="ruta.del.dato",  enlaces con  data-cfg-href="..."
   Los campos marcados con  // ⚠️  son datos de ejemplo: reemplázalos.
   ========================================================================== */
window.CONFIG = {
  marca: {
    nombre: 'Ritual by Celic',
    nombreCorto: 'Ritual',
    lema: 'Estudio floral',
    claim: 'Flores de temporada, arregladas a mano',
    ciudad: 'Ciudad de México',                        // ⚠️
    fundado: 2019,                                     // ⚠️
    dominio: 'ritualbycelic.com'
  },

  contacto: {
    email: 'octaviomaortiz@gmail.com',                   // ⚠️
    telefono: '+52 44 4520 4990',                      // ⚠️
    whatsapp: '5214445204990',                         // ⚠️ solo dígitos, con código de país. Vacío ('') oculta los botones de WhatsApp.
    direccion: 'Queretarock',           // ⚠️
    ciudadPostal: 'La vista Residencial san Calixto',            // ⚠️
    mapsQuery: 'San Calixto residencial', // ⚠️ usado para el enlace a Google Maps
    horario: [
      { dia: 'Lunes a viernes', horas: '9:00 – 19:00' },
      { dia: 'Sábado', horas: '10:00 – 17:00' },
      { dia: 'Domingo', horas: 'Solo entregas programadas' }
    ]
  },

  social: {
    instagram: 'https://instagram.com/',               // ⚠️
    tiktok: 'https://tiktok.com/',                     // ⚠️
    pinterest: 'https://pinterest.com/',               // ⚠️
    facebook: ''                                       // vacío = no se muestra
  },

  moneda: {
    codigo: 'MXN',        // MXN · USD · EUR · COP · CLP · ARS · PEN...
    locale: 'es-MX',
    decimales: 0          // 0 = $690  ·  2 = $690.00
  },

  entrega: {
    avisoEnvioGratis: 1200,   // a partir de este monto el envío es gratis
    zonas: [
      { id: 'centro',   nombre: 'Zona centro (mismo día)',       costo: 0 },
      { id: 'metro',    nombre: 'Zona metropolitana',            costo: 120 },
      { id: 'nacional', nombre: 'Envío nacional (24–48 h)',      costo: 220 },
      { id: 'pickup',   nombre: 'Recoger en el taller',          costo: 0 }
    ],
    horasCorte: '14:00',
    diasNoDisponibles: [0]    // 0 = domingo sin entregas a domicilio
  },

  /* ---------------------------------------------------------------------------
     INTEGRACIONES (opcionales)
     Deja las cadenas vacías y el sitio funciona igual: los formularios y el
     checkout se completan por WhatsApp / correo. Al pegar un endpoint (Formspree,
     Netlify Forms, Getform, Basin, Google Apps Script…) los envíos se hacen por
     POST fetch en JSON y se guarda el respaldo local.
     Ej.: 'https://formspree.io/f/xxxxxxx'
  --------------------------------------------------------------------------- */
  endpoints: {
    newsletter: '',
    contacto: '',
    pedido: '',
    suscripcion: ''
  },

  /* Texto legal / operativo */
  avisos: {
    topbar: 'Entrega el mismo día en la ciudad · Pedidos antes de las 14:00',
    envio: 'Envío gratis en pedidos desde',
    politicaFrescura: 'Garantía de frescura de 7 días en todos los ramos.'
  }
};
