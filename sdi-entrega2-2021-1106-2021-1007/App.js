let express = require('express');
let app = express();

let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let rest = require('request');
app.set('rest',rest);

//Configuracion de la sesion
let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

// Configuración de mongodb
let mongo = require('mongodb');
let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);
app.set('port', 8081);
app.set('db', 'mongodb://admin:admin@cluster0-shard-00-00.mssmg.mongodb.net:27017,cluster0-shard-00-01.mssmg.mongodb.net:27017,cluster0-shard-00-02.mssmg.mongodb.net:27017/MyWallapop?ssl=true&replicaSet=atlas-96ofd9-shard-0&authSource=admin&retryWrites=true&w=majority');


// Modulos para encryptar contraseñas de usuarios
let crypto = require('crypto');
app.set('crypto', crypto);
app.set('clave', 'abcdefg');

//Routers-----------------------------
// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        next();
    } else {
        //console.log("va a : " + req.session.destino)
        res.redirect("/login");
    }
});
app.use("/home", routerUsuarioSession);
app.use("/homeAdmin", routerUsuarioSession);

// router usuario administrador
let routerUsuarioAdmin = express.Router();
routerUsuarioAdmin.use(function (req, res, next){
   console.log("routerUsuarioAdmin");
   let criterio = { "email" : req.session.usuario};
   gestorBD.obtenerUsuarios(criterio, function (usuarios){
       if (usuarios[0].rol==="Usuario Administrador")
           next();
       else {
           console.log("El usuario no es administrador");
           res.redirect("/home");
       }
   });
});
app.use("/homeAdmin", routerUsuarioAdmin);
app.use("/admin/*", routerUsuarioAdmin);
// Validadores
let validadorUsuario = require("./validadores/validadorUsuario.js");
validadorUsuario.init(gestorBD);

//Rutas/controladores por lógica
require("./rutas/rusuario")(app, swig, gestorBD, validadorUsuario);  // (app, param1, param2, etc.)
require("./rutas/radmin")(app, swig, gestorBD);

let puerto = 3000;


app.listen(puerto, function() {
    console.log("Servidor listo "+puerto);
});
