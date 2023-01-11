/**
 * Agente de servicio para guardar una ficha.
 * <pre>
 * - Busca la petición de guardar ficha en la Web y trae el resultado.
 * </pre>
 * @module agent-card-save
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");
const canvasController = require("../controllers/canvasController");

/**
 * Respuesta al guardar una ficha.
 *
 * @callback module:agent-card-save.saveCardAgentCallback
 * @param {integer} status - Codigo HTTP de respuesta.
 * @param {json} card - Ficha matemática obtenida de la expresión.
 * @param {json} card.ID_CARD - Id de la ficha en la base de datos.
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
 * Guardar una ficha.
 *
 * @param {json} card - Ficha matemática a guardar en la base de datos.
 * @param {string} card.title - Título de la ficha.
 * @param {string} card.description - Descripción de la ficha.
 * @param {json[]} card.params - Parámetros de la ficha.
 * @param {string} card.params.symbol - Symbolo LaTeX del parámetro.
 * @param {string} card.params.description - Descripción del parámetro.
 * @param {json} card.params.content - Ficha matemática del parámetro o valor nulo.
 * @param {string} card.latexCode - Codigo LaTeX de la ficha.
 * @param {string} card.pythonCode - Codigo Python de la ficha.
 * @param {module:agent-card-save.saveCardAgentCallback} callback -  Respuesta al guardar una ficha.
 */
function saveCardAgent(ID_TOKEN, email, card, callback) {
  // Eliminar metadata
  card = JSON.parse(JSON.stringify(card));
  canvasController.deleteMetadata(card);

  axios
    .post(enviroment.serverUrl + "/card/insert", {
      ID_TOKEN: ID_TOKEN,
      email: email,
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
export default saveCardAgent;
