module.exports = function (app, swig, gestorBD) {
    app.get("/homeAdmin", function (req, res) {
        let criterio = {'rol': 'Usuario Estándar'}
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios === null || usuarios.length === 0)
                res.redirect("/systemError");
            else {
                let respuesta = swig.renderFile('vistas/homeAdmin.html', {
                    user: req.session.usuario,
                    usuarios: usuarios,
                    rol : 'Usuario Administrador'
                });
                res.send(respuesta);
            }
        });
    });
    app.post("/admin/delete/:lista", function (req, res) {
        let lista = {"lista": req.params.lista};
        let users = lista.lista.split(",")
        for (i=0; i<users.length;i++) {
            let criterio={"_id": gestorBD.mongo.ObjectID(users[i])}
            gestorBD.eliminarUsuario(criterio, function (usuariosfinales) {
                console.log(usuariosfinales)
                if (usuariosfinales == null) {
                    res.redirect("/systemError")
                    console.log("Error al eliminar usuario")
                    return
                }
                else {
                    console.log("Eliminacion correcta del usuario")
                    gestorBD.obtenerProductos(criterio,function (productos){
                        if(productos==null){
                            res.redirect("/systemError")
                            console.log("Error al listar productos del usuario")
                            return
                        }
                        else{
                            for(producto of productos) {
                                gestorBD.eliminarProducto(producto, function (productosFinales) {
                                    if (productosFinales == null) {
                                        res.redirect("/systemError")
                                        console.log("Error al eliminar productos del usuario")
                                        return;
                                    }
                                })
                            }
                        }
                    })

                }
            })
        }
        res.redirect("/homeAdmin")
    })
};