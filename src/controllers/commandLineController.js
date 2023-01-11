/**
 * Controlador que se encarga realizar transormaciones de expresiones de usuario a Sympy.
 *
 * @module controllers-command-line
 * @author Labeleon <labeleon@gmail.com>
 */

function convertToSympy(expression) {
  // Cambiar numeros y variables concatenados
  expression = expression.replace(/(\d+)([a-zA-Z]+)/g, "$1*$2");
  // Cambiar contante Euler
  expression = expression.replace(/([^a-zA-Z]|^)e([^a-zA-Z]|$)/g, "$1E$2");
  // Cambiar imaginario
  expression = expression.replace(/([^a-zA-Z]|^)i([^a-zA-Z]|$)/g, "$1I$2");
  // Cambiar igualdad
  if (!expression.includes("<=") && !expression.includes(">=")) {
    expression = expression.replace(/(.+?)=(.+?)/g, "Eq($1,$2)");
  }

  return expression;
}

// Exportar funciones
module.exports = {
  convertToSympy
};
