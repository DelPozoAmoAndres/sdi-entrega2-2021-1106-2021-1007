module.exports = function (app, swig, gestorBD, validadorUsuario) {
    //metodo que se ejecutará una vez se quiera ver el formulario de registro para crear un usuario
    app.get("/registrarse", function (req, res) {
        let respuesta = swig.renderFile('vistas/registro.html', {});
        res.send(respuesta);
    });
    //metodo que se ejecutará una vez se intente crear un usuario con los datos introducidos
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
                    //si se produjo un error
                    if (id == null) {
                        res.redirect("/registrarse?mensaje=Error al registrar usuario")
                    } else {
                        res.redirect("/login?mensaje=Nuevo usuario registrado")
                    }
                });
            }
        })
    });
    app.get("/login", function (req, res) {
        let respuesta = swig.renderFile('vistas/blogin.html', {});
        res.send(respuesta);
    });

    app.post("/login", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                req.session.rol = usuarios[0].rol;
                res.redirect("/login" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");
            } else if (usuarios[0].rol == "Usuario Administrador") {
                req.session.usuario = usuarios[0].email;
                req.session.rol = usuarios[0].rol;
                res.redirect("/homeAdmin");
            } else {
                req.session.usuario = usuarios[0].email;
                req.session.rol = usuarios[0].rol;
                req.session.dinero = usuarios[0].dinero;
                res.redirect("/home");
            }
        });
    });

    app.get("/logout", function (req, res) {
        req.session=null;
        res.redirect("/login")
    });

    app.get("/", function (req, res) {
        res.redirect("/login")
    });
}