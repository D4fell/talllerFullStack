'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/models');

const user = require('./src/routes/user.routes');
const coin = require('./src/routes/coin.routes');
const auth = require('./src/routes/auth.routes');

const app = express();
const port = process.env.PORT || 8000;

let corsOptions = {
    origin: 'http://localhost:8001'
  };

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

db.sequelize.sync();
/*db.sequelize.sync({ force: true }).then(() => {
  console.log("Base de datos sincronizada");
});*/

app.use('/app/users', user);
app.use('/app/coins', coin);
app.use('/app/auth', auth);

app.get('/',(req,res) => {
  res.status(200).send({message:'API Taller FullStack Corriendo exitosamente'});
})

app.post('/test', async (req, res) => {
  res.status(200).send({message:'Exitoso!!!'});
})

app.listen(port, ()=> console.log(`el API está corriendo en http://localhost:${port}`)) 

module.exports = app