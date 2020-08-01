var express = require('express');
var logger = require('morgan');

var logRouter = require('./routes/log');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/log', logRouter);

module.exports = app;
