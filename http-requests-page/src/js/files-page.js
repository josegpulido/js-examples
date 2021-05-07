// Providers
import { HttpProvider } from './http-provider';

// Trayendo instancia del servicio http
const httpProvider = new HttpProvider();

// Recuperando el HTML Elements del body
const body = document.body;
let inputFile;
let imgPhoto;

// Función que crea el template inicial de la sección de chistes
function createTemplate() {

  // Template HTML harcodeado
  const rawHtml = `
  <h1 class="mt-5">Subir archivos a Cloudinary</h1>
  <hr>

  <label>Selecciona una imagen:</label>
  <input type="file" accept="image/png, image/jpeg"/>

  <br>
  <img id="photoSetter" class="img-thumbnail img-thumbnail--placer" src="">
  `;

  // Creando div para hacer append del template harcodeado
  const template = document.createElement('div');
  template.innerHTML = rawHtml;
  body.appendChild(template);

  // Recuperando el HTML Element del input file
  inputFile = document.querySelector('input');
  imgPhoto = document.querySelector('#photoSetter');
}

// Función que asigna eventos a los HTML Elements necesarios
function assignEventsToEntities() {

  // Adjuntando evento onChange
  inputFile.addEventListener('change', (event) => {
    // Extrayendo archivo para subirlo a Cloudinary
    const file = event.target.files[0];
    // Subiendo el archivo
    httpProvider.uploadFile(file)
    .then(({ secure_url }) => {
      imgPhoto.src = secure_url;
    })
  });

}

/**
 * Exportando las funciones que se ejecutarán una vez se llame
 * al init() de este fichero.
 */
export function init(initialData) {
  // Creando template de sección para subir archivos
  createTemplate();
  // Asignando eventos a los HTML Elements necesarios
  assignEventsToEntities();
}