// Importando colors para colorear en consola
require('colors');
// Utilidades
const terminal = require('./helpers/inquirer-utils');
const History = require('./helpers/history');
const MapboxProvider = require('./providers/mapbox-provider');
const WeatherProvider = require('./providers/weather-provider');

/**
 * Esta aplicación correrá varios ejemplos asíncronos, y como
 * la condición para usar await es que se invoque dentro
 * de un bloque async, entonces utilizar patrón módulo
 * para autoinvocar.
 */
(async () => {

  // Creando instancia del provider de servicios HTTP para Mapbox Places
  const mapbox = new MapboxProvider();
  // Creando instancia del provider de servicios HTTP para OpenWeatherMap
  const weather = new WeatherProvider();
  // Recuperando historial de búsquedas de la BD
  const history = new History();
  history.init();
  
  /**
   * Desplegar menú de opciones hasta que el usuario
   * decida salirse seleccionado 'exit'.
   */
  let selected = '';
  do {
     
    // Deesctucturando objeto que retorna la promesa
    const { option } = await terminal.selectFromMenu()

    // Saltar a la sig. iteración si el usuario cancela la selección
    if (await terminal.cancelSelection()) {
      continue;
    }

    // Actualizando la opción seleccionada
    selected = option;

    // Procesando la respuesta
    switch(option) {
      case 'opt-1':
        // Buscando ciudad por nombre
        const city = await terminal.requestInput();
        // Buscar la ciudad con MapBox Places para extraer 5 sugerencias de lat-lng
        const results = await mapbox.searchCity(city);
        // Mostrar lista de resultados y seleccionar uno
        const { coordinates } = await terminal.selectResult(results);
        // Obteniendo la temperatura de coordenadas con OpenWeatherMap
        const temperature = await weather.getTemperature(coordinates.lat, coordinates.lng);
        // Imprimir información recolecatada por Mapbox Places y OpenWeatherMap
        console.log('\nlng'.green + `: ${coordinates.lng}`);
        console.log('lat'.green + `: ${coordinates.lat}`);
        console.log('temperatura'.green + `: ${temperature.current}ºC`);
        console.log('t. min.'.green + `: ${temperature.min}ºC`);
        console.log('t. máx.'.green + `: ${temperature.max}ºC`);
        // Teclear 'x' para salir
        await terminal.waitToExit();
      break;
      case 'opt-2':
        // Ver historial de búsquedas
        terminal.showHistoryRecords(history.records);
        // Teclear 'x' para salir
        await terminal.waitToExit();
      break;
      default:
        continue;
    }
  
  } while(selected !== 'exit');

})();