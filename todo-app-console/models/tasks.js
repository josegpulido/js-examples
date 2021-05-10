// Utilidades de UUID para generar identificadores únicos
const { v4 : uuid } = require('uuid'); // <-- Renombrando v4 a uuid

class Task {

  // Propiedades de clase
  description;
  id;
  completed;

  // Constructor
  constructor(
    description,
    id,
    completed = undefined
  ) {
    this.description = description;
    /**
     * Creando nuevo identificador único apenas se
     * cree nueva instancia de Task, solo en caso
     * de no haber proporcionado uno.
     */
    if (id === undefined) {
      this.id = uuid();
    } else {
      this.id = id;
    }
    this.completed = completed;
  }

}

class Tasks {

  // Constructor
  constructor(
    items
  ) {
    this.items = {};
  }

  // Getters
  get itemsArray() {
    return Object.keys(this.items).map(key => {
      return this.items[key];
    });
  }

  // Método para obtener un task en específico
  getTask(id) {
    if (this.items[id] === undefined) {
      throw Error('Task with the given id does not exists.');
    }
    return this.items[id];
  }

  // Método para agregar un task a la lista de tasks
  addTask(description) {
    const task = new Task(description);
    this.items[task.id] = task;
  }

  // Método para borrar un task en específico
  removeTask(id) {
    if (this.items[id] === undefined) {
      throw Error('Task with the given id does not exists.');
    }
    delete this.items[id];
  }

  // Método para marcar task como completado
  completeTask(id) {
    if (this.items[id] === undefined) {
      throw Error('Task with the given id does not exists.');
    }
    this.items[id].completed = Date.now();
  }
  
}

module.exports = {
  Task,
  Tasks
};