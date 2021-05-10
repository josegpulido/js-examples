// Importando colors para colorear en consola
require('colors');
// Utilidades
const terminal = require('./helpers/inquirer-utils');
const database = require('./helpers/database');
// Modelos
const { Task, Tasks } = require('./models/tasks');

/**
 * Esta aplicación correrá varios ejemplos asíncronos, y como
 * la condición para usar await es que se invoque dentro
 * de un bloque async, entonces utilizar patrón módulo
 * para autoinvocar.
 */
(async () => {

  // Creando lista de tasks
  const tasks = new Tasks();
  // Recuperando tasks de la BD
  tasks.items = database.getCollection();
  
  /**
   * Desplegar menú de opciones hasta que el usuario
   * decida salirse seleccionado 'exit'.
   */
  let selected = '';
  do {

    // Deesctucturando objeto que retorna la promesa
    const { option } = await terminal.selectFromMenu()

    // Saltar a la sig. iteración si el usuario cancela la selección
    if (await terminal.cancelSelection()) {
      continue;
    }

    // Actualizando la opción seleccionada
    selected = option;

    // Procesando la respuesta
    switch(option) {
      case 'opt-1':
        // Crear nueva task
        const description = await terminal.requestInput();
        tasks.addTask(description);
        // Guardando toda la colección de tasks en la BD
        database.overwriteCollection(tasks.itemsArray);
      break;
      case 'opt-2':
        // Ver todas las tareas
        terminal.showTasks(tasks.itemsArray);
        // Teclear 'x' para salir
        await terminal.waitToExit();
      break;
      case 'opt-3':
        // Ver tareas completadas
        terminal.showTasks(tasks.itemsArray, 'complete');
        // Teclear 'x' para salir
        await terminal.waitToExit();
      break;
      case 'opt-4':
        // Ver tareas pendientes
        terminal.showTasks(tasks.itemsArray, 'pending');
        // Teclear 'x' para salir
        await terminal.waitToExit();
      break;
      case 'opt-5':
        // Completar tarea(s)
        const { ids } = await terminal.completeTask(tasks.itemsArray);
        // Saltar a la sig. iteración si el usuario cancela la selección
        if (await terminal.cancelSelection()) {
          continue;
        }
        // Marcando los tasks como completados
        ids.forEach(id => {
          tasks.completeTask(id);
        });
        // Sobreescribiendo toda la colección de tasks en la BD
        database.overwriteCollection(tasks.itemsArray);
      break;
      case 'opt-6':
        // Borrar tarea
        const { id:removeId } = await terminal.selectTask(tasks.itemsArray);
        // Saltar a la sig. iteración si el usuario cancela la selección
        if (await terminal.cancelSelection()) {
          continue;
        }
        tasks.removeTask(removeId);
        // Sobreescribiendo toda la colección de tasks en la BD
        database.overwriteCollection(tasks.itemsArray);
      break;
      default:
        continue;
    }

  } while(selected !== 'exit');

})();