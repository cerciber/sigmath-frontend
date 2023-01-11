/**
 * Se encarga de configurar e iniciar el cliente con Express.
 *
 * @module aplication-client
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
const express = require("express");
const app = express();

// Detectar la ruta raíz
app.use(express.static(__dirname + "/"));

// Redireccionar cualquier ruta al html principal par que vue haga el manejo de rutas
app.get(/.*/, function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Escuchar en el puerto especificado
const PORT = process.env.PORT || 8000;
app.listen(PORT, function() {
  console.log("Servidor web escuchando en el puerto", PORT);
  console.log("Servidor en modo ", process.env.NODE_ENV);
});
