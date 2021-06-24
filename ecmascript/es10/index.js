
/**
 * Características de Javascript introducidas en ECMAScript10 (ES10).
 * 
 * Revisión liberada en 2019.
 */

// ==================================================================================
// Aplanar arreglos de varias dimensiones ===========================================
// ==================================================================================
const arreglo = [
  4, 9,
  [
    2, 19, 59, 1,
    [
      4, 24, 3
    ]
  ]
];

// ...Antes de ES10
// No existía...

// ...En ES10 o superior
console.log(arreglo);
console.log(arreglo.flat()); // <-- Aplanando arreglo de dos dimesiones
console.log(arreglo.flat(2)); // <-- Aplanando arreglo de tres dimensiones

// ==================================================================================
// Recorte de espacios en cadenas de texto ==========================================
// ==================================================================================
const texto1 = '            Lorem ipsum dolor sit amet';
const texto2 = 'Lorem ipsum dolor sit amet            ';

// ...Antes de ES10
// No existía, había que manipular caracter por carater la cadena de texto

// ...En ES10 o superior
console.log(texto1.trimStart());
console.log(texto2.trimEnd());

// ==================================================================================
// Omisión del parámetro error en bloque catch de un try-catch ======================
// ==================================================================================

// ...Antes de ES10
// No existía...

// ...En ES10 o superior
try {
  // code
} catch {
  // Omisión útil para cuando el objeto de error no se manipula ni usa dentro del bloque
  console.log('Error aquí!');
}

// ==================================================================================
// Transformar un arreglo en un objeto literal ======================================
// ==================================================================================
const entries = [
  [ 'name', 'Thor' ],
  [ 'age', 5000 ],
  [ 'alive', true ]
];

// ...Antes de ES10
// No existía, había que recurrir a iterar el arreglo

// ...En ES10 o superior
console.log(Object.fromEntries(entries));

// ==================================================================================
// Objeto Symbol a partir de una cadena de texto ====================================
// ==================================================================================
const texto3 = 'Lorem ipsum dolor sit amet';

// ...Antes de ES10
// No existía...

// ...En ES10 o superior
const simbolo = Symbol(texto3);
console.log(simbolo.description);
console.log(simbolo.toString());

// ==================================================================================
// Propiedades y métodos de clase privados ==========================================
// ==================================================================================

class Persona {

  // Propiedad privada
  #nombre;
  
  // Constructor
  constructor(nombreReal) {
    this.#nombre = nombreReal;
  }

  // Método público que hace uso de una propiedad privada
  saludar() {
    console.log(`Hola, soy ${this.#nombre}`);
  }
}
const clancy = new Persona('Clancy');
clancy.saludar();