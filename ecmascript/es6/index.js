
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
// Proxies ==========================================================================
// ==================================================================================

// ...Antes de ES6
// No existía...

/**
 * ...En ES6 o superior
 * 
 * Es una herramienta que permite interecptar y redefinir operaciones
 * fundamentales de un objeto (trampas), como:
 * - get
 * - set
 * - apply
 * - has
 * - hasOwnProperty
 * - getPrototypeOf
 * - setPrototypeOf
 */
// Definiendo objeto a interceptar
const colores = {
  red: 'Rojo',
  green: 'Verde',
  blue: 'Azul'
};
// Definiendo handler
class Handler {
  // Usando un getter como interceptor
  get(object, property) {
    console.log('Hola, desde el interceptor!');
    return object[property];
  }
}
const proxiedObj = new Proxy(colores, new Handler());
// Al llamar a la propiedad, se está llamando al interceptor en automático
console.log(proxiedObj.red);

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
 * Esta función especial posee la particular característica
 * de poder pausar su ejecución y luego volver al punto
 * donde se quedaron recordando su scope.
 * 
 * Un estado dinámico también es almacenado a través de
 * la keword yield, y cada que esta se invoque, el
 * generator saldrá de la función y continuará ejecutando
 * el código del hilo principal de Javascript.
 * 
 * Cuando el método .next() del generator se llame, este
 * regresará exactamente después del yield en que se quedó.
 * 
 * El generator cambiará su estado de 'suspended' a 'done'
 * una vez que todo su código se haya ejecutado, incluyendo
 * todos sus yield.
 */
function* myGenerator() {
  console.log('Inicia generator');
  yield 9;
  console.log('Mensaje uno');
  yield false;
  console.log('Mensaje dos');
  yield new Array(9, 4, 100);
  console.log('Termina generator');
}
function print({value, done}) {
  console.log(`value: ${value} | done: ${done}\n`);
}
const example = myGenerator();
setTimeout(() => print(example.next()), 1000);
setTimeout(() => print(example.next()), 2000);
setTimeout(() => print(example.next()), 3000);
setTimeout(() => print(example.next()), 4000);

/**
 * El siguiente generator genera un id secuacial en cada
 * invocación.
 */
function* idGenerator() {
  let i = 0;
  while (true) {
    /**
     * yield es un operador que puede establecer un valor
     * en memoria para el generador, pero también puede
     * asignar el valor que se pase como parámetro en el
     * método .next(), lo cual sucede de la siguiente
     * forma (todo sobre la misma sentencia):
     * - param = yield; asigna el valor traído por next().
     * - yield i++; emite un nuevo valor en el next().
     */
    const param = yield i++;
    console.log(param);
  }
}
const generator = idGenerator();
const interval = setInterval(() => {
  const { value } = generator.next('param1');
  console.log(`value: ${value}\n`);
  /**
   * Saliendo del intervalo, de otro modo genera hasta
   * el infinito.
   */
  if (value === 20) {
    clearInterval(interval);
  }
}, 1000);