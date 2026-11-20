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
  // Imagen protagonista de la portada. Mientras sea null, la portada muestra el monograma.
  // Ejemplo: { src: "assets/portada.webp", alt: "Fachada principal al atardecer", ancho: 2400, alto: 1600 }
  portada: null,

  // Texto de presentación del despacho (sección Estudio). Un párrafo por elemento.
  estudio: [],

  // Alcances del servicio (sección Servicios). Un texto corto por elemento.
  alcances: [],

  // Correo y redes: se muestran solo si se llenan.
  correo: "",
  redes: [] // { nombre: "Instagram", url: "https://..." }
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
  { slug: "proyecto-01", nombre: "Proyecto 01", pendiente: true, imagenes: [], descripcion: [], decisiones: [], creditos: [] },
  { slug: "proyecto-02", nombre: "Proyecto 02", pendiente: true, imagenes: [], descripcion: [], decisiones: [], creditos: [] },
  { slug: "proyecto-03", nombre: "Proyecto 03", pendiente: true, imagenes: [], descripcion: [], decisiones: [], creditos: [] }
];
