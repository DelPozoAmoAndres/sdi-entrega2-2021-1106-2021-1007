let express = require('express');
let app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

let fs = require('fs');
let https = require('https');

let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let rest = require('request');
app.set('rest', rest);

//Modulo para el token de api
let jwt = require('jsonwebtoken');
app.set('jwt', jwt);

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
app.set('db', 'mongodb://admin:admin@cluster0-shard-00-00.mssmg.mongodb.net:27017,cluster0-shard-00-01.mssmg.mongodb.net:27017,cluster0-shard-00-02.mssmg.mongodb.net:27017/MyWallapop?ssl=true&replicaSet=atlas-96ofd9-shard-0&authSource=admin&retryWrites=true&w=majority');


// Modulos para encryptar contraseñas de usuarios
let crypto = require('crypto');
app.set('crypto', crypto);
app.set('clave', 'abcdefg');

//Routers-----------------------------
// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    if (req.session.usuario) {
        // dejamos correr la petición
        next();
    } else {
        res.redirect("/login");
    }
});
app.use("/home", routerUsuarioSession);
app.use("/homeAdmin", routerUsuarioSession);
app.use("/homeUser", routerUsuarioSession);
app.use("/product/*", routerUsuarioSession);
app.use("/user/*", routerUsuarioSession);
app.use("/tienda", routerUsuarioSession);
app.use("/admin/*", routerUsuarioSession);


// router usuario estandar
let routerUsuarioStandard = express.Router();
routerUsuarioStandard.use(function (req, res, next) {
    let criterio = {"email": req.session.usuario};
    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
        if (usuarios[0].rol === "Usuario Estandar")
            next();
        else {
            res.redirect("/home");
        }
    });
});
app.use("/product/*", routerUsuarioStandard);
app.use("/homeUser", routerUsuarioStandard);
app.use("/user/*", routerUsuarioStandard);
app.use("/tienda", routerUsuarioStandard);

// router usuario administrador
let routerUsuarioAdmin = express.Router();
routerUsuarioAdmin.use(function (req, res, next) {
    let criterio = {"email": req.session.usuario};
    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
        if (usuarios[0].rol === "Usuario Administrador")
            next();
        else {
            res.redirect("/home");
        }
    });
});
app.use("/homeAdmin", routerUsuarioAdmin);
app.use("/admin/*", routerUsuarioAdmin);

// routerUsuarioToken
let routerUsuarioToken = express.Router();
routerUsuarioToken.use(function (req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.tiempo) > 240) {
                res.status(403); // Forbidden
                res.json({
                    acceso: false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso: false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/producto', routerUsuarioToken);

// Validadores
let validadorUsuario = require("./validadores/validadorUsuario.js");
let validadorProducto = require("./validadores/validadorProducto.js");
validadorUsuario.init(gestorBD);

//Rutas/controladores por lógica
require("./rutas/rusuario")(app, swig, gestorBD, validadorUsuario);  // (app, param1, param2, etc.)
require("./rutas/radmin")(app, swig, gestorBD);
require("./rutas/ruserstandard")(app, swig, gestorBD);
require("./rutas/rproductos")(app, swig, gestorBD, validadorProducto);

//Rutas de la parte de API REST
require("./rutas/rapiproductos")(app, gestorBD);

app.use(express.static('public')); //Para la parte del cliente

app.set('port', 3000);

// Lanzar el servidor
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function () {
    console.log("Servidor activo");
});