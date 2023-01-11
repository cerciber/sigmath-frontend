/**
 * Agente de servicio para resolver una ficha.
 * <pre>
 * - Busca la petición de resolver ficha en la Web y trae el resultado.
 * </pre>
 * @module agent-card-solve
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");
const canvasController = require("../controllers/canvasController");

/**
 * Respuesta al resolver una ficha.
 *
 * @callback module:agent-card-solve.solveCardAgentCallback
 * @param {integer} status - Codigo HTTP de respuesta.
 * @param {json} newCard - Ficha matemática Json.
 * @param {string} newCard.title - Título de la ficha.
 * @param {string} newCard.description - Descripción de la ficha.
 * @param {json[]} newCard.params - Parámetros de la ficha.
 * @param {string} newCard.params.symbol - Symbolo LaTeX del parámetro.
 * @param {string} newCard.params.description - Descripción del parámetro.
 * @param {json} newCard.params.content - Ficha matemática del parámetro o valor nulo.
 * @param {string} newCard.latexCode - Codigo LaTeX de la ficha.
 * @param {string} newCard.pythonCode - Codigo Python de la ficha.
 */

/**
 * Resolver una ficha.
 *
 * @param {json} card - Ficha matemática Json.
 * @param {string} card.title - Título de la ficha.
 * @param {string} card.description - Descripción de la ficha.
 * @param {json[]} card.params - Parámetros de la ficha.
 * @param {string} card.params.symbol - Symbolo LaTeX del parámetro.
 * @param {string} card.params.description - Descripción del parámetro.
 * @param {json} card.params.content - Ficha matemática del parámetro o valor nulo.
 * @param {string} card.latexCode - Codigo LaTeX de la ficha.
 * @param {string} card.pythonCode - Codigo Python de la ficha.
 * @param {module:agent-card-solve.solveCardAgentCallback} callback - Respuesta al resolver una ficha.
 */
function solveCardAgent(card, callback) {
  // Eliminar metadata
  card = JSON.parse(JSON.stringify(card));
  canvasController.deleteMetadata(card);

  axios
    .post(enviroment.serverUrl + "/card/solve", {
      card: card
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
export default solveCardAgent;
