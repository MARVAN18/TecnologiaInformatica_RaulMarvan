const express = require('express');
const session = require('cookie-session');
const path = require('path'); //Obtiene la ruta
const engine = require('ejs-mate'); //Plantilas HTML
const morgan = require('morgan'); //Peticiones

// Ejecución de Express
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extenden: false }));
app.use(bodyParser.json());

// Configuraciones
app.set('port', process.env.PORT || 3000); //Puerto a utilizar
app.set('views', path.join(__dirname, 'views')); //Unir directorio SRC + Views para informarle a NODE que las views están en ./SRC/VIEWS
app.engine('ejs', engine); //Nuevo motor de vistas
app.set('view engine', 'ejs');//Implementación del motor de vistas

// Ejecución antes de acceder a la ruta
app.use(morgan('dev')); //Morgan con configuracion de Development para mostrar en consola las peticiones
app.use(session({ //Usuario que inicia sesion
  secret: 'seguridad',
  signed: true
}));

// Variables globales
app.use((req, res, next) => {
  res.locals.formatDate = (date) => {
    let myDate = new Date(date * 1000);
    return myDate.toLocaleString();
  }

  if (req.session.access_token && req.session.access_token != 'undefined') {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
});

// Ruta inicial
app.use(require('./routes/index'));

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Puerto e inicialización
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});