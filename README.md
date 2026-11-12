# Gold Tire 07 – Sitio web estático

Esta carpeta contiene una página web estática que imita el estilo de **[mecanicavenezuela.com](https://mecanicavenezuela.com/)** pero con el branding de la cuenta de Instagram **gold_tire07**.

## Estructura de archivos
```
 gold_tire_website/
 ├─ index.html      # contenido HTML
 ├─ style.css       # estilos (incluye animaciones simples)
 ├─ script.js       # animación de scroll‑into‑view
 └─ images/         # **coloca aquí** el logo y fotos de productos
```

## Paso a paso para personalizar

1. **Descarga el logo y las imágenes** de la cuenta de Instagram:
   - Abre https://www.instagram.com/gold_tire07/ y guarda el logo (por ejemplo `logo.png`) y fotos de cauchos (`product1.jpg`, `product2.jpg`, ...).
   - Copia esos archivos dentro de la carpeta `images/`.
   - Si prefieres usar imágenes diferentes, simplemente reemplaza los nombres en el HTML (`src="images/product1.jpg"`, etc.).

2. **Ajusta los textos**
   - Edita `index.html` y cambia los títulos, descripciones y el texto del *hero* para que coincidan con la información que deseas mostrar (dirección, teléfono, etc.).
   - Los bloques de productos están dentro de la sección **Productos**. Duplica o elimina `<div class="card">...</div>` según cuántos modelos ofrezcas.

3. **Animaciones**
   - Cada sección tiene el atributo `data-animate`. El script `script.js` añade la clase `visible` al entrar en el viewport, creando un suave fade‑in.
   - Si deseas más efectos, puedes añadir más clases CSS o usar librerías como AOS.

4. **Vista previa local**
   - Abre una terminal en la carpeta `gold_tire_website` y ejecuta:
     ```powershell
     python -m http.server 8080
     ```
   - Luego abre `http://localhost:8080` en tu navegador.
   - (Requiere Python 3, que ya viene con Windows 10+.)

5. **Despliegue**
   - Sube la carpeta completa a cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.).
   - Sólo necesita servir archivos estáticos, sin backend.

---
### Personalizaciones avanzadas (opcional)
- **Parallax** – Cambia `hero` en `style.css` a `background-attachment: fixed;` para un efecto de desplazamiento.
- **Formulario de contacto** – El formulario actual es solo visual; para recibir mensajes, conecta con un servicio como Formspree o tu propio endpoint.
- **SEO** – Añade meta‑tags (`description`, `og:image`, etc.) al `<head>`.

¡Listo! Cuando tengas las imágenes en `images/` y ajustes los textos, la web estará completa.
