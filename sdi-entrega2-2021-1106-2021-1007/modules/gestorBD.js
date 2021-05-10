module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarUsuario: function (usuario, funcionCallback) { //Funcion de registro en BD
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuarios: function (criterio, funcionCallback) {//Funcion de login desde BD
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection("usuarios");
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarUsuario: function (usuario, funcionCallback) {//Funcion de bvorrado de usuarios solo disponible por el admin
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.remove(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    insertarProducto: function (producto, functionCallback) {//Funcion de añadir un producto en BD
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('productos');
                collection.insertOne(producto, function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerProductos: function (criterio, functionCallback) {//Obtencion de los productos disponibles segun el criterio
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection("productos");
                collection.find(criterio).toArray(function (err, productos) {
                    if (err)
                        functionCallback(null);
                    else {
                        functionCallback(productos);
                    }
                });
            }
        });
    },
    eliminarProducto: function (criterio, funcionCallback) {//Borrado de productos en BD
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('productos');
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    comprarProducto: function (criterio, comprador, funcionCallback) {//Comprado de producto (actualiza la coleccion de productos añadiendo un comprador)
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('productos');
                collection.update(criterio, {$set: comprador}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                });
            }
        });
    },
    cobrar: function (criterio, dinero, funcionCallback) {//Funcion de cobrar. Se usa cuando se compra una oferta y cuando se destaca
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.update(criterio, {$inc: {dinero: -dinero}}, function (err, result) {//Quitamos el precio de la accion
                    if (err)
                        funcionCallback(null)
                    else
                        funcionCallback(result)
                });
                db.close();
            }
        });
    },
    obtenerProductosPg: function (criterio, pg, funcionCallback) {//Obtiene los productos de la tieda de forma paginada
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('productos');
                collection.find(criterio).count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, productos) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(productos, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    marcarDestacado: function (criterio, values, functionCallback) {//Marca como destacado una oferta
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('productos');
                let newValues = {$set: values}
                collection.updateOne(criterio, newValues, function (err, producto) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(producto);
                    }
                    db.close();
                });
            }
        })
    },
    obtenerConversaciones: function (criterio,chat, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('conversaciones');
                collection.find(criterio).toArray(function (err, conversaciones) {
                    if (err) {
                        functionCallback(null);
                    } else if (conversaciones.length === 0) {
                        collection.insertOne(chat,function (err, conversaciones) {
                            if (err) {
                                functionCallback(null);
                            } else {
                                console.log(conversaciones)
                                functionCallback(conversaciones.ops[0]._id)
                            }
                        })
                    } else {
                        functionCallback(conversaciones[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    insertarMensaje: function (mensaje, functionCallback) {//Funcion de añadir un producto en BD
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.insertOne(mensaje, function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerMensajes: function (criterio, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.find(criterio).toArray(function (err, mensajes) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(mensajes);
                    }
                    db.close();
                });
            }
        });
    }
}