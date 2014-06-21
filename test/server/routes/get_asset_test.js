var expect = require('chai').expect,
    httpServer = require('../../../src/server/http.js'),
    config = require('../../../src/config.js'),
    path = require('path'),
    http = require('http');

describe('server/routes/get_asset.js', function() {
    beforeEach(function() {
        this.sandbox.stub(httpServer, 'log');
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, '../../fixtures/server/routes/get_asset');
        config.port = '6967';
        this.server = httpServer.createServer();
        httpServer.start(this.server);
    });

    beforeEach(function() {
        this.requestOptions = {
            hostname: 'localhost',
            port: '6967',
            path: '/assets/file1.hamlc'
        };
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
        httpServer.stop(this.server);
    });

    it('responds with processed content of required asset', function(done) {
        http.get(this.requestOptions, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                expect(res.statusCode).to.equal(200);
                expect(body).to.contain('<span>test</span>');
                done();
            });
        });
    });
});
