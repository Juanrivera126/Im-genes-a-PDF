# Convertidor de imágenes a PDF

Descripción
-----------
Pequeña aplicación web que permite seleccionar múltiples imágenes desde el navegador y generar un único archivo PDF donde cada página contiene una de las imágenes subidas.

Características
---------------
- Convierte imágenes (JPG, PNG, WEBP) a PDF en el cliente (sin subir nada a servidores).
- Escala y centra cada imagen en su propia página.
- Generación de PDF realizada con `jsPDF` (CDN).
 - Incluye presets: A4 vertical, A4 horizontal, Cuadrado y "Horizontal — Full size" (paisaje sin márgenes).

Uso
---
1. Abrir `index.html` en un navegador moderno.
2. Seleccionar las imágenes con el control "Selecciona imágenes".
3. Elegir el preset de tamaño y pulsar "Generar y Descargar PDF".
4. El navegador descargará `presentacion_slides.pdf`.

Notas y limitaciones
---------------------
- La app procesa únicamente imágenes; los videos y archivos HTML se ignoran para la salida en PDF.
- La generación se realiza en memoria en el cliente: archivos muy grandes o muchos archivos pueden consumir RAM y ralentizar el navegador.
- Para producción se puede cambiar la inclusión de `jsPDF` por una versión empaquetada localmente.

Desarrollo
----------
- Estructura principal:
  - `index.html` — interfaz de usuario.
  - `js/main.js` — lógica de conversión y generación de PDF.
  - `images/` — (opcional) ejemplos de entrada.

- Abrir `index.html` directamente en el navegador o servir con un servidor estático local (por ejemplo `python -m http.server`):

```bash
# desde la carpeta del proyecto
python -m http.server 8000
# abrir http://localhost:8000
```

Contribuciones
--------------
Pull requests y mejoras bienvenidas: soporte de más presets, añadir compresión de imágenes, o soporte para video -> extraer frame.
