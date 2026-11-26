# ORMAE Arquitectura: guía de actualización del sitio

Sitio estático (HTML, CSS y JavaScript sin dependencias de compilación). Se puede publicar tal cual en cualquier hosting estático (Netlify, Vercel, GitHub Pages, Hostinger, etc.).

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Portada: Inicio, Proyectos, Servicios, Estudio y Contacto |
| `proyecto.html` | Plantilla de detalle; muestra el proyecto indicado en `?p=<slug>` |
| `data/proyectos.js` | **Único archivo que hay que editar** para textos de estudio, alcances, correo, redes, foto de portada y proyectos |
| `css/tokens.css` | Colores, tipografías (Jost Light para títulos, Geist para texto) y escalas |
| `css/site.css` | Estilos del sitio |
| `js/site.js`, `js/proyecto.js` | Comportamiento (índice, filtros, inclinación 3D, galería, visores) |
| `assets/brand/` | Logotipo, favicons y las cuatro capas del monograma (`capa-*.png`) que forman el 3D de la portada |
| `assets/proyectos/<slug>/` | Aquí van las imágenes de cada proyecto |

## Publicar un proyecto

1. Crea la carpeta `assets/proyectos/<slug>/` (ejemplo: `casa-metepec`).
2. Exporta cada foto en **WebP** en dos tamaños, sin recortar: `nombre.webp` (1440 a 2400 px en el lado largo, calidad 80) y `nombre-720.webp` (720 px de ancho). El celular descarga la de 720 y la computadora la grande (campo `srcset`).
3. En `data/proyectos.js`, copia la plantilla comentada, llénala y **borra los tres proyectos con `pendiente: true`**.
4. Indica en cada imagen su función con `rol`: `portada`, `vista general`, `exterior`, `interior`, `detalle` o `plano`, además de `ancho` y `alto` reales en píxeles (evita saltos de diseño) y un `alt` que describa lo que se ve.

Cualquier campo vacío no se muestra. Los filtros por tipo, ubicación y año aparecen solos cuando hay **cuatro proyectos o más** y al menos dos valores distintos en ese campo.

### Recorridos y rotación

- **Panorama 360°**: imagen equirectangular 2:1 (por ejemplo 6000 x 3000) en `panorama: { src, alt }`. Se explora arrastrando, con el dedo o con las flechas.
- **Secuencia de giro**: de 24 a 72 fotos consecutivas tomadas alrededor de una maqueta u objeto, mismo encuadre, en `secuencia: { alt, ancho, alto, frames: [...] }`. Se gira arrastrando, con las flechas o con el control deslizante.
- Con fotografías normales no se simula una rotación: solo hay una inclinación discreta al pasar el puntero (se desactiva en pantallas táctiles y con "reducir movimiento").

## Textos del despacho y servicios

En `window.SITIO` (`data/proyectos.js`):

- `estudio`: párrafos de la sección Estudio. El primero se muestra como entrada.
- `cita`: frase destacada en grande dentro de Estudio.
- `firma`: nombre bajo el texto.
- `etapas`: etapas reales del servicio, en orden, como `{ titulo, texto }`. Se muestran numeradas en Servicios solo si se llenan.
- `alcances`: lista corta de alcances del servicio. Se muestra solo si se llena.

La lista «Proyectos por tipo» de Servicios se arma sola con los tipos de los proyectos publicados, y cada tipo abre el portafolio ya filtrado.

## Tomas de render del hero

Después de la intro del logotipo y del recorrido, el hero encadena las tomas de `SITIO.tomas` (`data/proyectos.js`) con un fundido cruzado y un leve empuje de cámara. Un índice de marcas finas, junto al botón de pausa, permite saltar a cualquier toma, y un rótulo enlaza al proyecto de cada render.

- Archivos en `assets/video/tomas/`: `id.webm`, `id.mp4`, `id.jpg` (horizontal 16:9) y `id-v.webm`, `id-v.mp4`, `id-v.jpg` (vertical 9:16, para celular).
- Duración de 8 a 10 s, sin audio, un fotograma clave por segundo, menos de 2,5 MB la horizontal y 1,5 MB la vertical.
- `conceptual: true` muestra «Render conceptual», obligatorio para imágenes generadas con IA, que no son obra del despacho.
- Las tomas actuales se hicieron con movimiento de cámara sobre los renders de los proyectos publicados. Para sustituirlas por renders animados nuevos, usa `prompts/prompt-maestro-hero.md`.
- Deja `tomas: []` para usar solo el video principal.

## Video de la portada

La portada usa `assets/video/portada.webm`, `portada.mp4` y `portada-movil.mp4` (con `portada-intro.jpg` y `portada-poster.jpg` como imágenes fijas). Los primeros 3,6 s son la intro del logotipo: se ven una vez y después el video repite solo el recorrido desde el segundo 4,2 (valores `INTRO_END` y `LOOP_FROM` en `js/site.js`). Para cambiar el video, reemplaza los archivos conservando los nombres; codifícalos con un fotograma clave por segundo para que el bucle salte sin cortes. Con "reducir movimiento" se muestra la imagen fija.

## Material pendiente

- **Fotografías de cada proyecto** (portada en horizontal 3:2 o 16:9, más vistas, interiores, detalles y planos).
- **Datos de cada proyecto**: nombre, tipo, ubicación, año, descripción, decisiones de diseño y créditos.
- **Foto protagonista** para la portada (horizontal, 2400 px o más).
- **Texto de presentación del despacho** (sección Estudio) y **alcances del servicio** (sección Servicios).
- **Nombre del despacho**, si se desea mostrar como texto junto al logotipo y en el título para buscadores.
- **Correo y redes**, si se quieren mostrar (no hay formulario porque no se entregó un correo de destino).
- **Logotipo en vector** (SVG, AI o PDF): la versión actual se amplió desde un PNG de 150 px.
- **Dominio final**, para completar las etiquetas para compartir (`og:url`, imagen con dirección absoluta).

## Notas

- El enlace de llamada usa el número tal como se entregó: `tel:7293318801`. Para llamadas desde fuera de México conviene `tel:+527293318801`; cámbialo solo si lo autorizas.
- Para probar localmente: `python -m http.server 5510` en esta carpeta y abrir `http://localhost:5510`.
