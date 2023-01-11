// Modulos instalados
const enviroment = require("./enviroment.json");

// Entorno actual
var currentEnviroment;

// Asignar variables del entorno
if (process.env.NODE_ENV == "production") {
  currentEnviroment = enviroment.production;
} else if (process.env.NODE_ENV == "development") {
  currentEnviroment = enviroment.development;
} else {
  currentEnviroment = enviroment.test;
}

// Exportar entorno
module.exports = currentEnviroment;
