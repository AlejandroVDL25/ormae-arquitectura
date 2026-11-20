/*
  CONTENIDO DEL SITIO
  ===================
  Este es el único archivo que hay que editar para publicar proyectos e imágenes.
  Instrucciones completas en README.md.

  - Los proyectos con `pendiente: true` se muestran como espacios temporales,
    claramente marcados como "por publicar". Bórralos cuando cargues los reales.
  - Cualquier campo vacío (null, "" o []) simplemente no se muestra.
  - Las rutas de imagen son relativas a la raíz del sitio, por ejemplo:
    "assets/proyectos/casa-ejemplo/portada.webp"
*/

window.SITIO = {
  // Nombre del despacho, tal como aparece en Instagram.
  nombre: "ORMAE Arquitectura",

  // La portada usa el video de assets/video/ (portada.mp4, portada.webm, portada-movil.mp4).
  // Para cambiarlo, reemplaza esos archivos conservando los nombres.
  portada: null,

  // Texto de presentación del despacho (sección Estudio). Un párrafo por elemento.
  // DEMO: texto tomado de la publicación de presentación en Instagram (22 de marzo de 2026).
  estudio: [
    "Después de mucho tiempo trabajando y aprendiendo en distintos proyectos, decidí dar un paso importante: hoy nace ORMAE Arquitectura.",
    "Un espacio donde el diseño no solo se ve bien, sino que se piensa, se planea y se ejecuta de manera estratégica.",
    "Creemos en una arquitectura consciente, funcional y bien resuelta desde el origen. Cada proyecto es una oportunidad para optimizar recursos, mejorar espacios y generar valor real."
  ],
  // Firma bajo el texto de Estudio (vacía para ocultarla).
  firma: "Arq. Omar Rodriguez",

  // Alcances del servicio (sección Servicios). Un texto corto por elemento.
  alcances: [],

  // Correo y redes: se muestran solo si se llenan.
  correo: "",
  redes: [{ nombre: "Instagram @ormae_arquitectura", url: "https://www.instagram.com/ormae_arquitectura/" }]
};

