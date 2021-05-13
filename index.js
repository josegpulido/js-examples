// Utilidades de Node
const path = require('path');
// Framework de Express
const express = require('express');
// Inicializando instancia de express
const app = express();
/**
 * Handlebars permite interpolar valores trabajados
 * en Javascript directamente sobre un template HTML,
 * renderizarlo del lado del backend y servirle al
 * cliente el template modificado. Útil para generar
 * contenido semi-dinámico.
 * 
 * Nota: El paquete original es 'hbs', pero la comunidad
 * creo 'express-handlebars' el cual es mejor.
 */
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  // Indicando a handlebars la extensión de archivo a usar
  extname: '.hbs'
});

// Constantes
const PORT = 3000;

/**
 * Estableciendo un middleware que sirva todo el
 * contenido de la carpeta /public como estático.
 * 
 * Al ejecutarse el middleware antes que las rutas,
 * el contenido estático tiene proridad, p. ej.,
 * el directorio /hello-world servirá la ruta aún
 * y existiendo una ruta get /hello-world definida
 * (en caso de una post, update, etc, cambia).
 */
app.use(
  express.static('public')
);
/**
 * Indicandole a Express usar como template engine
 * a Handlebars, el cual revisa por defecto los templates
 * HTML ubicados en el directorio /views.
 */
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
/**
 * Indicando a Express cual es el directorio de views que tomará
 * para leer todo lo relacionado a handlebars, configurado
 * en las líneas anteriores.
 */
app.set('views', path.join(__dirname, 'views'));

// Estableciendo rutas disponibles
// ...Objeto json cualquiera
app.get('/random-json', (request, response) => {
  response.setHeader('Content-Type', 'application/json'); // Esto lo infiere Express, pero no hace daño especificarlo
  // Respondiendo al cliente con un objeto literal json
  response.send({
    age: 87,
    description: 'Lorem ipsum dolor sit amet.',
    alive: true
  });
});

// ...Respondiendo con un texto simplemente
app.get('/hello-world', (request, response) => {
  response.send('Hola, Mundo! Soy un texto simple sin formato...');
});

// ...Renderizando un par de templates con Handlebars
app.get('/mailtome', (request, response) => {
  /**
   * Renderizando vista con el template engine configurado
   * como middleware.
   * 
   * El parámetro layout deshabilita el directorio /layouts,
   * el resto de parámetros simplemente pasan al template.
   */
  response.render('contact', {
    layout: false,
    myName: 'José Guillermo',
    country: 'México',
    randomNumber: () => {
      return Math.floor(Math.random() * (100 - 20) + 20)
    }
  });
});
app.get('/other-hbs-page', (request, response) => {
  response.render('other-page', {
    layout: false
  });
});

// ...Error 404, '*' es un comodín en donde cae cualquier ruta y subruta
app.get('*', (request, response) => {
  // Sirviendo un archivo html
  response.sendFile(__dirname + '/public/404.html');
});

/**
 * Redirigiendo todas las sub rutas de la app de Angular
 * para que las maneje su propio routing.
 */
app.get('/angular-app/*', (request, response) => {
  response.sendFile(__dirname + '/public/angular-app/index.html');
});

// Indicandole a express el puerto por el que servirá la aplicación
app.listen(PORT, () => {
  console.log(`Servidor web con Express iniciado en puerto ${PORT}`);
});