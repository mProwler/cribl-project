const express = require('express');
const lineReader = require('reverse-line-reader');
const router = express.Router();

const LOG_BASE = '/var/log';

/* GET contents of log file */
router.get('/:log', function(req, res, next) {
  var log = req.params.log;
  var lines = req.query.num || false;
  var filter = req.query.filter || '';

  if (!log) {
    throw new Error('Missing required param "log"');
  }

  var filename = LOG_BASE + '/' + log;
  lineReader.eachLine(filename, function(line, last) {

    if (filter && line.indexOf(filter) === -1) {
      return;
    }

    res.send(line);

    if (lines === true && ++lineCount >= lines) {
      return false;
    }
  });

});

module.exports = router;
