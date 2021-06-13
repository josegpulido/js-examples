
/**
 * Características de Javascript introducidas en ECMAScript7 (ES7).
 * 
 * Revisión liberada en Junio 2016.
 */

// ==================================================================================
// Método includes incorporado por defecto en arreglos ==============================
// ==================================================================================
const numeros = [1, 2, 3, 4, 5, 6];
const nombre = 'Satoshi Nakamoto'; // <-- Arreglo de caracteres

// ...Antes de ES7
// No existía, se debía recurrir a indexOf o métodos más verbosos

// ...En ES7 o superior
if (numeros.includes(4)) {
  console.log('ok numeros');
}
if (nombre.includes('amoto')) {
  console.log('ok nombre');
}

// ==================================================================================
// Elevar un valor a una n potencia =================================================
// ==================================================================================
const base = 4;
const exponente = 3;

// ...Antes de ES7
console.log(Math.pow(base, exponente));

// ...En ES7 o superior
console.log(base ** exponente);