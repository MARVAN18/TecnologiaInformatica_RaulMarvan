const express =  require("express");
const bodyParser = require("body-parser");
var app = express();

const archivos = require('fs');

app.use(bodyParser.urlencoded({extenden:false}));
app.use(bodyParser.json());

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
    },

    removeUsuarios : function (email, callback) {
      this.usuarios.deleteOne({email: ObjectId(email)}, callback);
      archivos.writeFileSync('usuarios.json', JSON.stringify(this.usuarios),
      function (error) {
          if (error) {
              console.log('Hubo un error al escribir en el archivo')
              console.log(error);
          }
      });
    },    
}

app.get('/',function(req,res){
  res.sendFile('index.html' , { root : __dirname});
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

//DELETE
app.delete('/usuarios/:email',function(req,res){
  db.initDB();
  var emaild = req.body.email;
  //db.usuarios.pop(usuario);
  db.removeUsuarios(emaild);
  res.json({'status' : 'OK'});
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