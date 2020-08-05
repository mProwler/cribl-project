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