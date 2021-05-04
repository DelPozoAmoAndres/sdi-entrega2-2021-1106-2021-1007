module.exports = {
    gestorBD: null,
    init: function (gestorBD) {
        this.gestorBD = gestorBD;
    },
    addproduct: function (req, res){
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
    }
}