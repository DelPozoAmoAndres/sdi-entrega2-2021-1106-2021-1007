module.exports = function(app,swig,gestorBD) {

    app.get("/login", function(req, res) {
        let respuesta = swig.renderFile('vistas/blogin.html', {});
        res.send(respuesta);
    });

    app.post("/login", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/login" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else if (usuarios[0].rol=="Usuario Administrador"){
                req.session.usuario = usuarios[0].email;
                res.redirect("/home/admin");
            }
            else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/home");
            }
        });
    });
}