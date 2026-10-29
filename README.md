# Casablanca · Prototipo local

Portal turístico basado en el informe del Proyecto Integrador. Conserva exploración, filtros, mapa interactivo, la Ruta Casco Histórico de doce paradas del folleto municipal, servicios (baños públicos, información turística, cajeros, farmacias, Carabineros, taxis, buses, supermercados y bencinera), audioguía, QR, encuesta, consultas, solicitudes de prestadores y administración.

## Inicio

Requiere Node.js >=22.13. Desde esta carpeta, en PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre http://127.0.0.1:5173/. Consulta INICIAR.txt para instrucciones completas.
SQLite y las tablas se crean automáticamente. No requiere cuentas de servicios ni claves API.
Para el modo compilado: npm.cmd run build, seguido de npm.cmd start.

## Datos y administración

Los datos están en datos/casablanca.sqlite dentro del proyecto. Cada copia tiene una base independiente. Para respaldar, detén el servidor y copia la carpeta datos completa. El ZIP no contiene registros personales.

Una copia antigua con una única base compatible en .wrangler/state importa sus tablas content, submissions y visits una sola vez, mediante transacción y conservando el archivo original. La carga inicial usa INSERT OR IGNORE para conservar las ediciones. No se importan los registros del antiguo sitio de internet.

En /#admin, pulsa «Ingresar a la administración local». Activa una sesión de demostración con cookie firmada, HttpOnly y SameSite=Strict. El servidor escucha en 127.0.0.1. La sesión se invalida al reiniciar; no depende de una cuenta de ChatGPT. Esta versión está destinada a demostración en un computador.

## Alcance

Las doce paradas y la simbología de servicios provienen del folleto «Ruta Casco Histórico» de la I. Municipalidad. Sus coordenadas se aproximaron con OpenStreetMap; los relatos, horarios, prestadores y eventos siguen siendo de trabajo y necesitan validación municipal. Una base creada antes de este cambio reemplaza una sola vez las paradas de demostración que nadie editó; las ediciones se conservan. Los servicios nuevos se agregan desde Administración como «Servicio del mapa». No se realizan pagos ni se envía correo institucional. La comprobación SERNATUR es manual.

El mapa y las imágenes o audios HTTPS personalizados necesitan internet. Las fotos iniciales son locales. La ubicación solicitada se usa en el navegador. Los QR apuntan a este computador: 127.0.0.1 desde un teléfono se refiere al propio teléfono.

## Estructura

- app/portal.tsx: exploración, ruta, fichas y audioguía.
- app/map-view.tsx: mapa interactivo con capas, ruta por calles y búsqueda del servicio más cercano.
- app/data.ts: paradas oficiales, trazado de la ruta y servicios iniciales.
- app/forms.tsx y app/admin.tsx: formularios y administración.
- app/api/portal/route.ts: API validada.
- app/api/admin-session/route.ts y db/local-admin.ts: sesión local.
- db/local-database.mjs: SQLite, creación de tablas e importación anterior.
- db/store.ts: consultas y contenido inicial.
- scripts/run-framework.mjs: servidor Node local.

## Verificación

Compilación y TypeScript satisfactorios. 22 comprobaciones de interfaz y 53 de API/persistencia: primer POST, inicialización, validación, permisos, edición, visitas, solicitudes y reinicio con conservación de registros. Las pruebas usaron bases aisladas; sus registros no están en el ZIP.

## Créditos

Valle: Alvaro M. Tello, Wikimedia Commons, CC BY-SA 4.0.
https://commons.wikimedia.org/wiki/File:Vista_general_de_Valle_de_Casablanca.jpg

Quintay: gaspar abrilot / Casper Abrilot, Wikimedia Commons, CC BY-SA 2.0.
https://commons.wikimedia.org/wiki/File:Ballenera_Quintay_-_Flickr_-_Casper_Abrilot.jpg

Imágenes redimensionadas y recortadas visualmente bajo sus licencias originales.
Mapas: OpenStreetMap y colaboradores.
