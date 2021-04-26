let express = require('express');
let app = express();

let swig = require('swig');

// Configuración de mongodb
let mongo = require('mongodb');
app.set('port', 8081);
app.set('db', 'mongodb+srv://admin:admin@cluster0.mssmg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);  // (app, param1, param2, etc.)

let puerto = 3000;

app.listen(puerto, function() {
    console.log("Servidor listo "+puerto);
});
