/**
 * Ingrese la descripción del módulo
 *
 * @module agent-set-card-rate
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");

function setCardRateAgent(ID_TOKEN, email, ID_CARD, rate, callback) {
  axios
    .post(enviroment.serverUrl + "/card/rate", {
      ID_TOKEN: ID_TOKEN,
      email: email,
      ID_CARD: ID_CARD,
      rate: rate
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

export default setCardRateAgent;
