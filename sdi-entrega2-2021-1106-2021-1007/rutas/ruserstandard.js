module.exports = function (app, swig, gestorBD){
    app.get("/home", function (req, res){
        let respuesta = swig.renderFile('vistas/homeStandard.html', {
            user: req.session.usuario
        });
        res.send(respuesta);
    });
};