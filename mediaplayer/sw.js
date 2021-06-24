
/**
 * self es la versión de this para un ServiceWorker, porque
 * hace referencia a la instancia misma del SW.
 * 
 * El evento 'install' se dispara cuando el navegador instale
 * el SW.
 */
self.addEventListener('install', event => {
  /**
   * Invocando método del event que espera a que una promesa se
   * ejecute para poder continuar con el callback. En este caso,
   * la promesa es la preparación del precaché.
   * 
   * El precaché es una lista de recursos y assets que le indica
   * al navegador que tiene que preservar dichos elementos en
   * memoria caché.
   */
  event.waitUntil(precache());
});

// Método que prepara el precaché
async function precache() {
  /**
   * La única forma de trabajar con el caché del navegador es
   * a través del API del DOM. Esta se encuentra en el objeto
   * global caches.
   * 
   * Abriendo espacio en caché nombrado como 'v1'. Si este no
   * existe, crea uno nuevo.
   */
  const cache = await caches.open('v1');
  /** 
   * En dicho espacio, se almacenarán los ficheros y assets más
   * importantes del proyecto mismo. El efecto que se espera lograr
   * es que aún habiendo perdido conexión a internet, al volver a
   * recargar la página esta siga volviendo a renderizar y ejecutar
   * dichos archivos cacheados, permitiendo al usuario navegar sin
   * internet.
   * 
   * Para evitar que los usuarios nunca puedan actualizar a una
   * versión nueva de la página web cacheada, se puede emplear
   * una estrategia se revise la antiguedad del caché y entonces
   * volver a solicitar los recursos:
   * event.waitUntil(...);
   * ...
   * {
   *  const response = await caches.open('v1');
   *  return cache.put(request, response);
   * }
   */
  return cache.addAll([
    /**
     * '/' es un simil de '/index.html', pero se especifica de ambas
     * maneras porque aunque para el navegador sean lo mismo, para el
     * SW no.
     */
    '/',
    '/index.html',
    '/assets/index.css',
    '/assets/js/index.js',
    '/assets/images/clip.mp4',
    '/assets/js/plugins/autoplay.plugin.js',
    '/assets/js/plugins/autopause.plugin.js',
    '/assets/js/models/player.model.js'
  ]);
}

/**
 * El evento 'fetch' se dispara cuando el navegador emite
 * una petición HTTP, indicandole al SW que es momento de
 * internvenir.
 * 
 * La intención de este callback es analizar la petición que se
 * ha hecho y compararla contra lo almacenado en caché, para así
 * recuperar los resultados de dicha petición en lugar de volver
 * a mandar la petición HTTP desde cero.
 */
self.addEventListener('fetch', event => {
  /**
   * Usualmente, solo se interceptan las peticiones GET, ya que
   * son operaciones de consulta simples (archivos, estilos,
   * imágenes, etc), a diferencia del resto de métodos (POST,
   * PUT, etc) que contienen información volátil y/o sensible,
   * y que además requieren de un manejo de su respuesta más
   * robusto.
   */
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }
  // Petición GET detectada, comparando contra caché...
  event.respondWith(cachedResponse(request));
});

/**
 * Función que compara resultados de peticiones HTTP contra
 * el caché.
 */
async function cachedResponse(request) {
  // Recuperando espacio en caché llamado 'v1'
  const cache = await caches.open('v1');
  /**
   * Preguntandole al caché si ya existe una copia de la
   * petición HTTP. Esto indicaría que dicha petición ya se
   * realizó con anterioridad, por lo que sería oportuno retornar
   * dicho recurso.
   */
  const response = await cache.match(request);
  if (response) {
    return response;
  }
  // Lanzando petición HTTP ya que la misma aún no estaba cacheada
  return fetch(request);
}