window.PROYECTOS = [
  /*
  PLANTILLA DE UN PROYECTO REAL (copiar, pegar y llenar):
  {
    slug: "casa-ejemplo",            // sin espacios ni acentos; forma la dirección proyecto.html?p=casa-ejemplo
    nombre: "Nombre del proyecto",
    tipo: "Vivienda",                // se usa para filtrar
    ubicacion: "Metepec, Edo. Méx.", // se usa para filtrar
    anio: 2025,                      // se usa para filtrar
    resumen: "Una línea que acompaña al proyecto en el índice.",
    descripcion: ["Párrafo 1.", "Párrafo 2."],
    decisiones: ["Decisión de diseño 1.", "Decisión de diseño 2."],
    creditos: [{ rol: "Fotografía", nombre: "Nombre" }],
    imagenes: [
      // rol: "portada" | "vista general" | "exterior" | "interior" | "detalle" | "plano"
      { src: "assets/proyectos/casa-ejemplo/portada.webp", alt: "Descripción de lo que se ve", rol: "portada", ancho: 2400, alto: 1600 }
    ],
    // Solo si existe un panorama 360° equirectangular (proporción 2:1):
    panorama: null, // { src: "assets/proyectos/casa-ejemplo/sala-360.jpg", alt: "Panorama 360° de la sala" }
    // Solo si existe una secuencia de fotos tomadas girando alrededor del objeto/maqueta:
    secuencia: null // { alt: "Maqueta en rotación", frames: ["assets/.../giro-01.webp", "assets/.../giro-02.webp"] }
  },
  */
  /* ---------------------------------------------------------------
     DEMO: proyectos e imágenes tomados de las publicaciones de
     Instagram @ormae_arquitectura (imágenes en calidad de Instagram).
     Sustitúyelos por los archivos originales cuando estén listos.
     --------------------------------------------------------------- */
  {
    slug: "vertical-tower",
    nombre: "Vertical Tower",
    tipo: "Edificio vertical",
    ubicacion: "Metepec",
    resumen: "Diseño arquitectónico vertical pensado para optimizar espacio, funcionalidad y presencia urbana.",
    descripcion: [
      "Diseño arquitectónico vertical pensado para optimizar espacio, funcionalidad y presencia urbana.",
      "En ORMAE desarrollamos proyectos que equilibran estética, eficiencia y viabilidad desde el origen."
    ],
    decisiones: [],
    creditos: [{ rol: "Diseño", nombre: "ORMAE Arquitectura" }, { rol: "Cliente", nombre: "MILUPA Y ASOCIADOS" }],
    imagenes: [
      { src: "assets/proyectos/vertical-tower/01-portada.jpg", alt: "Render exterior de una torre de vivienda de ocho niveles con fachada de celosía y balcones corridos, sobre un basamento comercial", rol: "portada", ancho: 1024, alto: 1024 }
    ],
    panorama: null,
    secuencia: null
  },
  {
    slug: "arco-vitral-chicahualco",
    nombre: "Arco-techo con vitral",
    tipo: "Espacio religioso",
    ubicacion: "San Jerónimo Chicahualco",
    resumen: "Arco-techo con vitral para la parroquia de San Jerónimo Chicahualco.",
    descripcion: [
      "Diseñamos este arco-techo con vitral para la parroquia de San Jerónimo Chicahualco, creando un espacio que no solo protege, sino que inspira.",
      "Cada trazo y cada color fueron pensados para transformar la experiencia del lugar, integrando identidad, luz y espiritualidad en un solo elemento arquitectónico.",
      "Proyecto diseñado para MILUPA Y ASOCIADOS, quienes también llevaron a cabo su construcción."
    ],
    decisiones: [],
    creditos: [{ rol: "Diseño", nombre: "ORMAE Arquitectura" }, { rol: "Cliente y construcción", nombre: "MILUPA Y ASOCIADOS" }],
    imagenes: [
      { src: "assets/proyectos/arco-vitral-chicahualco/01-portada.jpg", alt: "Render del atrio cubierto por un arco-techo blanco con franja de vitral de colores, con bancas bajo la cubierta", rol: "portada", ancho: 1440, alto: 1440 },
      { src: "assets/proyectos/arco-vitral-chicahualco/02-detalle.jpg", alt: "Detalle del vitral: una cruz al centro rodeada de paños rectangulares en amarillo, azul, verde y rojo", rol: "detalle", ancho: 1440, alto: 1440 },
      { src: "assets/proyectos/arco-vitral-chicahualco/03-exterior.jpg", alt: "Fotografía del arco-techo construido junto a la fachada amarilla de la parroquia, con el vitral visto desde abajo", rol: "exterior", ancho: 1440, alto: 1440 }
    ],
    panorama: null,
    secuencia: null
  },
  {
    slug: "casa-dlc",
    nombre: "Casa DLC",
    tipo: "Vivienda",
    ubicacion: "Calimaya",
    resumen: "Inicio de obra: del trazo y la cimentación a la casa construida.",
    descripcion: [
      "Todo gran proyecto comienza con una idea, pero es en el terreno donde empieza a convertirse en realidad.",
      "Con el inicio de la construcción de Casa DLC comienza un proceso en el que el diseño, la precisión y la atención a cada detalle darán forma a una nueva historia.",
      "Desde el trazo y la cimentación, cada etapa representa nuestro compromiso con una arquitectura que trasciende el papel."
    ],
    decisiones: [],
    creditos: [{ rol: "Diseño", nombre: "ORMAE Arquitectura" }],
    imagenes: [
      { src: "assets/proyectos/casa-dlc/01-portada.jpg", alt: "Terreno de Casa DLC con el trazo marcado en cal y estacas de madera, entre bardas de block", rol: "portada", ancho: 1096, alto: 1456 },
      { src: "assets/proyectos/casa-dlc/02-detalle.jpg", alt: "Juego de planos impresos y caja con el monograma de ORMAE sobre la tierra del terreno", rol: "detalle", ancho: 1227, alto: 1628 },
      { src: "assets/proyectos/casa-dlc/03-vista-general.jpg", alt: "Dos fotografías del inicio de obra: un trabajador nivela las estacas del trazo y otro revisa el terreno", rol: "vista general", ancho: 979, alto: 1505 }
    ],
    panorama: null,
    secuencia: null
  },
  {
    slug: "interiores-residenciales",
    nombre: "Interiores residenciales",
    tipo: "Interiorismo",
    ubicacion: "Metepec",
    resumen: "Espacios pensados para ser vividos: recámaras y baño con luz natural y materialidad cálida.",
    descripcion: [
      "Espacios pensados para ser vividos. La arquitectura se define por la experiencia que genera en quien la habita. Se vive, no solo se observa.",
      "Arquitectura que prioriza el confort: diseño limpio, iluminación natural y materialidad en equilibrio.",
      "Un baño donde la luz, la textura y la calidez crean una experiencia de confort todos los días."
    ],
    decisiones: [],
    creditos: [{ rol: "Diseño", nombre: "ORMAE Arquitectura" }],
    imagenes: [
      { src: "assets/proyectos/interiores-residenciales/01-portada.jpg", alt: "Render de una recámara con cama de madera, muro de tabique aparente y ventanal de piso a techo hacia un patio con vegetación", rol: "portada", ancho: 1024, alto: 1024 },
      { src: "assets/proyectos/interiores-residenciales/02-interior.jpg", alt: "Render de una recámara principal con cabecera tapizada, tapete circular, sillón azul y lámparas colgantes", rol: "interior", ancho: 1320, alto: 869 },
      { src: "assets/proyectos/interiores-residenciales/03-interior.jpg", alt: "Render de un baño con mueble de madera flotante, espejo redondo, lámparas colgantes y ventana en arco", rol: "interior", ancho: 1440, alto: 1920 }
    ],
    panorama: null,
    secuencia: null
  },
  {
    slug: "cocina-ro-cubica",
    nombre: "Cocina y comedor RO Cúbica",
    tipo: "Interiorismo",
    ubicacion: "Metepec",
    resumen: "La calidez de la madera, la pureza de los materiales y la iluminación precisa.",
    descripcion: [
      "Diseño que se siente, no solo se ve. La calidez de la madera, la pureza de los materiales y la iluminación precisa crean un espacio que invita a quedarse.",
      "En ORMAE entendemos que cada detalle construye experiencias. Proyecto concebido en su momento para RO Cúbica."
    ],
    decisiones: [],
    creditos: [{ rol: "Diseño", nombre: "ORMAE Arquitectura" }, { rol: "Concebido para", nombre: "RO Cúbica" }],
    imagenes: [
      { src: "assets/proyectos/cocina-ro-cubica/01-portada.jpg", alt: "Render de cocina y comedor con vigas de madera en el techo, cocina de madera clara con barra y comedor de seis sillas", rol: "portada", ancho: 1320, alto: 874 }
    ],
    panorama: null,
    secuencia: null
  }
];
