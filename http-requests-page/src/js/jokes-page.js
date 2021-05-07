// Providers
import { HttpProvider } from './http-provider';

// Trayendo instancia del servicio http
const httpProvider = new HttpProvider();

// Recuperando el HTML Elements del body
const body = document.body;
let anotherJokeButton, jokesOrderedList;

// Función que crea el template inicial de la sección de chistes
function createTemplate() {

  // Template HTML harcodeado
  const rawHtml = `
  <h1 class="mt-5">Chistes</h1>
  <hr>

  <button class="btn btn-primary">Otro chiste</button>

  <ol class="mt-4 list-group"></ol>
  `;

  // Creando div para hacer append del template harcodeado
  const template = document.createElement('div');
  template.innerHTML = rawHtml;
  body.appendChild(template);

}

// Función que recupera las HTML Elements una vez se rederize el template
function retrieveTemplateEntities() {

  // Asigando entidad HTML Element existente
  anotherJokeButton = document.querySelector('button');
  jokesOrderedList = document.querySelector('ol');
  
  // Asignando click event listener
  anotherJokeButton.addEventListener('click', async () => {
    // Deshabilitando button hasta que el promise se complete
    anotherJokeButton.disabled = true;
    // Dibujando nuevo chiste en el template
    addJokeToTemplateList(await httpProvider.getJoke());
    // Habilitando button hasta que el promise se complete
    anotherJokeButton.disabled = false;;
  });

}

// Función que dibuja en el template un nuevo chiste descargado
function addJokeToTemplateList(joke) {

  // Creando HTML Element para dibujar nuevo item de lista de chistes
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item');
  listItem.innerHTML = `
    <b>${joke.id}</b>: <p>${joke.value}</p>
  `;
  jokesOrderedList.append(listItem);

}

/**
 * Exportando las funciones que se ejecutarán una vez se llame
 * al init() de este fichero.
 */
export function init(initialJoke) {
  // Creando template de sección de chistes
  createTemplate();
  // Asignando events listeners al template generado
  retrieveTemplateEntities();
  // Agregando primer chiste (el que se descargó una vez abierta la página)
  addJokeToTemplateList(initialJoke);
}