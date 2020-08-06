const fs = require('fs');
const http = require('http');

const endpoint = 'http://localhost:8080/log/';

describe('The log endpoint', () => {
    it('should return 200 response code', (done) => {
        http.get(endpoint + 'small.log?num=1', (response) => {
            expect(response.statusCode).toEqual(200);
            done();
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    });

    it('should return 5 lines when requested', (done) => {
        http.get(endpoint + 'small.log?num=5', (response) => {
            let body = '';
            response.on('data', (data) => {
                body += data;
            });
            response.on('end', () => {
                expect(body.trim().split("\n").length).toEqual(5);
                done();
            });
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    });

    it('should return only lines containing filter value', (done) => {
        http.get(endpoint + 'small.log?filter=bash', (response) => {
            let body = '';
            response.on('data', (data) => {
                body += data;
            });
            response.on('end', () => {
                let lines = body.trim().split("\n");
                for (let line in lines) {
                    expect(lines[line]).toContain('bash');
                }
                done();
            });
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    });

    it('should return only 5 lines containing filter value', (done) => {
        http.get(endpoint + 'small.log?filter=version&num=5', (response) => {
            let body = '';
            response.on('data', (data) => {
                body += data;
            });
            response.on('end', () => {
                let lines = body.trim().split("\n");
                expect(lines.length).toEqual(5);
                for (let line in lines) {
                    expect(lines[line]).toContain('version');
                }
                done();
            });
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    });

    it('should return same size response as source file when unfiltered', (done) => {
        let stats = fs.statSync("test/small.log");
        let expectedSize = stats["size"];

        http.get(endpoint + 'small.log', (response) => {
            let actualSize = 0;

            response.on('data', (data) => {
                actualSize += data.length
            });
            response.on('end', () => {
                expect(actualSize).toEqual(expectedSize);
                done();
            });
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    });

    it('should process large log quickly', (done) => {
        let startTime = Date.now();
        http.get(endpoint + 'setup.log?filter=version', (response) => {
            let body = '';

            response.on('data', (data) => {
                body += data;
            });
            response.on('end', () => {
                let lines = body.trim().split("\n");
                let endTime = Date.now();
                let totalTime = Math.round((endTime - startTime) / 1000);
                console.debug('Took ' + totalTime + ' seconds to filter ' + lines.length + ' lines from log');
                expect(totalTime).toBeLessThan(10);
                done();
            });
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    }, 20000);

    it('should return error for non-existent log file', (done) => {
        http.get(endpoint + 'gibberish.log', (response) => {
            expect(response.statusCode).toEqual(500);
            done();
        }).on('error', (e) => {
            console.error('Error during request: ' + e.message);
            fail();
        });
    });

});