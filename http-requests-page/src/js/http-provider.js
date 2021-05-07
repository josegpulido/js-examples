
/**
 * Clase que interactua con el API endpoint y
 * además implementa un patrón Singleton.
 */
export class HttpProvider {

  // Propiedades estáticas
  static jokesUrl = 'https://api.chucknorris.io/jokes/random';
  static usersUrl = 'https://reqres.in/api/users?page=2';
  static cloudinaryUrl = 'https://api.cloudinary.com/v1_1/djzhlml3l/upload';
  static cloudinaryPreset = 'zopftssr';
  static instance;

  // Constructor que implementa Singleton
  constructor() {
    if (!!HttpProvider.instance) return HttpProvider.instance;
    HttpProvider.instance = this;
  }

  // Promise para descargar un chiste de Chuck Norris
  async getJoke() {
    try {
      // Llamando al endpoint
      const response = await fetch(HttpProvider.jokesUrl);
      // Si el objeto respuesta no tiene un status de 200, lanzar error
      if (!response.ok) {
        throw Error(`No se pudo realizar la petición HTTP a ${HttpProvider.jokesUrl}`);
      }
      // Desestructurando propiedades de interés
      const { icon_url, id, value } = await response.json();
      // Retornar objeto de respuesta
      return { icon_url, id, value };
    } catch(err) {
      /**
       * Disparando el error cachado en el try en caso de haberlo.
       * Aquí se podría hacer un manejo específico de los errores y
       * como estos interactuan con la respuesta de la Promise.
       */
      throw err;
    }
  }

  // Promise para descargar una lista de usuarios aleatoria
  async getUsers() {
    // Llamando al endpoint
    const response = await fetch(HttpProvider.usersUrl);
    // Si el objeto respuesta no tiene un status de 200, lanzar error
    if (!response.ok) {
      throw Error(`No se pudo realizar la petición HTTP a ${HttpProvider.usersUrl}`);
    }
    // Desestructurando propiedades de interés
    const { data } = await response.json();
    // Retornar objeto de respuesta
    return data;
  }

  // Función para subir imagen a Cloudinary
  async uploadFile(file) {
    /**
     * FormData es un objeto parecido a un formulario HTML, y aquí
     * se usa para pasarle al fetch la información a modo de
     * formulario.
     */
    const formData = new FormData();
    formData.append('upload_preset', HttpProvider.cloudinaryPreset);
    formData.append('file', file);

    try {
      // Llamando al endpoint
      const response = await fetch(HttpProvider.cloudinaryUrl, {
        method: 'POST',
        body: formData
      });
      // Si el objeto respuesta no tiene un status de 200, lanzar error
      if (!response.ok) {
        throw await response.json();
      }
      // Desestructurando propiedades de interés
      const data = await response.json();
      // Retornar objeto de respuesta
      return data;
    } catch (err) {
      throw err;
    }
  }
}