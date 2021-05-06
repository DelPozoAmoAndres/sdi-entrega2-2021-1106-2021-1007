module.exports = function(app,swig,gestorBD,validadorProductos) {
    app.get("/product/add", function (req, res) {
        let usuario = {
            email : req.session.usuario,
            rol : req.session.rol,
            dinero : req.session.dinero,
        }
        let respuesta = swig.renderFile('vistas/addproduct.html', {
            userSession: usuario
        });
        res.send(respuesta);
    });

    app.post("/product/add", function (req, res){
        //comprobar si hay errores al introducir los valores
        if(!validadorProductos.addproduct(req,res))
            return;
        let date = new Date().toDateString();
        let producto = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            fecha: date,
            autor: req.session.usuario
        }
        gestorBD.insertarProducto(producto, function (respuesta){
            if (respuesta==null)
                res.redirect("/systemError");
            else
                res.redirect("/home?mensaje=Oferta añadida correctamente");
        });
    });
    app.get("/product/delete/:id", function(req, res){
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.eliminarProducto(criterio, function (canciones) {
            if (canciones == null) {
                res.send(respuesta);
            } else {
                res.redirect("/home");
            }
        });
    });

    app.get("/tienda", function (req, res){
        let criterio = {"autor": {$ne :req.session.usuario}};
        if (req.query.busqueda != null && req.query.busqueda!="") {

            criterio = {$and:
                    [
                        {"nombre": { $regex :new RegExp(req.query.busqueda, 'i')}},
                        {"autor": {$ne :req.session.usuario}}
                    ]
            }   ;
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerProductosPg(criterio, pg,function (productos,total){
            if (productos==null)
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
                    email : req.session.usuario,
                    rol : req.session.rol,
                    dinero : req.session.dinero,
                }
                let respuesta = swig.renderFile('vistas/tienda.html', {
                    userSession: usuario,
                    ofertas : productos,
                    paginas: paginas,
                    actual: pg,
                    busqueda: req.query.busqueda
                });
                res.send(respuesta);
            }
        });
    });
};