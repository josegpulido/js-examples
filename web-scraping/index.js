
// Utilidades de puppeteer
const puppeteer = require('puppeteer');

/**
 * Patrón módulo para poder utilizar asyncs
 * de primeras.
 */
(async () => {
  /**
   * Iniciando instancia de navegador web. El paquete
   * puppeteer utiliza Chromium como navegador, el cual
   * se instala junto con dicho módulo.
   */
  console.log('Abriendo browser...');
  const browser = await puppeteer.launch();
  // Abriendo página en el navegador...
  const page = await browser.newPage();
  await page.goto('https://es.wikipedia.org/wiki/Mr._Robot');
  // Obteniendo título de la página mediante script
  const wikiTitle = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1.innerHTML;
  });
  // Mostrando información recabada en consola
  console.log(`Título de la página : ${wikiTitle}`);
  // Cerrando browser
  browser.close();
  console.log('Browser cerrado');
})();