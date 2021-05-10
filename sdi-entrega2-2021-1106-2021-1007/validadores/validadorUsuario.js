module.exports = {
    gestorBD: null,
    init: function (gestorBD) {
        this.gestorBD = gestorBD;
    },
    //metodo para verificar valores introducidos al intentar registrarse un usuario
    registro: function (req, res,functionCallback) {
        let criterio = {'email': req.body.email}
        let error = true;
        this.gestorBD.obtenerUsuarios(criterio, function (resultado) {
            if (resultado.length > 0) {
                console.log("Usuario duplicado")
                res.redirect("/registrarse?mensaje=Email ya usado&tipoMensaje=alert-danger")
            }
            //comprobamos que email no esté vacio
            else if (req.body.email === "" || req.body.email === " ") {
                res.redirect("/registrarse?mensaje=Email está vacio&tipoMensaje=alert-danger")
            }
            //comprobamos que nombre no esté vacio
            else if (req.body.nombre.replace(/ /g, "") === "") {
                res.redirect("/registrarse?mensaje=Nombre está vacio&tipoMensaje=alert-danger")
            }
            //comprobamos que nombre tenga minimo 3 caracteres
            else if (req.body.nombre.length < 3) {
                res.redirect("/registrarse?mensaje=Nombre tiene menos de 3 caracteres&tipoMensaje=alert-danger")
            }
            //comprobamos que apellidos no esté vacio
            else if (req.body.apellidos.replace(/ /g, "") === "") {
                res.redirect("/registrarse?mensaje=Apellidos está vacio&tipoMensaje=alert-danger")
            }
            //comprobamos que apellidos tenga minimo 3 caracteres
            else if (req.body.apellidos.length < 3) {
                res.redirect("/registrarse?mensaje=Apellidos tiene menos de 3 caracteres&tipoMensaje=alert-danger")
            }
            //comprobamos que password no esté vacio
            else if (req.body.password.replace(/ /g, "") === "") {
                res.redirect("/registrarse?mensaje=Password está vacio&tipoMensaje=alert-danger")
            }
            //comprobamos que password tenga minimo 8 caracteres
            else if (req.body.password.length < 8) {
                res.redirect("/registrarse?mensaje=Password tiene menos de 8 caracteres&tipoMensaje=alert-danger")
            }
            //comprobamos que passwordConfirm no esté vacio y que sea igual que password
            else if (req.body.passwordConfirm.replace(/ /g, "") === ""
                || req.body.passwordConfirm.localeCompare(req.body.password)) {
                res.redirect("/registrarse?mensaje=No coinciden las contraseñas&tipoMensaje=alert-danger")
            } else {
                console.log("No error found")
                functionCallback(true)
                error=false;
            }
            if (error) {
                console.log("Validation error found")
                functionCallback(false)
            }
        })
    },
}