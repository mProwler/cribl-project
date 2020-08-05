const app = require('../app');

let appInstance;

// Custom log path used during tests
const TEST_LOG_PATH = 'test/';

// Setup instance of app for testing
beforeEach(function (done) {
    appInstance = app.run(TEST_LOG_PATH, done);
});

// Tear down test instance
afterEach(function (done) {
    appInstance.close(done);
});
