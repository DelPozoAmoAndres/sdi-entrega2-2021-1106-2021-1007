module.exports = function (app, swig, gestorBD, validadorUsuario) {
    //ruta get para ver el formulario de registro para crear un usuario
    app.get("/registrarse", function (req, res) {
        let respuesta = swig.renderFile('vistas/registro.html', {});
        res.send(respuesta);
    });
    //ruta post para registrarse
    app.post("/registrarse", async function (req, res) {
        //comprobar si hay errores al introducir los valores
        validadorUsuario.registro(req, res, function (result){
            if(result) {
                //guardar en modo seguro la contraseña
                let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                    .update(req.body.password).digest('hex');
                //crear un nuevo objeto usuario con los valores introducidos
                let usuario = {
                    email: req.body.email,
                    nombre: req.body.nombre,
                    apellidos: req.body.apellidos,
                    password: seguro,
                    dinero: 100.0,
                    rol: "Usuario Estándar"
                }
                //insertamos el usuario en base de datos para poder iniciar sesión posteriormente
                gestorBD.insertarUsuario(usuario, function (id) {
                    //si se produjo un error notificar
                    if (id == null) {
                        res.redirect("/registrarse?mensaje=Error al registrar usuario")
                    } else {
                        //redireccionar al home haciendo autologin
                        req.session.usuario=usuario.email
                        res.redirect("/home?mensaje=Nuevo usuario registrado")
                    }
                });
            }
        })
    });
    //ruta get para ver el formulario del login
    app.get("/login", function (req, res) {
        let respuesta = swig.renderFile('vistas/blogin.html', {});
        res.send(respuesta);
    });
    //ruta post para identificarnos
    app.post("/login", function (req, res) {
        //creamos el hash de la contraseña introducida
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        //criterio por el cual buscaremos si un ususario coincide con el email y el hash obtenido de la contraseña
        let criterio = {
            email: req.body.email,
            password: seguro
        }
        //metodo de la base de datos para saber si existe un usuario que coincide con el criterio anterior
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                req.session.usuario = null;
                res.redirect("/login" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");
            } else{
                req.session.usuario =usuarios[0].email
                //redirigirle a la vista correcta
                res.redirect("/home")
            }
        });
    });
    //ruta get para cerrar sesion
    app.get("/logout", function (req, res) {
        req.session=null;
        res.redirect("/login")
    });
    //ruta raiz para ir directamente al login o al home en caso de tener sesion abierta
    app.get("/", function (req, res) {
        if(req.session.usuario!=null)
            res.redirect("/home")
        else
            res.redirect("/login")
    });
    //ruta get para ver la vista correspondiente ya seas admin o usuario estandar
    app.get("/home", function (req, res) {
        //criterio por el cual buscaremos al usuario
        let criterio = {"email":req.session.usuario}
        //metodo para obtener el usuario en sesion con el criterio antes definido
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.redirect("/systemError");
            // en caso de admin
            } else if (usuarios[0].rol === "Usuario Administrador") {
                req.session.usuario = usuarios[0].email;
                req.session.rol = usuarios[0].rol;
                res.redirect("/homeAdmin");
            // en caso de usuario estandar
            } else {
                req.session.usuario = usuarios[0].email;
                req.session.rol = usuarios[0].rol;
                req.session.dinero = usuarios[0].dinero;
                res.redirect("/homeUser");
            }
        });
    });
}