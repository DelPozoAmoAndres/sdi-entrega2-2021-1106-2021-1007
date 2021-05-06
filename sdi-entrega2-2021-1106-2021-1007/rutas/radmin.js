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
        for (i = 0; i < users.length; i++) {
            let criterioUsuario = {"_id": gestorBD.mongo.ObjectID(users[i])}
            gestorBD.obtenerUsuarios(criterioUsuario, function (usuario) {
                if (usuario.length<0) {
                    res.redirect("/systemError")
                    console.log("Error al obtener usuario")
                    return
                } else {
                    gestorBD.eliminarUsuario(criterioUsuario, function (usuariosfinales) {
                        if (usuariosfinales == null) {
                            res.redirect("/systemError")
                            console.log("Error al eliminar usuario")
                            return
                        } else {
                            console.log("Eliminacion correcta del usuario")
                            console.log("Usuario"+usuario[0])
                            criterioUsuario={"autor": (usuario[0].email)}
                            gestorBD.obtenerProductos(criterioUsuario, function (productos) {
                                if (productos == null) {
                                    res.redirect("/systemError")
                                    console.log("Error al listar productos del usuario")
                                    return
                                } else {
                                    console.log(productos)
                                    for (j = 0; j < productos.length; j++) {
                                        console.log("Producto" + productos[i])
                                        let criterioProducto = {"_id": gestorBD.mongo.ObjectID(productos[i]._id)};
                                        gestorBD.eliminarProducto(criterioProducto, function (productosFinales) {
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
            })
        }
        res.redirect("/homeAdmin")
    })
};