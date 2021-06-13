
/**
 * Características de Javascript introducidas en ECMAScript9 (ES9).
 * 
 * Revisión liberada en 2018.
 */

// ==================================================================================
// Mezcla de objetos literales ======================================================
// ==================================================================================

// ...Antes de ES9
// No existía, se tenía que recurrir a la clase Object

// ...En ES9 o superior
const trabajo = {
  descripcion: 'Reparto de correo',
  horas: 8,
  lugar: 'Albuquerque'
};
const ciudadano = {
  ...trabajo,
  nombre: 'Chuck Norris',
  edad: 27
};
console.log(ciudadano);

// ==================================================================================
// Promesas con bloque finally ======================================================
// ==================================================================================

// ...Antes de ES9
// No existía el bloque finally

// ...En ES9 o superior
new Promise((resolve, reject) => resolve())
.then(() => {
  console.log('Bloque then');
})
.catch(() => {
  console.log('Bloque catch');
})
.finally(() => {
  console.log('Bloque finally');
});

// ==================================================================================
// Operaciones regex ================================================================
// ==================================================================================

// ...Antes de ES9
// No existía...

// ...En ES9 o superior
const regex = /^\s*([0-9a-zA-Z]*)\s*$/; // <-- Permitir solo letras y números
const text = 'Texto de ejemplo 1';
if (regex.test(text)) {
  console.log(`El texto '${text}' tiene un formato permitido`);
} else {
  console.log(`El texto '${text}' NO tiene un formato permitido`);
}