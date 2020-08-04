const PORT = 8080;

let express = require('express');
let logger = require('morgan');
let logRouter = require('./routes/log');

let app = express();

// Setup dependencies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup routes
app.use('/log', logRouter);

// Listen for connections
app.listen(PORT, function() {
    console.debug('Node server started');
});

module.exports = app;

