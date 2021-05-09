module.exports = function (app, gestorBD) {
    app.post("/api/autenticar", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }
        if (criterio.email===undefined || criterio.email.length===0 || seguro.length===0){
            res.status(500);
            res.json({
                error: "se ha producido un error de validacion"
            })
            return;
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios){
            if (usuarios==null || usuarios.length===0) {
                res.status(40); //Unauthorized
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
    });
    app.get("/api/producto", function (req, res) {
        let criterio = {"autor": {$ne: req.session.usuario}}
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
}