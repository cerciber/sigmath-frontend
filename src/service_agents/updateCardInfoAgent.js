/**
 * Agente para actualizar una ficha ya existente
 *
 * @module updateCardInfoAgent
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const environment = require("../../utils/constants/enviroment");
const canvasController = require("../controllers/canvasController");

// Driver
function updateCardInfoAgent(ID_TOKEN, email, info, callback) {
  /* // Eliminar metadata
  card = JSON.parse(JSON.stringify(info));
  canvasController.deleteMetadata(card);
*/
  axios
    .put(environment.serverUrl + "/card/update/info", {
      ID_TOKEN: ID_TOKEN,
      info: info
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

export default updateCardInfoAgent;
