// Importando colors para colorear en consola
require('colors');
// Librería Inquirer.js para manejo de prompts en consola
const inquirer = require('inquirer');

// Función que imprime banner de la aplicación
function printAppBanner() {
  console.clear();
  console.log('=============================================='.green);
  console.log('   Weather Searcher | Selecciona una opción   '.green);
  console.log('==============================================\n'.green);
}

// Preguntas a responder junto con sus respuestas posibles
const questions = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué deseas hacer?',
    choices: formatQuestionChoices([
      'Buscar ciudad',
      'Historial de llamadas API',
      'Salir'
    ])
  }
];

// Método para asignar formato a set de opciones según lo requerido por inquirer
function formatQuestionChoices(choices) {
  return choices.map((choice, i) => {
    // Evaluando si la opción en cuestión es Salir
    if (i === (choices.length - 1))  {
      return {
        value: 'exit',
        name: `${'0'.green}. ${choice}`
      };
    }
    return {
      value: `opt-${i + 1}`,
      name: `${(i + 1).toString().green}. ${choice}`
    };
  });
}

// Método para seleccionar opción de menú principal por medio de flechas
function selectFromMenu() {

  printAppBanner();
  return inquirer.prompt(questions);

}

// Método para recibir una respuesta sobre cancelar o no un proceso cualquiera por ENTER
function cancelSelection() {
  return new Promise(resolve => {
    return inquirer.prompt([{
      type: 'input',
      name: 'response',
      message: `Presiona ${'ENTER'.green} para continuar, cualquier otra letra para cancelar:`
    }])
    .then(({ response }) => {
      // Retornando false para cancelar si es que se presionó la tecla ENTER
      if (response === '') {
        return resolve(false);
      }
      return resolve(true);
    })
  });
}

// Método para esperar al usuario para hacer exit de la pantalla actual
async function waitToExit() {
  while (true) {
    console.log(); // Imprimiendo salto de línea
    const { response } = await inquirer.prompt([{
      type: 'input',
      name: 'response',
      message: `Presiona ${'X'.green} para salir:`
    }]);
    if (response === 'x' || response === 'X') {
      break;
    }
  }
}

// Método para recibir un texto cualquiera desde consola
function requestInput() {
  return new Promise(resolve => {
    console.log(); // Imprimiendo salto de línea
    return inquirer.prompt([{
      type: 'input',
      name: 'response',
      message: `Ingresar nombre de ciudad:`,
      validate(value) {
        // Validando que el usuario no ingrese un texto vacío
        if (value.length === 0) {
          return Error('Por favor, ingrese un valor.');
        }
        return true;
      }
    }])
    .then(({ response }) => {
      return resolve(response);
    })
  });
}

// Método para seleccionar un resultado de búsqueda
function selectResult(results) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'coordinates',
      message: 'Seleccionar lugar:',
      choices: results.map((result, index) => {
        return {
          value: {
            lng: result.center[0],
            lat: result.center[1]
          },
          name: `(${index + 1}) :: ${result.place_name_es}`
        };
      })
    }
  ]);
}

// Método para listar los registros del historial
function showHistoryRecords(records) {
  records.forEach((record, index) => {
    console.log(); // <-- Salto de línea
    const i = `${records.length - index}. `;
    if (record.type === 'owm') {
      console.log(i + 'Open Weather Map'.green);
    }
    if (record.type === 'mapbox') {
      console.log(i + 'Mapbox Places'.green);
    }
    console.log(`${formatTimestamp(record.timestamp)} --> ${record.url.toString().yellow}`);
  });
}

// Método para dar formato a un timestamp
function formatTimestamp(timestamp) {
  let chain = '';
  const date = new Date(timestamp);
  chain += `${date.getDate()}/`;
  chain += `${date.getMonth()}/`;
  chain += `${date.getFullYear()}, `;
  chain += `${date.getHours()}:`;
  chain += `${date.getMinutes()} hrs`;
  return chain; // 13/2/2021, 15:42 hrs
}

module.exports = {
  selectFromMenu,
  cancelSelection,
  waitToExit,
  requestInput,
  selectResult,
  showHistoryRecords
};