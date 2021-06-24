
export default class AutoPause {
 
  /**
   * Método para correr el plugin (puede llevar cualquier nombre).
   * Recordar que el parámetro player lo pasa en automático el
   * objeto de configuración del MediaPlayer, específicamente la
   * propiedad 'pligins', gracias al array que asigna la instancia
   * en el mismo constructor.
   */
  run(player) {
    /**
     * En este caso, la clase IntersectionObserver provee una forma
     * asíncrona de observar cambios en la intersección de un elemento
     * en específico con su ancestro (o cualquier otro elemento ancestro
     * superior) del DOM.
     */
    const observer = new IntersectionObserver(this.handler(player), {
      /**
       * El umbral (threshold) define qué porciento del elemento 
       * tiene que tener intersección con el ancestro para disparar
       * el handler. En este caso, el efecto que se espera es pausar
       * el video cuando este ya no sea visible para el usuario.
       */
      threshold: 0.25
    });
    /**
     * Vinculando el observer al tag <video/> respecto a la pantalla
     * del navegador. Este elemento del DOM se encuentra dentro del
     * mismo player, que viene a ser una instancia de la clase
     * MediaPlayer.
     */
    observer.observe(player.video);
  }

  /**
   * Handler se dispara cuando el IntersectionObserver detecte
   * el evento de interés especificado.
   * 
   * 'entries' contiene una lista de todos los objetos que se están
   * observando.
   */
  handler(player) {
    /**
     * Retornando callback. Esto para poder cachar el player, pero pasando
     * solo el callback al IntersectionObserver es suficiente. Simplement
     * un truco.
     */
    return entries => {
      const [ entry ] = entries;
      const { intersectionRatio } = entry;
      /**
       * Validando que el elemento esté saliendo de la pantalla,
       * y no entrando.
       */
      if (intersectionRatio <= 0.25) {
        // ...Item yendose del viewport
        player.video.pause();
      }
    }
  }

}