const PORT = 8080;

let express = require('express');
let logger = require('morgan');

let logRouter = require('./routes/log');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/log', logRouter);

app.listen(PORT, function() {
    console.log('Node server started');
});

module.exports = app;

