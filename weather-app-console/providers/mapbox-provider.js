// Axios maneja peticiones HTTP del lado de Node
const axios = require('axios');
// Variables de entorno
require('dotenv').config();
// Utilidades
const History = require('../helpers/history');
// Recuperando historial de búsquedas de la BD
const history = new History();

class MapboxProvider {

  // Propiedades estáticas
  static language = 'es';

  // Constructor
  constructor() {}

  /**
   * Método para obtener 5 sugerencias de lugares en
   * base a un nombre de ciudad.
   */
  async searchCity(city) {
    try {
      /**
       * Creando instancia de axios para segmentar automáticamente
       * miembros del URL.
       */
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`;
      const instance = axios.create({
        baseURL: url,
        params: {
          'access_token': process.env.MAPBOX_APIKEY,
          'limit': 5,
          'language': MapboxProvider.language
        }
      });
      // Llamando get y desestructurando respuesta
      const { data } = await instance.get();
      const { features:results } = data;
      // TODO: Podría implementarse una clase que tipe al registro del historial
      history.addRecord({
        type: 'mapbox',
        url: url,
        timestamp: Date.now()
      });
      // Retornando resultados
      return results;
    } catch (err) {
      throw Error(`Error getting city with mapbox and axios ${err}`);
    }
  }
}

module.exports = MapboxProvider;