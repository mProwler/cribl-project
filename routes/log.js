const express = require('express');
const router = express.Router();
const fs = require('fs');

const LOG_BASE = '/var/log';

/**
 * Determine line break to use from source string
 * @param source
 * @returns {string|null} returns null if no line break can be reliably detected
 */
function getLineBreak(source) {
  let newlineIndex = source.indexOf("\n");
  if (newlineIndex === -1) {
    if (source.indexOf("\r") !== -1) return "\r";
  } else {
    if (source[newlineIndex - 1] === "\r") return "\r\n";
    if (newlineIndex > 0 && source[newlineIndex - 1].match(/[^\r\n]/)) return "\n";
  }
  return null;
}

/* GET contents of log file */
router.get('/:log', function(req, res, next) {
  let body = '';
  let lineCount = 0;

  // Get argument values
  let filter = req.query.filter || '';
  let lines = req.query.num || false;
  let log = req.params.log;

  // Check required argument
  if (!log) {
    next(new Error('Missing required param "log"'));
  }

  // Get log path and filename of requested log
  let logPath = req.app.get('LOG_PATH') || LOG_BASE;
  let filename = logPath + '/' + log;

  // Open log file
  fs.open(filename, 'r', function(err, fd) {
    let data = '';
    let done = false;
    let endOfFile = false;
    let line = '';
    let lineBreak = null;

    // Handle error opening file
    if (err) {
      console.error('Error opening specified log file.');
      next(err);
      return;
    }

    // Get file size
    let stats = fs.statSync(filename);
    let pos = stats["size"];

    // Allocate buffer instance
    let bufferSize = 1024;
    let buffer = Buffer.allocUnsafe(bufferSize).fill(0);

    // Iterate through log file in reverse
    do {
      // Read next chunk into buffer
      let readOpts = {
        position: Math.max(0, pos - bufferSize),
        length: Math.min(bufferSize, pos)
      };
      let byteCount = fs.readSync(fd, buffer, readOpts);

      // Update file position and check for EOF
      pos = readOpts.position;
      endOfFile = (pos <= 0);

      // Add buffer contents to remaining data in data variable
      data = buffer.slice(0, byteCount).toString() + data;

      // Look for line breaks and filter/extract line(s)
      while (!done && (endOfFile || data.indexOf(lineBreak || "\n") !== -1)) {
        // Determine line breaks, if needed
        if (lineBreak === null) {
          lineBreak = getLineBreak(data);
          // Keep reading from buffer until we get a line break, unless this is the end of the source data
          if (lineBreak === null && !endOfFile) break;
        }

        // Check for and handle line breaks
        let chrLineBreak = lineBreak || "\n";
        let lastLineBreakIndex = data.lastIndexOf(chrLineBreak);
        if (lastLineBreakIndex !== -1) {
          // Line break found, get next line from data value
          line = data.slice(lastLineBreakIndex + 1);
          data = data.slice(0, lastLineBreakIndex);
        } else if (endOfFile) {
          // EOF, get remaining characters from data
          line = data;
          data = '';
          done = true;
        }

        // Check for filter string (if specified)
        if (filter && line.indexOf(filter) === -1) {
          continue;
        }

        // Check for empty line, don't include it if it's our first
        if (line || lineCount > 0) {
          // Append line to body
          body = body + line + chrLineBreak;
          lineCount++;

          // Check if we've reached our desired line count
          if (lines && lineCount >= lines) {
            done = true;
          }
        }
      }
    } while (!done && !endOfFile);

    // Close file handle
    fs.close(fd, function (err) {
      if (err) {
        console.error('Error closing log file');
        next(err);
      } else {
        // Send response body
        res.send(body);
      }
    });
  });
});

module.exports = router;
