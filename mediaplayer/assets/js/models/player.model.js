
export default class MediaPlayer {

  /**
   * Constructor que recibe como parámetro un objeto de
   * configuración.
   * 
   * Se asignan parámetros opcionales al desestructurado
   * porque esto ayuda a reconocer el tipado del los objetos.
   */
  constructor({
    htmlElement = document.querySelector('video'),
    plugins = new Array()
  }) {
    // Asignando valores a sus respectivas propiedades
    this.video = htmlElement;
    this.plugins = plugins;
    /**
     * Poniendo el video en mute para permitir el autoplay
     * según lo requerido por lo estándares de browsers.
     */
    this.video.muted = true;
    // Corriendo plugins
    this._initPlugins();
  }

  // Método para inicializar los plugins del elemento video
  _initPlugins() {
    this.plugins.forEach(plugin => {
      plugin.run(this);
    });
  }

  // Método para reproducir o pausar el video
  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }
  
  // Método para hacer mute o unmute sobre el volumen del video
  toggleMute() {
    this.video.muted = !this.video.muted;
  }

}