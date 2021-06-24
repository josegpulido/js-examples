// Importaciones
import MyMediaPlayer from './models/player.model.js';
import AutoPlay from './plugins/autoplay.plugin.js';
import AutoPause from './plugins/autopause.plugin.js';

// Obteniendo elementos de interés del DOM
const video = document.querySelector('video');
const playButton = document.querySelector('#playButton');
const muteButton = document.querySelector('#muteButton');

// Instanciando clase para controlar el player
const player = new MyMediaPlayer({
  htmlElement: video,
  /**
   * La propiedad 'plugins' pasa de forma automática
   * como parámetro a la misma instancia del MediaPlayer.
   */
  plugins: [
    new AutoPlay(),
    new AutoPause()
  ]
});

/**
 * El siguiente evento detecta cuando el usuario ha cambiado de
 * tab en el navegador.
 */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    player.video.pause();
  }
});

/**
 * Evento para reproducir o pausar video al hacer click en
 * el botón ubicado en el DOM. Mozilla Firefox y otros browsers
 * no permiten reproducir video o audio de forma automática.
 */
playButton.addEventListener('click', () => {
  player.togglePlay();
});

// Mute o unmute el volumen del video
muteButton.addEventListener('click', () => {
  player.toggleMute();
});

if ('serviceWorker' in navigator) {
  /**
   * ...Navegador sí soporta Service Worker.
   * 
   * En el caso de Firefox, hay que añadir el dominio de
   * desarrollo (localhost:8080 en mi caso) a la whitelist
   * de la 'Protección antirrastreo mejorada' y a la whitelist
   * de Cookies > Administrar excepciones, en about:preferences#privacy.
   * 
   * Registrando uno SW nuevo. Es recomendable situarlos
   * a nivel de raíz del scaffolding para tener menos inconvenientes
   * en las importaciones de recursos y assets.
   */
  navigator.serviceWorker.register('./sw.js')
  .catch(err => {
    console.log(`Ocurrió un error registrando el Service Worker : ${err}`);
  });
}
