let express = require('express');
let app = express();
let os = require('os');
let puerto = 3000;

app.listen(puerto, function() {
    console.log("Servidor listo "+puerto);
});
