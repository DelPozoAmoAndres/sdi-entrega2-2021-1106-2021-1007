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
                let respuesta = swig.renderFile('vistas/homeStandard.html', {
                    user: req.session.usuario,
                    productos : productos
                });
                res.send(respuesta);
            }
        });
    });

};