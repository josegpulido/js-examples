# Prácticas en Javascript, Typescript y Node

Ordenadas de menor a mayor dificultad y por tecnología.

### Indice
- **/npm-first-package**. Creación y publicación de una [dependencia de NPM](https://www.npmjs.com/package/simple-hello-messages) invocable desde consola.
- **/ecmascript**. Ejemplos de características de Javascript escritos en distintas versiones de ECMAScript.
- **/webpack-page**. Configuración básica de Webpack 4+ para proyectos web con Javascript puro.
  - Configuración de entorno de desarrollo y entorno de producción mediante archivos de configuración.
  - Transpilación de sintaxis moderna a ES5 con Babel y vinculación al HTML.
  - Minificación e inyección de estilos CSS al Javascript.
  - Generación de archivos minificados de estilos CSS  y vinculación al HTML.
  - Preservación de assets.
  - Automatización de tareas como limpieza de carpeta /dist en cada $ npm run build.
- **/http-requests-page**. Proyecto web con Javascript puro que consume la API de [Chistes de Chuck Norris](https://api.chucknorris.io/) a través de HTTP.
  - Petición GET con fetch.
  - Promesas en cadena.
  - Subida de imagenes a Cloudinary.
- **/todo-app-console**. Aplicacion de TODOs para consola. [Demostración](https://drive.google.com/file/d/1zJJC-RhkJfh5b_aFFkBP0XmIESk8F6Fe/view?usp=sharing)
  - Manejo avanzado de interfaces gráficas para consola con paquete inquirer.js.
  - Coloreando impresiones en consola con paquete colors.
  - Generación de identificadores únicos con paquete uuidv4.
  - Escritura y lectura de un archivo json en el directorio del proyecto a modo de base datos.
- **/weather-app-console**. Aplicación que para consultar el clima de una ciudad desde consola. [Demostración](https://drive.google.com/file/d/1dsmeNVoJdaZCTpQS_Gg0JfcklZKlVNx3/view?usp=sharing)
  - Manejo básico de variables de entorno con paquete dotenv.
  - Consumo del API endpoint de Mapbox Places y OpenWeatherMap a través de axios.
  - Historial de llamadas a API endpoints.
- **/express-server**. Servidor web con manejo básico de rutas. [Demostración](https://express-app-josegpulido.herokuapp.com/)
  - Manejo básico de rutas tipo GET.
  - Generación de templates semi-dinámicos con paquete express-handlebars.
  - Renderizado en el lado del servidor de app de Angular 2+ genérica.
- **/basic-rest-api**. Servidor REST API básico.
  - Encapsulamiento de Express mediante una clase.
  - Manejo de rutas (GET, PUT, POST, DELETE, PATCH) a modo de middleware.
  - Implementación básica de paquete cors.
  - Implementación básica de middleware express.json().
  - Procesamiento de parámetros de segmento y parámetros opcionales.
- **/marketplace**. Servidor REST API con conexión a MongoDB y autenticación de usuarios que sirve una marketplace de artículos sobre la trilogía de Back to the Future. [Demostración](https://node-marketplace-josegpulido.herokuapp.com/)
  - Conexión a MongoDB Atlas con paquete mongoose.
  - Manejo de Schemas de MongoDB.
  - Encriptación de contraseña por hash de una vía con paquete bcrypt.js.
  - Implementación básica-intermedia de paquete express-validator.
  - Autenticación de usuarios y generación de tokens de sesión con paquete jsonwebtoken.
  - Autenticación de usuarios de Google y validación de tokens de sesión respectivos con paquete google-auth-library.
  - Protección de rutas para usuarios autenticados y/o según su rol con middlewares personalizados.
  - Búsquedas en colecciones de MongoDB a través de queries.
  - Implementación básica de subida y descarga de imagenes a servidor con paquete express-fileupload.
  - Rutas de API REST:
    - **POST** ...herokuapp.com/auth/login (Obtener JWT de sesión)
    - **POST** ...herokuapp.com/user (Crear usuario)
    - **POST** ...herokuapp.com/user/with-google (Crear usuario con Google Sign In)
    - **PUT** ...herokuapp.com/user/:id (Actualizar usuario)
    - **GET** ...herokuapp.com/user (Obtener usuarios)
    - **DELETE** ...herokuapp.com/user/:id (Borrar usuario)
    - **GET** ...herokuapp.com/category (Obtener categorías)
    - **GET** ...herokuapp.com/category/:id (Obtener categoría en específico)
    - **POST** ...herokuapp.com/category/ (Crear categoría)
    - **PUT** ...herokuapp.com/category/:id (Actualizar categoría)
    - **DELETE** ...herokuapp.com/category/:id (Borrar categoría)
    - **GET** ...herokuapp.com/product (Obtener productos)
    - **GET** ...herokuapp.com/product/:id (Obtener producto en específico)
    - **POST** ...herokuapp.com/product (Crear producto)
    - **PUT** ...herokuapp.com/product/:id (Actualizar producto)
    - **DELETE** ...herokuapp.com/product/:id (Borrar producto)
    - **GET** ...herokuapp.com/search/products/:query (Ejecutar búsqueda de productos)
    - **POST** ...herokuapp.com/images/product/:id (Subir imagen de producto)
    - **GET** ...herokuapp.com/images/product/:id (Descargar imagen de producto)
- **/socket-server**. Servidor web que implementa web sockets.
  - Implementación de web sockets con Socket.io.
- **/socket-chat**. Aplicación de chat en tiempo real.
  - Autenticación de JWT en conexiones de web sockets.
  - Creación de salas y mensajes privados.
- **/ts-express-server**. Servidor web Express en Typescript.
  - Configuración básica de Typescript y scripts.
- **/web-scraping**. Bot de web scraping con puppeteer.
  - Extracción de título h1 de la web Wikipedia con paquete puppeteer.
- **/electron-app**. Aplicación web empaquetada para escritorio (Windows, Mac y Linux) con electron.
  - Manejo básico de empaquetamiento con paquete electron.
- **/mediaplayer**. Media player app en Javascript puro con video de Invincible.
  - Manejo básico de etiqueta de video y sus métodos.
  - Creación y manejo básico de plugins propios.
  - Implementación de Service Worker para cachear contenido web.
  - Manejo de APIS del DOM:
    - InstersectionObserver para observar los valores del viewport de la página.
    - VisibilityChange para detectar cuando el tab del navegador ha dejado de mostrar la página.
- **/unit-testing**. Imitación de un framework de Unit Testing.
  - Función it() y función _expect().