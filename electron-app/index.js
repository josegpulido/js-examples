
// Utilidades de electron
const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
  /**
   * Creando ventana en la que se vaciaran las
   * vistas.
   */
  let mainWindow = new BrowserWindow({
    width: 400,
    height: 300
  });
  // Cargando primera vista
  mainWindow.loadFile('./index.html');
});