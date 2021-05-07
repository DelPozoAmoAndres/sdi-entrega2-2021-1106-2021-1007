module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarUsuario: function (usuario, funcionCallback) {
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
    obtenerUsuarios: function (criterio, funcionCallback) {
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
    eliminarUsuario: function (usuario, funcionCallback) {
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
    insertarProducto: function (producto, functionCallback) {
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
    obtenerProductos: function (criterio, functionCallback) {
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
    eliminarProducto: function (criterio, funcionCallback) {
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
    comprarProducto: function (criterio, comprador, funcionCallback){
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
    cobrar: function (criterio, dinero, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                collection = db.collection('usuarios');
                collection.update(criterio, {$inc: { dinero : -dinero }}, function (err, result) {
                    if (err)
                        funcionCallback(null)
                    else
                        funcionCallback(result)
                });
                db.close();
            }
        });
    },
    obtenerProductosPg : function(criterio,pg,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
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
    marcarDestacado:function (criterio,values,functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('productos');
                let newValues={$set: values}
                collection.updateOne(criterio,newValues,function(err,producto){
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(producto);
                    }
                    db.close();
                });
            }
        })
    }
}