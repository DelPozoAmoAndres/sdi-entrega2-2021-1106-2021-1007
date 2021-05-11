module.exports = function (app, swig, gestorBD) {
    //ruta para ir a la vista privada del administrador
    app.get("/homeAdmin", function (req, res) {
        //criterio por el cual sacar los usuarios
        let criterio = {'rol': 'Usuario Estandar'}
        //método de la base de datos que saca los usuarios que cumplen dicha condiciones
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            //checkeamos que no hay ningun error o que la lista no esté vacia
            if (usuarios === null)
                //redireccionamos a la vista de error
                res.redirect("/systemError");
            else {
                //creamos una variable usuario
                let usuario = {
                    email : req.session.usuario,
                    rol : req.session.rol
                }
                //creamos una variable respuesta que será la que renderice la vista home
                // y le pase informacion del usuario y la lista de usuarios
                let respuesta = swig.renderFile('vistas/homeAdmin.html', {
                    userSession: usuario,
                    usuarios: usuarios
                });
                res.send(respuesta);
            }
        });
    });
    //ruta para eliminar usuarios
    app.post("/admin/delete/:lista", function (req, res) {
        //lista de usuarios a eliminar formato Json
        let lista = {"lista": req.params.lista};
        //lista de usuarios haciendo uso de split
        let users = lista.lista.split(",")
        //bucle para recorrer los usuarios a eliminar y hacer eliminacion en cascada
        for (let i = 0; i < users.length; i++) {
            //criterio para eliminar usuario por id
            let criterioUsuario = {"_id": gestorBD.mongo.ObjectID(users[i])}
            //metodo de la base de datos para obtener al usuario por el criterio dado
            gestorBD.obtenerUsuarios(criterioUsuario, function (usuario) {
                //checkeamos que la lista no esté vacia
                if (usuario.length<0) {
                    //redireccionamos a la vista de error
                    res.redirect("/systemError")
                    console.log("Error al obtener usuario")
                } else {
                    //metodo de la base de datos para eliminar al usuario por el criterio dado
                    gestorBD.eliminarUsuario(criterioUsuario, function (usuariosfinales) {
                        //checkeamos que no hay ningun error
                        if (usuariosfinales == null) {
                            //redireccionamos a la vista de error
                            res.redirect("/systemError")
                            console.log("Error al eliminar usuario")
                        } else {
                            console.log("Eliminacion correcta del usuario")
                            //criterio para obtener los productos por email
                            criterioUsuario={"autor": (usuario[0].email)}
                            //metodo de la base de datos para obtener los productos que cumplan el criterio
                            gestorBD.obtenerProductos(criterioUsuario, function (productos) {
                                //checkeamos que no hay ningun error
                                if (productos == null) {
                                    //redireccionamos a la vista de error
                                    res.redirect("/systemError")
                                    console.log("Error al listar productos del usuario")
                                } else {
                                    console.log("Listado correcto de los productos")
                                    //bucle para recorrer la lista de productos
                                    for (let j = 0; j < productos.length; j++) {
                                        //criterio para eliminar el producto
                                        let criterioProducto = {"_id": gestorBD.mongo.ObjectID(productos[j]._id)};
                                        //metodo de la base de datos para eliminar un producto por el criterio antes dado
                                        gestorBD.eliminarProducto(criterioProducto, function (productosFinales) {
                                            //checkeamos que no hay ningun error
                                            if (productosFinales == null) {
                                                //redireccionamos a la vista de error
                                                res.redirect("/systemError")
                                                console.log("Error al eliminar productos del usuario")
                                            }
                                        })
                                    }
                                    console.log("Eliminación correcta de los productos")
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