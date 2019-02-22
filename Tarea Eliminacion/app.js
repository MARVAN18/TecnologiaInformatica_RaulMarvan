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

    //Eliminar un usuario por el email
    deleteAlumnoByEmail : function (email) {
      var index;
      //Buscamos el indice del usuario
      for (index = 0; index < this.usuarios.length; index++) {
        if(this.usuarios[index].email == email )
        break;
      }
      
      //Si se encontro el indice se elimina
      if(index<db.usuarios.length){
        delete db.usuarios[index];
        db.usuarios.splice(index, 1);
        db.saveUsuarios();
      }
    }
    
}

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendFile('index.html' , { root : __dirname});
});

app.route("/usuarios")
  .get( (req, res) => {
    db.initDB();
    res.json(db.usuarios);
  })
  .post((req,res)=> {
    db.initDB();
    var usuario = req.body;
    console.log("Objeto post recibido");
    console.log(usuario);
    db.usuarios.push(usuario);
    db.saveUsuarios();
    res.json({'status' : 'OK'});
  })
  .delete((req,res)=> {
    db.initDB();
    var usuario = req.body;
    console.log("Objeto post recibido");
    console.log(usuario);
    db.deleteAlumnoByEmail( usuario.email);
    console.log(db.usuarios);
    res.json({'status' : 'OK'})
  });

  app.get('/usuario/:email', (req, res) => {
    db.initDB();
    var email = req.params.email;
    var usuario = db.getUsuarioBy('email', email);
    res.json(usuario);
  });

  app.put('/usuario/:email',(req,res) => {
    //
    db.initDB();
    var email = req.params.emailN;
    var pass = req.params.passN;
    
    console.log("Objeto post recibido");
    console.log(usuario);
    db.deleteAlumnoByEmail( usuario.email);
    console.log(db.usuarios);
    res.json({'status' : 'OK'})
  });

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})
