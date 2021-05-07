module.exports = function (app, swig, gestorBD, validadorProductos) {
    //ruta get para añadir un producto
    app.get("/product/add", function (req, res) {
        //variable que contendrá todos los datos del usuario
        let usuario = {
            email: req.session.usuario,
            rol: req.session.rol,
            dinero: req.session.dinero,
        }
        //variable que renderizará la vista y le pasará la informacion del usuario
        let respuesta = swig.renderFile('vistas/addproduct.html', {
            userSession: usuario
        });
        res.send(respuesta);
    });
    //ruta post para añadir un producto
    app.post("/product/add", function (req, res) {
        //comprobar si hay errores al introducir los valores
        if (!validadorProductos.addproduct(req, res))
            return;
        //variable para obtener la hora de creacion del producto
        let date = new Date().toDateString();
        //variable que guardará toda la informacion del producto
        let producto = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: Number.parseInt(req.body.precio),
            fecha: date,
            autor: req.session.usuario
        }
        //metodo de la base de datos para añadir un producto
        gestorBD.insertarProducto(producto, function (respuesta) {
            //checkeamos que no hay ningun error
            if (respuesta == null)
                //redireccionamos a la vista de error
                res.redirect("/systemError");
            else if (req.body.destacar) {
                res.redirect("/product/distinguish/" + respuesta)
            } else

                res.redirect("/home?mensaje=Oferta añadida correctamente");
        });
    });
    app.get("/product/delete/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.eliminarProducto(criterio, function (productos) {
            if (productos == null) {
                res.redirect("/systemError");
            } else {
                res.redirect("/home");
            }
        });
    });

    app.get("/tienda", function (req, res) {
        let criterio = {
            $and:
                [
                    {"autor": {$ne: req.session.usuario}},
                    {"destacada": {$exists: true}}
                ]
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerProductos(criterio, function (destacados) {
            if (destacados == null)
                res.redirect("/systemError");
            else {
                if (req.query.busqueda != null && req.query.busqueda != "") {
                    criterio2 = {
                        $and:
                            [
                                {"nombre": {$regex: new RegExp(req.query.busqueda, 'i')}},
                                {"autor": {$ne: req.session.usuario}},
                                {"destacada": {$exists: false}}
                            ]
                    };
                } else {
                    criterio2 = {
                        $and:
                            [
                                {"autor": {$ne: req.session.usuario}},
                                {"destacada": {$exists: false}}
                            ]
                    };
                }
                gestorBD.obtenerProductosPg(criterio2, pg, function (productos, total) {
                    if (productos == null)
                        res.redirect("/systemError");
                    else {
                        let ultimaPg = total / 5;
                        if (total % 5 > 0) { // Sobran decimales
                            ultimaPg = ultimaPg + 1;
                        }
                        let paginas = []; // paginas mostrar
                        for (let i = pg - 2; i <= pg + 2; i++) {
                            if (i > 0 && i <= ultimaPg) {
                                paginas.push(i);
                            }
                        }
                        let usuario = {
                            email: req.session.usuario,
                            rol: req.session.rol,
                            dinero: req.session.dinero,
                        }
                        let respuesta = swig.renderFile('vistas/tienda.html', {
                            userSession: usuario,
                            destacados: destacados,
                            ofertas: productos,
                            paginas: paginas,
                            actual: pg,
                            busqueda: req.query.busqueda
                        });
                        res.send(respuesta);
                    }
                });
            }
        })
    });
    app.get("/product/distinguish/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        let criterio2 = {"email": req.session.usuario}
        let values = {"destacada": true}
        if (validadorProductos.checkSaldo(req, res, "/home", 20))
            gestorBD.cobrar(criterio2, 20, function (usuario) {
                if (usuario == null) {
                    res.redirect("/systemError")
                } else {
                    gestorBD.marcarDestacado(criterio, values, function (producto) {
                        if (producto == null) {
                            gestorBD.cobrar(criterio2, -20, function (usuario) {
                                if (usuario == null) {
                                    res.redirect("/systemError")
                                }
                            })
                        } else {
                            req.session.dinero = req.session.dinero - 20
                            res.redirect("/home")
                        }
                    })
                }
            })
    });

    app.get("/product/buy/:id", function (req, res) {
        let criterioProducto = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        let criterioUsuario = {"email": req.session.usuario};
        gestorBD.obtenerProductos(criterioProducto, function (producto) {
            if (producto === null)
                res.redirect("/systemError")
            else {
                let checkCompra = validadorProductos.checkCompra(req, res, producto[0]);
                if (!checkCompra)
                    return;
                let comprador = {
                    comprador: req.session.usuario
                }
                gestorBD.comprarProducto(criterioProducto, comprador, function (canciones) {
                    if (canciones == null) {
                        res.redirect("/systemError")
                    } else {
                        gestorBD.cobrar(criterioUsuario, producto[0].precio, function (resultado) {
                            if (resultado === null)
                                res.redirect("/systemError");
                            else {
                                req.session.dinero = req.session.dinero - producto[0].precio
                                res.redirect("/user/buyed");
                            }

                        });

                    }
                });
            }

        });

    });
};