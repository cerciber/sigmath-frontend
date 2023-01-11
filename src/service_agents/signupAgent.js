/**
 * Agente de servicio para registrar un usuario.
 * <pre>
 * - Busca la petición de registrar usuarios en la Web y trae el resultado.
 * </pre>
 * @module agent-user-signup
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");

/**
 * Respuesta al registrar un usuario.
 *
 * @callback module:agent-user-signup.signupCardAgentCallback
 * @param {integer} status - Codigo HTTP de respuesta.
 * @param {json} user - Datos del usuario registrado.
 * @param {integer} user.ID_USER - Id del usuario registrado.
 * @param {string} user.nickname - Nombre de usuario.
 * @param {string} user.email - Correo electrónico del usuario.
 * @param {string} user.password - Contraseña del usuario.
 */

/**
 * Registrar un usuario.
 *
 * @param {json} userData - Información del usuario.
 * @param {string} userData.nickname - Correo electrónico del usuario.
 * @param {string} userData.email - Correo electrónico del usuario.
 * @param {string} userData.password - Contraseña del usuario.
 * @param {module:agent-user-signup.signupCardAgentCallback} callback - Respuesta al registrar un usuario.
 */
function signupAgent(userData, callback) {
  axios
    .post(enviroment.serverUrl + "/user/signup", userData)
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
export default signupAgent;
