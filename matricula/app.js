var express = require('express');
var app = express();
var db = require('./db');

var MatriculaController = require('./matricula/MatriculaController');
app.use('/matricula', MatriculaController);

module.exports = app;