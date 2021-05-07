
// Recuperando el HTML Elements del body
const body = document.body;
let usersTable;

// Función que crea el template inicial de la sección de chistes
function createTemplate() {

  // Template HTML harcodeado
  const rawHtml = `
  <h1 class="mt-5">Usuarios</h1>
  <hr>

  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Email</th>
        <th scope="col">Nombre</th>
        <th scope="col">Avatar</th>
      </tr>
    </thead>
  </table>
  `;

  // Creando div para hacer append del template harcodeado
  const template = document.createElement('div');
  template.innerHTML = rawHtml;
  body.appendChild(template);

}

// Función que recupera las HTML Elements una vez se rederize el template
function retrieveTemplateEntities() {

  // Asigando entidad HTML Element existente
  usersTable = document.querySelector('table');

}

// Función que dibuja en el template los usuarios en formato tabla
function assignDataToTable(users) {

  // Creando HTML Element para dibujar tabla de usuarios
  users.forEach(({ id, email, first_name, avatar }) => {
    // Creando cadena de texto con table rows concatenados
    const tableRow = document.createElement('tr');
    tableRow.classList.add('table-row');
    tableRow.innerHTML = `
      <th scope="col">${id}</th>
      <th scope="col">${email}</th>
      <th scope="col">${first_name}</th>
      <th scope="col">
        <img class src="${avatar}"></img>
      </th>
    `;
    usersTable.append(tableRow);
  });

}

/**
 * Exportando las funciones que se ejecutarán una vez se llame
 * al init() de este fichero.
 */
export function init(initialData) {
  // Creando template de sección de usuarios
  createTemplate();
  // Asignando events listeners al template generado
  retrieveTemplateEntities();
  // Agregando tabla de usuarios una vez descargada la primera carga
  assignDataToTable(initialData);
}