
/**
 * Características de Javascript introducidas en ECMAScript8 (ES8).
 * 
 * Revisión liberada en 2017.
 */

// ==================================================================================
// Transformando un objeto literal dentro de un arreglo =============================
// ==================================================================================
const team = {
  frontend: 'Juan',
  backend: 'Kim',
  design: 'Tony'
};

// ...Antes de ES8
// No existía, se debía recurrir a métodos más verbosos

// ...En ES8 o superior
console.log(Object.entries(team));
console.log(Object.values(team));
console.log(Object.keys(team));

// ==================================================================================
// Asincronía sin uso de promesas ===================================================
// ==================================================================================

// ...Antes de ES8
// Se resolvía con promesas

// ...En ES8 o superior
async function tareaAsync() {
  console.log('hola desde async');
}

function tareaPromise() {
  return new Promise((resolve, reject) => {
    console.log('hola desde promise');
    resolve();
  });
}

(async function() {
  console.log('Inicio');
  await tareaAsync();
  await tareaPromise();
  console.log('Final');
})();