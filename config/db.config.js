// const mysql = require("mysql");
// const express = require("express");
// const bodyParser = require("body-parser");
// var path= require('path');

// var app = express();

// app.use(bodyParser.json());

// var connection = new mysql.createConnection({
//     host: 'localhost',
//     user:'root',
//     password:'password',
//     database:'user',
// });

// connection.connect((err)=>{
//     if(!err)
//     {
//         //console.log(err);
//         console.log("Connected !");
//     }
//     else
//     {
//         console.log(err);
//         console.log("Connection Failed !");
//     }
// });
// module.exports = connection;

// const express = require("express");
// var path= require('path');
// const Sequelize = require('sequelize');
// const connection = new Sequelize('user', 'root', 'password', {
//     host: 'localhost',
//     dialect: 'mysql',
//     operatorsAliases: false
// });
// connection.authenticate()
// .then(() => console.log('Database Connected ..'))
// .catch(err =>console.log('Error: '+ err))

// module.exports = connection;

const Sequelize = require('sequelize');
const sequelize = new Sequelize('user', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.Customer = require('../models/customer.model.js')(sequelize, Sequelize);
 
module.exports = db;