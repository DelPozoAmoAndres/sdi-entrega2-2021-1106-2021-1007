module.exports = function (app, swig, gestorBD) {
    //ruta get para ver la vista usuario estandar
    app.get("/homeUser", function (req, res) {
        // criterio para obtener los productos de un usuario
        let criterio = {
            autor: req.session.usuario
        }
        //metodo de la base de datos que nos devuelve la lista de productos que coinciden con el criterio anterior
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                app.get("logger").error('Error al listar productos del usuario');
                res.redirect("/systemError")
            }
            else {
                app.get("logger").info('Listado correcto de los productos');
                let usuario = {
                    email: req.session.usuario,
                    rol: req.session.rol,
                    dinero: req.session.dinero,
                }
                //renderizamos la vista homeStandard y pasandole por sesion la lista de productos y el usuario
                let respuesta = swig.renderFile('vistas/homeStandard.html', {
                    userSession: usuario,
                    productos: productos
                });
                res.send(respuesta);
            }
        });
    });
    // ruta get para listar las compras realizadas
    app.get("/user/buyed", function (req, res) {
        // criterio para obtener los productos comprados de un usuario
        let criterio = {
            comprador: req.session.usuario
        }
        //metodo para obtener los productos que ha comprado un usuario especificado por el criterio dado
        gestorBD.obtenerProductos(criterio, function (compras) {
                if (compras == null){
                    app.get("logger").error('Error al listar las compras del usuario');
                    res.redirect("/systemError")
                }
                else {
                    app.get("logger").info('Listado correcto de los compras');
                    let usuario = {
                        email: req.session.usuario,
                        rol: req.session.rol,
                        dinero: req.session.dinero,
                    }
                    let respuesta = swig.renderFile('vistas/productsBuyed.html', {
                        ofertas: compras,
                        userSession: usuario
                    })
                    res.send(respuesta);
                }
            }
        )
    });
}