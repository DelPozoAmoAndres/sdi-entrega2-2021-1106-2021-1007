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
            if (respuesta == null) {
                app.get("logger").error('Error al añadir un producto');
                //redireccionamos a la vista de error
                res.redirect("/systemError");
            }
            else if (req.body.destacar) {
                app.get("logger").info('Producto añadido y destacado correctamente');
                res.redirect("/product/distinguish/" + respuesta)
            } else {
                app.get("logger").info('Producto añadido correctamente');
                res.redirect("/home?mensaje=Oferta añadida correctamente");
            }
        });
    });

    //Ruta get para eliminar un producto
    app.get("/product/delete/:id", function (req, res) {
        //criterio del producto a eliminar
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        //Acceso a base de datos para obtener el producto a borrar y poder validarlo
        gestorBD.obtenerProductos(criterio, function (prod) {
            if (prod === null) {
                app.get("logger").error('Error al listar productos');
                res.redirect("/systemError")
            }
            //Comprobamos que el producto a borrar no esté comprado y sea propiedad del usuario autenticado
            else {
                if (validadorProductos.checkEliminar(req, res, prod[0])) {
                    //Acceso a base de datos para borrar el producto
                    gestorBD.eliminarProducto(criterio, function (productos) {
                        if (productos == null) { //Si da error vamos a la pagina de error
                            app.get("logger").error('Error al elimninar el producto');
                            res.redirect("/systemError");
                        } else { //si se ha eliminado bien volvemos a mostrar las ofertas del usuario
                            app.get("logger").info('Producto eliminado correctamente');
                            res.redirect("/home");
                        }
                    });
                }
            }
        });
    });

    //ruta get para listar todos los productos
    app.get("/tienda", function (req, res) {
        //creamos un criterio para obtener los productos destacados
        let criterio = {
            $and:
                [
                    {"autor": {$ne: req.session.usuario}},
                    {"destacada": {$exists: true}}
                ]
        }
        //control de paginado
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        //metodo de la base de datos para obtener todos los productos que cumplan el criterio anterior
        gestorBD.obtenerProductos(criterio, function (destacados) {
            let criterio2;
            if (destacados == null) {
                app.get("logger").error('Error al listar productos de la tienda');
                res.redirect("/systemError");
            }
            else {
                app.get("logger").info('Listado correcto de los productos de la tienda');
                //comprobamos si hemos hecho una busqueda de un producto por una palabra clave
                if (req.query.busqueda != null && req.query.busqueda !== " " && req.query.busqueda !== "") {
                    //criterio para obtener los productos que tengan relación con la palabra clave,
                    // que no sean del usuario que visita la tienda y que no sean destacadas
                    criterio2 = {
                        $and:
                            [
                                {"nombre": {$regex: new RegExp(req.query.busqueda, 'i')}},
                                {"autor": {$ne: req.session.usuario}},
                                {"destacada": {$exists: false}}
                            ]
                    };
                    //si no se ha realizado ninguna busqueda
                } else {
                    //criterio para obtener los productos que no sean del usuario que visita la tienda y
                    // que no sean destacadas
                    criterio2 = {
                        $and:
                            [
                                {"autor": {$ne: req.session.usuario}},
                                {"destacada": {$exists: false}}
                            ]
                    };
                }
                //metodo que obtiene los productos que entran en una pag y que coinciden con el criterio definido
                gestorBD.obtenerProductosPg(criterio2, pg, function (productos, total) {
                    if (productos == null)
                        res.redirect("/systemError");
                    else {
                        //parametros para crear bien la lista de paginas disponibles
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

    //ruta get para marcar como destacado un producto
    app.get("/product/distinguish/:id", function (req, res) {
        //criterio para saber que producto marcar como destacado
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        //criterio para cobrar el dinero al usuario definido
        let criterio2 = {"email": req.session.usuario}
        //nuevo valor que le tenemos que introducir al producto en la base de datos
        let values = {"destacada": true}

        //comprobamos que el usuario tiene suficiente dinero para destacar el producto
        if (validadorProductos.checkSaldo(req, res, "/homeUser", 20))
            //metodo de la base de datos para descontar el dinero de su cuenta
            gestorBD.cobrar(criterio2, 20, function (usuario) {
                if (usuario == null) {
                    res.redirect("/systemError")
                } else {
                    //metodo de la base de datos para marcar como destacado el producto que cumple el criterio
                    gestorBD.marcarDestacado(criterio, values, function (producto) {
                        //en caso de haber algun problema al marcarlo como destacado
                        if (producto == null) {
                            //devolver el dinero al usuario
                            gestorBD.cobrar(criterio2, -20, function (usuario) {
                                if (usuario == null) {
                                    res.redirect("/systemError")
                                }
                                app.get("logger").error('Error al destacar el producto');
                                res.redirect("/homeUser?mensaje=Se ha producido un problema al " +
                                    "marcar como destacada dicho producto, intentelo más tarde")
                            })
                        } else {
                            app.get("logger").info('Producto destacado correctamente');
                            req.session.dinero = req.session.dinero - 20
                            res.redirect("/home")
                        }
                    })
                }
            })
        else
            app.get("logger").info('No se ha podido destacar el producto: No hay suficiente saldo');
    });

    //ruta gert para comprar un producto
    app.get("/product/buy/:id", function (req, res) {
        //criterio para comprar el producto
        let criterioProducto = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        //criterio para cobrar el dinero al comprador
        let criterioUsuario = {"email": req.session.usuario};

        //metodo de la base de datos para obtener el producto a comprar
        gestorBD.obtenerProductos(criterioProducto, function (producto) {
            if (producto === null) {
                app.get("logger").error('Error al comprar el producto');
                res.redirect("/systemError")
            }
            else {
                //comprobamos que hay dinero suficiente para realizar la compra
                let checkCompra = validadorProductos.checkCompra(req, res, producto[0]);
                if (!checkCompra) {
                    app.get("logger").info('No se ha podido comprar el producto: no hay suficiente saldo');
                    return;
                }
                //nuevo atributo a insertar en el producto comprado
                let comprador = {
                    comprador: req.session.usuario
                }
                //metodo de la base de datos para insertar en el producto un nuevo atributo
                gestorBD.comprarProducto(criterioProducto, comprador, function (canciones) {
                    if (canciones == null) {
                        res.redirect("/systemError")
                    } else {
                        //metodo de la base de datos para cobrar el dinero del producto
                        gestorBD.cobrar(criterioUsuario, producto[0].precio, function (resultado) {
                            if (resultado === null)
                                res.redirect("/systemError");
                            else {
                                app.get("logger").info('Compra del producto exitosa');
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