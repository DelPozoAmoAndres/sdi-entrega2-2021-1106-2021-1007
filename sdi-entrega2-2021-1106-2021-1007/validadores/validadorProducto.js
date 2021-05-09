module.exports = {
    gestorBD: null,
    init: function (gestorBD) {
        this.gestorBD = gestorBD;
    },
    addproduct: function (req, res){
        //comprobamos que los campos sean correctos: no sean vacios y tengan la longitud y valor adecuados
        if (req.body.nombre.replace(/ /g, "")==="" || req.body.descripcion.replace(/ /g, "")===""){
            res.redirect("/product/add?mensaje=Hay algún campo vacío");
        } else if (req.body.nombre.length>9)
            res.redirect("/product/add?mensaje=El nombre debe tener menos de 9 caracteres");
        else if (req.body.descripcion.length<15)
            res.redirect("/product/add?mensaje=La descripción debe tener al menos de 15 caracteres");
        else if (req.body.precio<1)
            res.redirect("/product/add?mensaje=Se debe introducir un precio positivo");
        else
            return true;
        return false;
    },
    checkCompra: function (req, res, producto){
        //Si el producto es mas caro que el saldo del usuario no permitimos la compra
        if (producto.precio>req.session.dinero)
            res.redirect("/tienda?mensaje=No tienes suficiente saldo&tipoMensaje=alert-danger")
        //Si el usuario es el propietario del producto
        else if (producto.autor===req.session.usuario)
            res.redirect("/tienda?mensaje=No puedes comprar esta oferta porque eres el propietario&tipoMensaje=alert-danger")
        else
            return true;
        return false;
    },
    checkSaldo: function (req, res,url,cantidad){
        //Si la cantidad es mayor que el saldo del usuario no permitimos la compra
        if (cantidad>req.session.dinero) {
            res.redirect(url + "?mensaje=No tienes suficiente saldo&tipoMensaje=alert-danger")
            return false;
        }
        return true;
    },
    checkEliminar: function (req, res, producto){
        //Si el producto a eliminar no es propiedad de quien esta registrado o esta vendido
        if (producto.autor!=req.session.usuario) {
            res.redirect("/home?mensaje=No puedes borrar esta ofera porque no eres el propietario")
        } else if (producto.comprador!=undefined)
            res.redirect("/home?mensaje=No puedes borrar esta ofera porque ya se ha vendido")
        else
            return false;
        return true;
    }
}