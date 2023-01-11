/**
 * Ingrese la descripción del módulo
 *
 * @module validationCodeController
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
//

// Modulos creados
//

/**
 * Obtener ficha por defecto por ID.
 * 
 * @returns {string} - Codigo alfanumerico de validación de correo
 */
function validationCodeController() {
  // Logica del controllador
  let alphabet = "0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
  let alphabetLength = alphabet.length
  let code = "";
  let charactersNumber = Math.floor((Math.random() + 1) * 4);   //Codigo de 4 a 8 caracteres
  for(i = 0; i < charactersNumber; i++){
    code += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
  }
  return code;
}

module.exports = validationCodeController;
