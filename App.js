let express = require('express');
let app = express();

let swig = require('swig');
let rest = require('request');
let crypto = require('crypto');

// Configuración de mongodb
let mongo = require('mongodb');
app.set('port', 8081);
app.set('db', 'mongodb+srv://admin:admin@cluster0.mssmg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);


//Routers-----------------------------
// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : " + req.session.destino)
        res.redirect("/identificarse");
    }
});


//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);  // (app, param1, param2, etc.)

let puerto = 3000;

//Variables
app.set('crypto', crypto);
app.set('rest',rest);

app.listen(puerto, function() {
    console.log("Servidor listo "+puerto);
});
