module.exports = function (app, swig, gestorBD){
    app.get("/home", function (req, res){
        let criterio = {
            autor : req.session.usuario
        }
        gestorBD.obtenerProductos(criterio, function (productos){
            if (productos==null)
                res.redirect("/systemError")
            else {
                console.log(productos);
                let usuario = {
                    email : req.session.usuario,
                    rol : req.session.rol,
                    dinero : req.session.dinero,
                }
                let respuesta = swig.renderFile('vistas/homeStandard.html', {
                    userSession : usuario,
                    productos : productos
                });
                res.send(respuesta);
            }
        });
    });

};