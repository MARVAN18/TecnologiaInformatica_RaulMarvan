const express =  require("express");
const bodyParser = require("body-parser");
var app = express();

const archivos = require('fs');


//DB Handler
var db = {
    //Indicar BD o abrir conexion
    initDB: function () {
        var fs = require("fs");
        var contents = fs.readFileSync("./alumnos.json");
        this.alumnos = JSON.parse(contents);
    },

    //Busqueda Alumno
    getAlumnoBy: function (filter, value) {
        console.log("filtro: " + filter + "valor: " + value);
        var selected = null;
        this.alumnos.forEach(alumno => {
            console.log(alumno);
            console.log(alumno[filter]);
            if (alumno[filter] == value) {
                selected = alumno;
                return selected;
            }
        });
        return selected;
    },

    saveAlumnos : function(){
      archivos.writeFileSync('alumnos.json', JSON.stringify(this.alumnos),
        function (error) {
            if (error) {
                console.log('Hubo un error al escribir en el archivo')
                console.log(error);
            }
        });
    }
    
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("index.html" );
});

app.get('/alumnos', (req, res) => {
  db.initDB();
  res.json(db.alumnos);
});

app.get('/alumnos/:clave', (req, res) => {
  db.initDB();
  var clave = req.params.clave;
  var alumno = db.getAlumnoBy('clave', clave);
  res.json(alumno);
});

app.post('/alumnos',function(req,res){
  db.initDB();
  var alumno = req.body;
  console.log("Objeto post recibido");
  console.log(alumno);
  db.alumnos.push(alumno);
  db.saveAlumnos();
  res.json({'status' : 'OK'});
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})