/**
 * Agente para actualizar una ficha ya existente
 *
 * @module updateCardAgent
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const environment = require("../../utils/constants/enviroment");
const canvasController = require("../controllers/canvasController");

// Driver
function updateCardAgent(ID_TOKEN, email, card, callback) {
  // Eliminar metadata
  card = JSON.parse(JSON.stringify(card));
  canvasController.deleteMetadata(card);

  axios
    .put(environment.serverUrl + "/card/update", {
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

export default updateCardAgent;
