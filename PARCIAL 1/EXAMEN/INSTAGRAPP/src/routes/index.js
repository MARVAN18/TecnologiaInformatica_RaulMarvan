const express = require("express");
const path = require('path'); //Obtiene la ruta
const router = express.Router(); //Modulo para crear rutas.

//Para leer archivo
const archivos = require('fs');

//DB Handler
var db = {
  //Indicar BD o abrir conexion
  initDB: function () {
    var fs = require("fs");
    var contents = fs.readFileSync(path.join(__dirname, "usuario.json"));
    this.usuario = JSON.parse(contents);
    var mediaU = fs.readFileSync(path.join(__dirname, "media.json"));
    this.media = JSON.parse(mediaU);
  },

  saveUsuario: function () {
    archivos.writeFileSync(path.join(__dirname, "usuario.json"), JSON.stringify(this.usuario),
      function (error) {
        if (error) {
          console.log('Hubo un error al escribir en el archivo')
          console.log(error);
        }
      });
  },

  saveMedia: function () {
    archivos.writeFileSync(path.join(__dirname, "media.json"), JSON.stringify(this.media),
      function (error) {
        if (error) {
          console.log('Hubo un error al escribir en el archivo')
          console.log(error);
        }
      });
  },
}

// Instagram API
const Instagram = require("node-instagram").default;//Modulo para Autenticación y pedir los datos de sesión
const { clientId, clientSecret } = require("../keys").instagram;//Importación de las keys para conectar con Instagram

const instagram = new Instagram({ //Nueva instancia para la conexión
  clientId: clientId, //Importados desde el documento keys
  clientSecret: clientSecret
});
const redirectUri = "http://localhost:3000/handleauth"; //Constante de recepción de respuestas de Instagram

// Redireccionamiento a instagram oauth
router.get("/auth/instagram", (req, res) => {
  res.redirect(
    instagram.getAuthorizationUrl(redirectUri, {
      // Variables de petición
      scope: ["basic", "likes"],
      // an optional state
      state: "en linea"
    })
  );
});

// Recibe la respuesta desde Instagram
router.get("/handleauth", async (req, res) => {
  try {
    // Codigo de respuesta
    const code = req.query.code;
    //Pedir datos de el usuario autorizado
    const data = await instagram.authorizeUser(code, redirectUri);
    // data.access_token contiene access_token
    // res.json(data);
    // console.log(data);

    // Sesion del usuario para navegar
    req.session.access_token = data.access_token;
    req.session.user_id = data.user.id;

    //Pasar el acces token a la instancia de instagram
    instagram.config.accessToken = req.session.access_token;
    //console.log(instagram);
    //Redirección a perfil
    try {
      db.initDB();
      db.usuario = data.user;
      db.saveUsuario();
    } catch (err) {
      console.log(err);
    }
    res.redirect("/profile");
  } catch (err) {
    //Muestra si ocurre algún error
    res.json(err);
  }
});

router.get("/", (req, res) => {
  db.initDB();
  //res.send(db.usuario)
  //res.write(db.usuario);
  //res.end(data);
  //res.json(db.usuario);
  //res.json(db.usuario)
  //res.setHeader('Content-Type', 'application/json');
  //res.end(JSON.stringify(db.usuario));
  //res.render("index");
  res.render("index", { user: db.usuario, media: db.media });
});

// Ruta de perfil
router.get("/profile", async (req, res) => {
  try {
    //Consulta a instagram para obtener datos de Usuario. Direccion dada por Instagram.
    const profileData = await instagram.get("users/self");
    //Consulta a instagram para las fotos recientes. Direccion dada por Instagram
    const media = await instagram.get('users/self/media/recent');
    //console.log("INFO IMPORTANTE ===============");
    //console.log(JSON.stringify(media.data));
    try {
      db.initDB();
      db.media = media.data;
      db.saveMedia();
    } catch (err) {
      console.log(err);
    }
    res.render("profile", { user: profileData.data, posts: media.data });
  } catch (err) {
    console.log(err);
  }
});

// Inicio de sesion
router.get("/login", (req, res) => {
  res.redirect("/auth/instagram");
});

// Cerrar sesion
router.get("/logout", (req, res) => {
  delete req.session.access_token;
  delete req.session.user_id;
  req.session = null;
  //res.redirect("https://www.instagram.com/logout/");
  res.redirect("/");
  //
});

module.exports = router; //Exportacion de rutas para utilizar en la aplicacion principal
