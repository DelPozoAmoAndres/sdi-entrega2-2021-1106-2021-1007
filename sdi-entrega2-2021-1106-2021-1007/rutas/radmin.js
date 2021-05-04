module.exports = function(app,swig,gestorBD) {
    app.get("/homeAdmin", function (req, res){
        let criterio = {'rol' : 'Usuario Estándar'}
        gestorBD.obtenerUsuarios(criterio, function (usuarios){
            if (usuarios===null || usuarios.length===0)
                res.redirect("/systemError");
            else {
                let respuesta = swig.renderFile('vistas/homeAdmin.html', {
                    usuarios : usuarios
                });
                res.send(respuesta);
            }
        });
    });
    app.post("admin/delete")
};