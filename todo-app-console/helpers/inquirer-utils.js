// Importando colors para colorear en consola
require('colors');
// Librería Inquirer.js para manejo de prompts en consola
const inquirer = require('inquirer');

// Función que imprime banner de la aplicación
function printAppBanner() {
  console.clear();
  console.log('========================================'.green);
  console.log('   The TODOer | Selecciona una opción   '.green);
  console.log('========================================\n'.green);
}

// Preguntas a responder junto con sus respuestas posibles
const questions = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué deseas hacer?',
    choices: formatQuestionChoices([
      'Crear tarea',
      'Ver todas las tareas',
      'Ver tareas completadas',
      'Ver tareas pendientes',
      'Completar tarea(s)',
      'Borrar tarea',
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
      message: `Ingresar descripción de tarea:`,
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

// Método para imprimir por consola una lista de tasks
function showTasks(tasks, filterBy = undefined) {
  // Filtrando lista
  for (let i = (tasks.length - 1); i >= 0; i--) {
    switch(filterBy) {
      case 'complete':
        if (tasks[i].completed) continue;
      break;
      case 'pending':
        if (tasks[i].completed === undefined) continue;
      break;
      default:
        continue;
    }
    tasks.splice(i, 1);
  }
  // Previniendo ejecución de bucles en caso de no haber elementos
  if (tasks.length === 0) {
    console.log('\nNo hay tareas para mostrar'.yellow);
    return;
  }
  // Imprimiendo lista
  console.log(); // Imprimiendo salto de línea
  tasks.forEach((task, index) => {
    console.log(`(${index + 1}) :: ${task.completed ? 'Completado'.green : 'Pendiente'.red} :: ${task.description}`);
  });
}

// Método para seleccionar una task
function selectTask(tasks) {
  // Previniendo ejecución de bucles en caso de no haber elementos
  if (tasks.length === 0) {
    console.log('\nNo hay tareas para mostrar\n'.yellow);
    return Promise.resolve({ id: [] });
  }
  console.log(); // Imprimiendo salto de línea
  return inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Seleccionar tarea:',
      choices: tasks.map((task, index) => {
        return {
          value: task.id,
          name: `(${index + 1}) :: ${task.completed ? 'Completado'.green : 'Pendiente'.red} :: ${task.description}`
        };
      })
    }
  ]);
}

// Método para completar una task
function completeTask(tasks) {
  // Filtrando lista
  for (let i = (tasks.length - 1); i >= 0; i--) {
    if (tasks[i].completed === undefined) continue;
    tasks.splice(i, 1);
  }
  // Previniendo ejecución de bucles en caso de no haber elementos
  if (tasks.length === 0) {
    console.log('\nNo hay tareas para mostrar\n'.yellow);
    return Promise.resolve({ ids: [] });
  }
  console.log(); // Imprimiendo salto de línea
  return inquirer.prompt([
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Seleccionar tarea:',
      choices: tasks.map((task, index) => {
        return {
          value: task.id,
          name: `(${index + 1}) :: ${task.description}`,
          checked: index === 0
        };
      })
    }
  ]);
}

module.exports = {
  selectFromMenu,
  cancelSelection,
  requestInput,
  waitToExit,
  showTasks,
  selectTask,
  completeTask
};