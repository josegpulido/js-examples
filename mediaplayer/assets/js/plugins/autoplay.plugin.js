
export default class AutoPlay {
 
  /**
   * Método para correr el plugin (puede llevar cualquier nombre).
   * Recordar que el parámetro player lo pasa en automático el
   * objeto de configuración del MediaPlayer, específicamente la
   * propiedad 'pligins', gracias al array que asigna la instancia
   * en el mismo constructor.
   */
  run(player) {
    player.togglePlay();
  }

}