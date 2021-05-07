// Webpack 4+
// ...importando estilos CSS globales para MiniCssExtractPlugin
require('./styles.css');
// Providers
import { HttpProvider } from './js/http-provider';
// Templaters
import * as JokesTemplater from './js/jokes-page';
import * as UsersTemplater from './js/users-page';
import * as FilesTemplater from './js/files-page';

// Trayendo instancia del servicio http
const httpProvider = new HttpProvider();

// Obteniendo primer chiste
httpProvider.getJoke()
.then(joke => {
  // Renderizando el template de chistes por primera vez
  JokesTemplater.init(joke);
  // Obteniendo primera descarga de lista de usuarios
  return httpProvider.getUsers();
})
.then(users => {
  // Renderizando el template de tabla de usuarios por primera vez
  UsersTemplater.init(users);
  // Renderizando el template para subir archivos a Cloudinary
  FilesTemplater.init();
});