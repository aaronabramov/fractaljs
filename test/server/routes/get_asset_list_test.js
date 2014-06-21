var expect = require('chai').expect,
    httpServer = require('../../../src/server/http.js'),
    config = require('../../../src/config.js'),
    path = require('path'),
    http = require('http');

describe('server/routes/get_asset_list.js', function() {
    beforeEach(function() {
        this.sandbox.stub(httpServer, 'log');
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, '../../fixtures/server/routes/get_asset_list');
        config.port = '6967';
        this.server = httpServer.createServer();
        httpServer.start(this.server);
    });

    beforeEach(function() {
        this.requestOptions = {
            hostname: 'localhost',
            port: '6967',
            path: '/get_asset_list/app.js'
        };
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
        httpServer.stop(this.server);
    });

    it('responds with list of files to require', function(done) {
        http.get(this.requestOptions, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                var json = JSON.parse(body);
                expect(json[0].path).to.equal('app.js');
                expect(json[1].path).to.equal('tree/tree.js');
                expect(json[1].wrap).to.be.true;
                expect(json[2].path).to.equal('file_2.hamlc');
                done();
            });
        });
    });
});
