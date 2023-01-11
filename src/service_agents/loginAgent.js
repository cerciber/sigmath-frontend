/**
 * Agente de servicio para autenticar un usuario.
 * <pre>
 * - Busca la petición de autenticar usuarios en la Web y trae el resultado.
 * </pre>
 * @module agent-user-login
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const axios = require("axios");

// Modulos creados
const enviroment = require("../../utils/constants/enviroment");

/**
 * Respuesta al autenticar un usuario.
 *
 * @callback module:agent-user-login.loginAgentCallback
 * @param {integer} status - Codigo HTTP de respuesta.
 * @param {json} user - Datos del usuario registrado.
 * @param {integer} user.ID_USER - Id del usuario registrado.
 * @param {string} user.nickname - Nombre de usuario.
 * @param {string} user.email - Correo electrónico del usuario.
 * @param {string} user.password - Contraseña del usuario.
 */
/**
 * Autenticar un usuario.
 *
 * @param {json} userData - Información del usuario.
 * @param {string} userData.email - Correo.
 * @param {string} userData.password - Contraseña.
 * @param {module:agent-user-login.loginAgentCallback} callback - Respuesta al autenticar un usuario.
 */
function loginAgent(userData, callback) {
  axios
    .post(enviroment.serverUrl + "/user/login", userData)
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
export default loginAgent;
