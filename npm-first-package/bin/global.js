#!/usr/bin/env node

/**
 * Lo anterior es un shebang requerido por la documentación de
 * NPM para invocar el comando en la terminal utilizando como binario
 * ejecutor a node, el cual se ubica en el directoio /usr/bin/env.
 * 
 * Este fichero es el que NPM ejecutará cuando invoque al comando
 * simple-hello-messages. Para que esto suceda, NPM también necesita
 * especificar la propiedad "bin" en el package.json. Ver más información
 * en apuntes.
 * 
 * A continuación, importando módulo e imprimiendo resultado.
 */
const randomMessage = require('../src/index.js');

const message = randomMessage();
console.log(message);

/**
 * Una vez listo todo lo anterior, ver apuntes de NPM sobre cómo publicar
 * un paquete por primera vez.
 */