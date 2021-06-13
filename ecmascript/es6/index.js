
/**
 * Características de Javascript introducidas en ECMAScript6 (ES6).
 * 
 * Revisión liberada en 2015.
 */

// ==================================================================================
// Parámetros con valor por defecto =================================================
// ==================================================================================

// ...Antes de ES6
function ejemplo1(name, age) {
  var name = name || 'Juan';
  var age = age || 19;
  console.log(name, age);
}
ejemplo1('Ricardo');

// ...En ES6 o superior
function ejemplo2(name = 'Juan', age = 22) {
  console.log(name, age);
}
ejemplo2('Andrea');

// ==================================================================================
// Template literals ================================================================
// ==================================================================================
var string1 = 'Hello';
var string2 = 'World';

// ...Antes de ES6
console.log(string1 + ', ' + string2);

// ...En ES6 o superior
console.log(`${string1}, ${string2}`);

// ==================================================================================
// Cadenas de texto multilínea ======================================================
// ==================================================================================

// ...Antes de ES6
var multiline1 = 'Lorem ipsum dolor sit amet' +
                 'consectetur adlib.';

// ...En ES6 o superior
var multiline2 = `Lorem ipsum dolor sit amet
                  consectetur adlib.`;

// ==================================================================================
// Deestructuración de objetos literales ============================================
// ==================================================================================
var ejemplo1 = {
  name: 'Mark Grayson',
  age: '22',
  nickname: 'Invincible'
};

// ...Antes de ES6
console.log(ejemplo1.name);

// ...En ES6 o superior
const { nickname, age } = ejemplo1;
console.log(nickname);

// ==================================================================================
// Deestructuración y mezcla de arreglos ============================================
// ==================================================================================
var ejemplo2 = ['Jesse Bruce Pinkman', 'James Morgan McGill', 'Mike Ehrmantraut', 'Walter White'];
var ejemplo3 = ['Hank Schrader', 'Marie Schrader', 'Gus Fring', 'Skyler White'];

// ...Antes de ES6
var ejemplo4 = ejemplo2.concat(ejemplo3);
console.log(ejemplo2[0]); // <-- Forma de obtener un valor del arreglo
console.log(ejemplo4); // <-- Forma de obtener dos arreglos juntos

// ...En ES6 o superior
const [ , jimmy, ...others ] = ejemplo2;
console.log(jimmy); // <-- Valor de segunda posción del arreglo a través de desestructuración
console.log(others); // <-- Resto de valores del arreglo con sintaxis spread
console.log([...ejemplo2, ...ejemplo3]); // <-- Forma de obtener dos arreglos juntos

// ==================================================================================
// Funciones de flecha ==============================================================
// ==================================================================================

// ...Antes de ES6
var function1 = function(param1) {
  // Vinculada al this del bloque
}

// ...En ES6 o superior
var function2 = (param1, param2) => {
  // Desvinculada al this del bloque
  return 5;
}
// o
var function3 = (param1, param2) => 5;

// ==================================================================================
// Promesas =========================================================================
// ==================================================================================

// ...Antes de ES6
// No existía...

// ...En ES6 o superior
const promise = new Promise((resolve, reject) => {
  if (true) {
    resolve();
  } else {
    reject();
  }
});
promise
.then(() => {
  // code
})
.then(() => {
  // code more
})
.catch(error => {
  // code
});

// ==================================================================================
// Clases ===========================================================================
// ==================================================================================

// ...Antes de ES6
function Personaje(nombre, segundoNombre) {
  this.nombre = nombre + ' ' + segundoNombre;
  this.saludar = function() {
    console.log('Soy ' + this.nombre);
  }
}
const jake = new Personaje('Jake', 'El Perro');
jake.saludar();

// ...En ES6 o superior
class Heroe {

  constructor(nombre, poder) {
    this.nombre = nombre;
    this.poder = poder;
  }

  saludar() {
    console.log(`Soy ${this.nombre} y mi poder es ${this.poder}`);
  }
}
const homelander = new Heroe('Homelander', 'Super Fuerza');
homelander.saludar();

// ==================================================================================
// Módulos ==========================================================================
// ==================================================================================

// ...Antes de ES6
// No existía...

// ...En ES6 o superior
import leer from './module-1';
import { escribir, pensar } from './module-2';
leer();
escribir();
pensar();

/**
 * La anterior sintaxis no funcionará en Node, solo en navegadores, debido
 * a que Node (y extensiones como Code Runner que usa Node) utiliza la
 * sintaxis de CommonJS Module, por lo que el equivalente en Node de dicha
 * característica sería la siguiente:
 */

const leer = require('./module-1');
const { escribir, pensar } = require('./module-2');
// ...Del lado de los módulos:
module.exports = leer;
module.exports = {
  escribir,
  leer
}

// ==================================================================================
// Generadores (generators) =========================================================
// ==================================================================================

// ...Antes de ES6
// No existía...

/**
 * ...En ES6 o superior
 * 
 * Para establecer un generator, se requiere colocar un
 * asterisco en seguida de la palabra reservada function.
 * Esta función especial retornará un valor que almacenará en
 * un estado interno en memoria al que se podrá acceder
 * desde la instancia generada.
 */
function* helloWorld() {
  if (true) {
    yield 'Hello, ';
  }
  if (true) {
    yield 'world';
  }
}
const ginstance = helloWorld();
console.log(ginstance.next().value);
console.log(ginstance.next().value);
console.log(ginstance.next().value);