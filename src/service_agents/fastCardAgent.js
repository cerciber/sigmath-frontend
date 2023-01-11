/**
 * Agente de servicio para crear una ficha en base a una expresión.
 * <pre>
 * - Busca la petición de guardar ficha en la Web y trae el resultado.
 * </pre>
 * @module agent-card-fast
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");

/**
 * Respuesta al crear una ficha en base a una expresión.
 *
 * @callback module:agent-card-fast.fastCardAgentCallback
 * @param {integer} status - Codigo HTTP de respuesta.
 * @param {json} card - Ficha matemática obtenida de la expresión.
 * @param {string} card.title - Título de la ficha.
 * @param {string} card.description - Descripción de la ficha.
 * @param {json[]} card.params - Parámetros de la ficha.
 * @param {string} card.params.symbol - Symbolo LaTeX del parámetro.
 * @param {string} card.params.description - Descripción del parámetro.
 * @param {json} card.params.content - Ficha matemática del parámetro o valor nulo.
 * @param {string} card.latexCode - Codigo LaTeX de la ficha.
 * @param {string} card.pythonCode - Codigo Python de la ficha.
 */

/**
 * Crear una ficha en base a una expresión.
 *
 * @param {string} text - Expresión  matematica en texto.
 * @param {module:agent-card-fast.fastCardAgentCallback} callback - Respuesta al crear una ficha en base a una expresión.
 */
function fastCardAgent(text, callback) {
  axios
    .get(enviroment.serverUrl + "/card/fast", {
      params: {
        text: text
      }
    })
    .then(function(response) {
      callback(response.status, response.data);
    })
    .catch(function(error) {
      if (error.response) {
        callback(error.response.status, error.response.data);
      } else {
        callback(500, "Lo sentimos, no fue posible conectarse al servidor.");
      }
    });
}

// Exportar agente de servicio
export default fastCardAgent;
