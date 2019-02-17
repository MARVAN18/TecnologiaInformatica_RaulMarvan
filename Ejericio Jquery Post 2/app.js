const express =  require("express");
const bodyParser = require("body-parser");
var app = express();

const archivos = require('fs');


//DB Handler
var db = {
    //Indicar BD o abrir conexion
    initDB: function () {
        var fs = require("fs");
        var contents = fs.readFileSync("./usuarios.json");
        this.usuarios = JSON.parse(contents);
    },

    //Busqueda Usuario
    getUsuarioBy: function (filter, value) {
        console.log("filtro: " + filter + "valor: " + value);
        var selected = null;
        this.usuarios.forEach(usuario => {
            console.log(usuario);
            console.log(usuario[filter]);
            if (usuario[filter] == value) {
                selected = usuario;
                return selected;
            }
        });
        return selected;
    },

    saveUsuarios : function(){
      archivos.writeFileSync('usuarios.json', JSON.stringify(this.usuarios),
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

app.get('/usuarios', (req, res) => {
  db.initDB();
  res.json(db.usuarios);
});

app.get('/usuario/:email', (req, res) => {
  db.initDB();
  var email = req.params.email;
  var usuario = db.getUsuarioBy('email', email);
  res.json(usuario);
});

app.post('/usuarios',function(req,res){
  db.initDB();
  var usuario = req.body;
  console.log("Objeto post recibido");
  console.log(usuario);
  db.usuarios.push(usuario);
  db.saveUsuarios();
  res.json({'status' : 'OK'});
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})