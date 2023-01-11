/**
 * Ingrese la descripción del módulo
 *
 * @module changePasswordController
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");

/**
 * Ingrese la descripción
 *
 * @callback functionCallback
 * @param {string} email - Correo existente del usario
 * @param {string} newPassword - Nueva contraseña
 */

function changePasswordController({
    email, 
    newPassword,
  }, callback ) {
  axios
    .post(enviroment.serverUrl + "/user/password", {
      email: email,
      newPassword: newPassword, 
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

module.exports = changePasswordController;
