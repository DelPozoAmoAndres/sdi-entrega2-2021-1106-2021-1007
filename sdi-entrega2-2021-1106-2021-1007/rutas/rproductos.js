module.exports = function(app,swig,gestorBD,validadorProductos) {
    app.get("/product/add", function (req, res) {
        let respuesta = swig.renderFile('vistas/addproduct.html', {});
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
};