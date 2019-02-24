const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extenden:false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
    //res.sendFile("index.html"); //TAREA ***************************************
    res.sendFile('index.html' , { root : __dirname});
});

app.post('/user',function(req,res){
    var clave=req.body.clave;
    var nombre=req.body.nombre;
    console.log("Clave única= " + clave + ", alumno " + nombre);
    res.json({'status':'OK'});
});

app.listen(port, function () {
    console.log('Servidor corriendo en el puerto: ' + port);
});