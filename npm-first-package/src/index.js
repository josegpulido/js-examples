
/**
 * Este paquete puede importarse como módulo dentro de un archivo
 * de Javascript o invocarse desde la terminal $ npx run random-message-gen.
 * 
 * Para lograrse lo segundo, es necesario crear un directorio /bin dentro
 * del directorio raíz del proyecto que contenga un fichero llamado globals.js.
 */

const names = [
    "Daniel",
    "Andrea",
    "Fabián",
    "Esmeralda",
    "Anahí",
    "Hugo"
];

module.exports = function() {
    const message = `Hola, mi nombre es ${names[Math.floor(Math.random() * names.length)]}.`;
    return message;
}