# Casablanca · Explora el valle

Prototipo funcional basado en el Informe de Formulación y Diseño de la Plataforma Digital Turística del Valle de Casablanca. Interfaz en español, adaptable a teléfonos y computadores.

## Qué puedes probar

- Explorar y buscar experiencias por patrimonio, costa, viñas, gastronomía, alojamiento y eventos.
- Consultar mapa OpenStreetMap, seleccionar marcadores y solicitar ubicación opcional.
- Recorrer doce paradas demostrativas, abrir sus fichas mediante QR y guardar progreso.
- Escuchar la audioguía mediante síntesis de voz del navegador, o configurar una grabación HTTPS.
- Registrar consultas, encuestas y solicitudes de prestadores en una base de datos D1.
- Administrar textos, fotografías por URL, horarios, eventos, coordenadas y publicación.
- Revisar prestadores y aprobarlos solo después de confirmar una comprobación manual.
- Consultar estadísticas basadas en los registros guardados y exportar encuestas CSV.
- Descargar los doce QR desde Administración.

## Recorrido de demostración

1. Entra a «Ruta autoguiada» y abre la primera parada.
2. Pulsa «Escuchar» y «Marcar como visitada». Recarga para comprobar el progreso.
3. Abre «Código QR» y descarga su imagen. En el sitio privado, usa un teléfono con acceso a tu cuenta.
4. Responde «Encuesta del visitante» con información ficticia.
5. Abre «Administración», revisa las estadísticas y edita un horario en «Contenidos».
6. Vuelve al portal para comprobar la edición.
7. Envía una solicitud de prestador y revisa su estado pendiente en Administración.

Los formularios guardan registros reales en el prototipo. No envían correos institucionales.

## Datos demostrativos y alcance

El informe no entrega un inventario oficial de los doce lugares, sus coordenadas, reseñas, fotografías, audios, horarios o prestadores. La ruta inicial es demostrativa y no debe utilizarse como navegación real. Plaza de Armas, museo y Quintay se mencionan en el informe; su presencia no significa que la contraparte haya aprobado esta selección o recorrido.

Las fotos iniciales son paisajes de contexto y están acreditadas en «Créditos y uso de datos». No se presentan como fotografías específicas de las doce paradas. Los prestadores y el evento de muestra son ficticios. Las rutas completas de vino, cerveza y turismo religioso, pagos y aplicación móvil nativa quedan fuera del alcance inicial del informe.

No hay integración automática con SERNATUR ni correo municipal. La audioguía depende del soporte y de las voces del navegador; un administrador puede añadir una URL HTTPS de una grabación. La geolocalización requiere autorización del navegador y el mapa requiere conexión a internet.

## Acceso y datos

La publicación utiliza Sites con acceso privado para el propietario. La API de administración exige identidad autenticada en el servidor. En desarrollo local, el starter simula una cuenta al entrar a /signin-with-chatgpt?return_to=/%23admin. No se usan contraseñas inventadas ni una pantalla de inicio de sesión simulada como protección de producción.

Antes de abrir el portal al público se debe implementar autorización específica de funcionarios, revisar permisos y definir la política institucional de privacidad, conservación y eliminación de datos. No cambiar este despliegue a público sin ese trabajo.

Las respuestas y contenidos se guardan en D1. La geolocalización del mapa no se transmite al servidor de esta aplicación; el proveedor cartográfico recibe las solicitudes necesarias para servir sus mapas. La cookie cb_visitor identifica el navegador durante 30 días y permite recordar el progreso. Una visita cuenta un navegador/parada, no una persona única. La base de datos puede retener registros más tiempo que la cookie: la política definitiva está pendiente.

No introducir datos personales reales durante la evaluación.

## Ejecutar localmente

Requiere Node.js >=22.13 y npm. Desde esta carpeta:

1. Ejecutar npm ci.
2. Ejecutar npm run build.
3. En una base local nueva, ejecutar:
   node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careful_sersi.sql
4. Ejecutar npm run dev y abrir la dirección indicada.
5. Para administración local, usar el botón de ingreso de la aplicación.

Aplicar la migración solo una vez por base local. El despliegue de Sites aplica y registra sus migraciones por separado. Los contenidos iniciales se incorporan mediante INSERT OR IGNORE y no reemplazan las ediciones posteriores.

## Estructura

- app/portal.tsx: exploración, recorrido, fichas y audioguía.
- app/forms.tsx: encuesta, contacto y prestadores.
- app/admin.tsx: edición, revisión, estadísticas y QR.
- app/map-view.tsx: mapa y geolocalización.
- app/api/portal/route.ts: API validada y autorización.
- app/data.ts: contenido demostrativo inicial.
- db/schema.ts y drizzle/: modelo y migraciones.
- public/images/: imágenes optimizadas y acreditadas.

## Verificación realizada

Compilación de producción y verificación TypeScript satisfactorias. Prueba automatizada de 22 comprobaciones: navegación y filtros; rechazo de acceso administrativo anónimo; validación de formularios; encuesta desde la interfaz; persistencia de visitas; enlace QR directo; generación de QR; mapa; sesión administrativa; lectura de encuestas; diferenciación QR/web; edición persistente; rechazo de URL inválida; consulta guardada; prestador pendiente; requisito de revisión; diálogo de edición; ancho móvil y ausencia de errores JavaScript.

El tiempo máximo de tres segundos debe medirse en dispositivos y redes de terreno; no se certifica a partir de pruebas locales. La salida sonora debe verificarse en el teléfono final. WebMCP se registra cuando el navegador lo admite; no se pudo validar en un contexto compatible y no es un requisito del informe.

Los datos creados en las pruebas locales no se incluyen en la publicación.

## Créditos

- Valle: Alvaro M. Tello, Wikimedia Commons, CC BY-SA 4.0.
  https://commons.wikimedia.org/wiki/File:Vista_general_de_Valle_de_Casablanca.jpg
- Quintay: gaspar abrilot / Casper Abrilot, Wikimedia Commons, CC BY-SA 2.0.
  https://commons.wikimedia.org/wiki/File:Ballenera_Quintay_-_Flickr_-_Casper_Abrilot.jpg
- Imágenes redimensionadas; recorte visual para esta presentación, bajo sus licencias originales.
- Mapas: OpenStreetMap y colaboradores.
