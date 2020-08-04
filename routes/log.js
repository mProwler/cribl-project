const express = require('express');
const router = express.Router();
const fs = require('fs');

const LOG_BASE = '/var/log';

/* GET contents of log file */
router.get('/:log', function(req, res, next) {
  let log = req.params.log;
  let lines = req.query.num || false;
  let filter = req.query.filter || '';
  let lineCount = 0;

  // Check arguments
  if (!log) {
    throw new Error('Missing required param "log"');
  }

  let filename = LOG_BASE + '/' + log;
  let body = '';

  // Open log file
  fs.open(filename, 'r', function(err, fd) {
    let chr = '';
    let line = '';
    let done = false;

    if (err) {
      console.error('Error opening specified log file.');
      throw err;
    }

    // Get file size and allocate buffer instance
    let stats = fs.statSync(filename);
    let pos = stats["size"];
    let buffer = Buffer.alloc(1);

    // Iterate through log file in reverse
    do {
      let byteCount = fs.readSync(fd, buffer, {
        length: 1,
        position: --pos
      });

      if (byteCount < 1) {
        // Nothing read from file, we're done
        done = true;
      } else {
        chr = buffer.toString()[0];
      }

      // Check for line feed
      if (chr !== "\n") {
        line = chr + line;
      } else {
        // Check for filter string (if specified)
        if (!filter || line.indexOf(filter) !== -1) {
          // Check for empty line, skip it if it's the first (last) line
          if (line || lineCount > 0) {
            body = body + line + "\n";
            lineCount++;
          }
        }

        // Reset line value
        line = '';

        // Check if we've reached our desired line count
        if (lines !== false && lineCount >= lines) {
          done = true;
        }
      }
    } while (!done && pos > 0);

    // Close file handle
    fs.close(fd, function (err) {
      if (err) {
        console.error('Error closing log file');
        throw err;
      } else {
        res.send(body);
      }
    });
  });
});

module.exports = router;
