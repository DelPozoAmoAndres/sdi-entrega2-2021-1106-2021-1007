module.exports = function (app, gestorBD) {
    app.post("/api/autenticar", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }
        if (criterio.email === undefined || criterio.email.length === 0 || seguro.length === 0) {
            res.status(500);
            res.json({
                error: "se ha producido un error de validacion"
            })
        } else {
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length === 0) {
                    res.status(401); //Unauthorized
                    res.json({
                        autenticado: false
                    })
                } else {
                    let token = app.get('jwt').sign(
                        {usuario: criterio.email, tiempo: Date.now() / 1000},
                        "secreto");
                    res.status(200);
                    res.json({
                        autenticado: true,
                        token: token
                    })
                }
            });
        }
    });
    app.get("/api/producto", function (req, res) {
        let criterio = {"autor": {$ne: res.usuario}}
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(productos));
            }
        });
    });
    app.post("/api/producto/:id/message/add/:comprador", function (req, res) {
        let criterioProducto = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerProductos(criterioProducto, function (productos) {
            if (productos == null || productos.length === 0) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                let usuario = res.usuario
                let criterio = {
                    $or: [
                        {
                            $and:
                                [
                                    {comprador: usuario},
                                    {autor: productos[0].autor},
                                    {producto: gestorBD.mongo.ObjectID(req.params.id)}
                                ]
                        },
                        {
                            $and:
                                [
                                    {autor: usuario},
                                    {comprador: req.params.comprador},
                                    {producto: gestorBD.mongo.ObjectID(req.params.id)}
                                ]
                        }
                    ]
                };

                let chat =
                    {
                        "autor": productos[0].autor,
                        "comprador": res.usuario,
                        "producto": gestorBD.mongo.ObjectID(productos[0]._id),
                        "nombre": productos[0].nombre
                    }

                gestorBD.obtenerConversaciones(criterio, chat, function (conversaciones) {
                    if (conversaciones == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        let date = new Date();
                        let time = gestorBD.mongo.Timestamp(date.getTime())
                        let mensaje = {
                            "autor": res.usuario,
                            "fecha": date.toDateString(),
                            "hora": time,
                            "mensaje": req.body.texto,
                            "leido": false,
                            "conversacion": gestorBD.mongo.ObjectID(conversaciones._id)
                        }

                        gestorBD.insertarMensaje(mensaje, function (mensaje) {
                            if (mensaje === null) {
                                res.status(500);
                                res.json({
                                    error: "se ha producido un error"
                                })
                            } else {
                                res.json({
                                    id: mensaje
                                })
                            }
                        })
                    }
                })
            }
        })
    });

    app.get("/api/producto/chats", function(req, res){
        let criterio = {
            $or: [
                {"autor": res.usuario},
                {"comprador" : res.usuario}
            ]
        }
        gestorBD.obtenerConversaciones(criterio, undefined,function (convers) {
            if (convers == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(convers));
            }
        });
    })

    app.get("/api/producto/:id/chat/:comprador", function (req, res) {
        let criterioProducto = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerProductos(criterioProducto, function (productos) {
            if (productos == null || productos.length === 0) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                let usuario = res.usuario
                let criterio = {
                    $or: [
                        {
                            $and:
                                [
                                    {comprador: usuario},
                                    {autor: productos[0].autor},
                                    {producto: gestorBD.mongo.ObjectID(req.params.id)}
                                ]
                        },
                        {
                            $and:
                                [
                                    {autor: usuario},
                                    {comprador: req.params.comprador},
                                    {producto: gestorBD.mongo.ObjectID(req.params.id)}
                                ]
                        }
                    ]
                };
                gestorBD.obtenerConversaciones(criterio, undefined,function (conversacion) {
                    if (conversacion == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    }
                    else if(conversacion==0){
                        res.status(200)
                        res.json({
                            info: "No hay conversaciones"
                        })

                }else{
                        let criterio={"conversacion":gestorBD.mongo.ObjectID(conversacion._id)}
                        gestorBD.obtenerMensajes(criterio,function (mensajes){
                           if(mensajes===null){
                               res.status(500);
                               res.json({
                                   error: "se ha producido un error"
                               })
                           }
                           else{
                               res.json(mensajes)
                           }
                       })
                    }
                });
            }
        });
    });
}