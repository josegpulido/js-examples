// Axios maneja peticiones HTTP del lado de Node
const axios = require('axios');
// Variables de entorno
require('dotenv').config();
// Utilidades
const History = require('../helpers/history');
// Recuperando historial de búsquedas de la BD
const history = new History();

class WeatherProvider {

  // Propiedades estáticas
  static language = 'es';
  static units = 'metric'; // <-- Solicitar a OWM mediciones en grados Celsius

  // Constructor
  constructor() {}

  /**
   * Método para obtener la temperatura ambiente de unas
   * coordenadas en específico.
   */
  async getTemperature(lat, lng) {
    try {
      /**
       * Creando instancia de axios para segmentar automáticamente
       * miembros del URL.
       */
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const instance = axios.create({
        baseURL: url,
        params: {
          'appid': process.env.OPENWEATHERMAP_APIKEY,
          'lat': lat,
          'lon': lng,
          'units': WeatherProvider.units,
          'lang': WeatherProvider.language
        }
      });
      // Llamando get y desestructurando respuesta
      const { data } = await instance.get();
      const { main:weather } = data;
      // TODO: Podría implementarse una clase que tipe al registro del historial
      history.addRecord({
        type: 'owm',
        url: url,
        timestamp: Date.now()
      });
      // Retornando resultados
      return {
        current: weather.temp,
        min: weather.temp_min,
        max: weather.temp_max
      };
    } catch (err) {
      throw Error(`Error getting temperature measure with openweathermap and axios ${err}`);
    }
  }
}

module.exports = WeatherProvider;