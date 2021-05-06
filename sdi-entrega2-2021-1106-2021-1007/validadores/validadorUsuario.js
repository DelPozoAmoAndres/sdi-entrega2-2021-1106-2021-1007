module.exports = {
    gestorBD: null,
    init: function (gestorBD) {
        this.gestorBD = gestorBD;
    },
//metodo para verificar valores introducidos al intentar registrarse un usuario
    registro: function (req, res) {
        let criterio = {'email' : req.body.email}
        let emailUsed=false;
        this.gestorBD.obtenerUsuarios(criterio, function (resultado) {
            if (resultado.length>0) {
                console.log("Entra")
                emailUsed=true;
            }

        //comprobamos que email no esté vacio
        if (req.body.email === "" || req.body.email === " ") {
            res.redirect("/registrarse?mensaje=Email está vacio")
        }
        //comprobamos que email no esté ya registrado
        else if ( emailUsed) {
            res.redirect("/registrarse?mensaje=Email ya usado")
        }
        //comprobamos que nombre no esté vacio
        else if (req.body.nombre.replace(/ /g, "")==="") {
            res.redirect("/registrarse?mensaje=Nombre está vacio")
        }
        //comprobamos que nombre tenga minimo 3 caracteres
        else if (req.body.nombre.length < 3) {
            res.redirect("/registrarse?mensaje=Nombre tiene menos de 3 caracteres")
        }
        //comprobamos que apellidos no esté vacio
        else if (req.body.apellidos.replace(/ /g, "")==="") {
            res.redirect("/registrarse?mensaje=Apellidos está vacio")
        }
        //comprobamos que apellidos tenga minimo 3 caracteres
        else if (req.body.apellidos.length < 3) {
            res.redirect("/registrarse?mensaje=Apellidos tiene menos de 3 caracteres")
        }
        //comprobamos que password no esté vacio
        else if (req.body.password.replace(/ /g, "")==="") {
            res.redirect("/registrarse?mensaje=Password está vacio")
        }
        //comprobamos que password tenga minimo 8 caracteres
        else if (req.body.password.length < 8) {
            res.redirect("/registrarse?mensaje=Password tiene menos de 8 caracteres")
        }
        //comprobamos que passwordConfirm no esté vacio y que sea igual que password
        else if (req.body.passwordConfirm.replace(/ /g, "")===""
            || req.body.passwordConfirm.localeCompare(req.body.password)){
            res.redirect("/registrarse?mensaje=No coinciden las contraseñas")
        } else {
            console.log("no sale")
            return true
        }
        console.log("Sale")
        return false
        })
    },
}