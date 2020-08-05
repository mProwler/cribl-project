/**
 * Run app
 * @param logPath base path for log files
 * @param callback
 * @returns {http.Server}
 */
function run(logPath, callback) {
    const PORT = 8080;

    let express = require('express');
    let logger = require('morgan');
    let logRouter = require('./routes/log');

    let app = express();

    // Setup dependencies
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    if (logPath) {
        app.set('LOG_PATH', logPath);
    }

    // Setup routes
    app.use('/log', logRouter);

    // Listen for connections
    let server = app.listen(PORT, function() {
        console.debug('Node server started');

        if (callback) {
            callback();
        }
    });

    return server;
}

// Invoke run if we're called directly
if (require.main === module) {
    run();
}

exports.run = run;

