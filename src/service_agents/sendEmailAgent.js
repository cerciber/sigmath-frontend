/**
 * Ingrese la descripción del módulo
 *
 * @module agent-send-email
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");

function sendEmailAgent({
  email, 
  code
  }, callback ) {
  axios
    .post(enviroment.serverUrl + "/user/password/send_email", {
      email: email,
      code: code
    })
    .then(function(response){
      callback(response.status, response.data);
    })
    .catch(function(error){
      if(error.response){
        callback(error.response.status, error.response.data);
      }
      else{
        callback(500, "Lo sentimos, no fue posible conectarse al servidor.");
      }
    })
}

module.exports = sendEmailAgent;

