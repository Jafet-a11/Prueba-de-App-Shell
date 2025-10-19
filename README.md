LEGO Store - Progressive Web App (PWA)

Esta es una aplicación de demostración que implementa el patrón de App Shell para crear una Progressive Web App (PWA) de una tienda de LEGO. La aplicación está diseñada para cargar rápidamente y funcionar sin conexión a internet.

Arquitectura

La aplicación se compone de los siguientes archivos clave:

index.html:

Función: Es el archivo principal que contiene la estructura del "App Shell".

Contenido: Incluye el encabezado, el menú de navegación, un área de contenido principal (vacía inicialmente) y un pie de página.

Scripts:

Carga Tailwind CSS para el diseño.

Registra el sw.js (Service Worker).

Contiene la lógica de la aplicación para simular la carga de contenido dinámico (productos de LEGO).

Vincula al manifest.json.

sw.js (Service Worker):

Función: Es el corazón de la PWA. Actúa como un proxy entre la aplicación y la red.

install Event: Durante la instalación, almacena en caché los archivos del App Shell (index.html, CSS, etc.). Esto asegura que la interfaz base de la aplicación esté siempre disponible, incluso sin conexión.

activate Event: Se encarga de limpiar cachés antiguas para mantener la aplicación actualizada.

fetch Event: Intercepta todas las peticiones de red. Implementa una estrategia "Cache, falling back to network":

Primero, intenta encontrar el recurso solicitado en la caché.

Si lo encuentra, lo sirve inmediatamente, resultando en una carga casi instantánea.

Si no está en la caché, realiza la petición a la red, sirve la respuesta al navegador y la almacena en caché para futuras peticiones.

manifest.json:

Función: Es un archivo de configuración en formato JSON que le dice al navegador cómo debe comportarse la aplicación web cuando se "instala" en el dispositivo del usuario.

Propiedades: Define el nombre de la aplicación, los íconos, el color del tema, la URL de inicio y cómo debe mostrarse la ventana (standalone para que parezca una app nativa).

Cómo Probar la Funcionalidad Sin Conexión

Para verificar que el App Shell funciona correctamente sin conexión, sigue estos pasos:

Servir los archivos: Para que el Service Worker funcione, debes servir los archivos desde un servidor web. No funcionará abriendo index.html directamente desde el sistema de archivos (file://). Puedes usar herramientas como:

Live Server (extensión para VS Code).

Abrir la aplicación: Navega a la dirección de tu servidor local (http://127.0.0.1:5500/index.html) en un navegador compatible con PWA (Chrome, Firefox, Edge).

Verificar la instalación del Service Worker:

Abre las herramientas de desarrollador (F12 o Ctrl+Shift+I).

Ve a la pestaña Aplicación.

En el panel izquierdo, selecciona Service Workers. Deberías ver que sw.js está activado y en ejecución para tu página.

En la misma pestaña, ve a Cache Storage. Deberías ver una caché llamada lego-store-pwa-shell-v1 con los archivos del App Shell dentro.

Simular la desconexión:

En la pestaña Service Workers, marca la casilla Offline.

También puedes ir a la pestaña Network (Red) y seleccionar "Offline" en el menú desplegable de throttling.

Recargar la página:

Con la conexión "Offline" activada, recarga la página F5.

Resultado esperado: La página debería cargar instantáneamente desde la caché del Service Worker. Verás el encabezado, el pie de página y la estructura general, junto con un indicador de "¡Sin conexión!". El contenido dinámico (la lista de productos) no se cargará porque la simulación de red fallará, pero el esqueleto de la aplicación (el App Shell) funcionará perfectamente.