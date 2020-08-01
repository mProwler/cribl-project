const express = require('express');
const lineReader = require('reverse-line-reader');
const router = express.Router();

const LOG_BASE = '/var/log';

/* GET contents of log file */
router.get('/:log', function(req, res, next) {
  let log = req.params.log;
  let lines = req.query.num || false;
  let filter = req.query.filter || '';
  let lineCount = 0;

  if (!log) {
    throw new Error('Missing required param "log"');
  }

  let filename = LOG_BASE + '/' + log;
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
