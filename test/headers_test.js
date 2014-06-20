var http = require('http'),
    path = require('path'),
    config = require('../src/config.js'),
    // server = require('../src/server.js'),
    expect = require('chai').expect;

xdescribe('headers', function() {
    before(function() {
        this.sandbox.stub(server, 'log');
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures');
        config.port = '6967';
        this.server = server.createServer();
        server.start(this.server);
    });

    after(function() {
        config.assetPath = this._assetPath;
        server.stop(this.server);
    });

    beforeEach(function() {
        this.requestOptions = {
            hostname: 'localhost',
            port: '6967',
            path: '/headers/index.js',
            headers: {}
        };
    });


    describe("when _Require-Mode header is not set", function() {
        it('returns joined file', function(done) {
            http.get(this.requestOptions, function(res) {
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    expect(JSON.parse(body)[0].path).to.contain('/headers/index.js');
                    expect(JSON.parse(body).length).to.equal(1);
                    done();
                });
            });
        });
    });

    describe('when _Require-Mode header is set to Debug', function() {
        it('returns files array', function(done) {
            expect(server.REQUIRE_MODE_HEADER).to.be.a('string');
            expect(server.REQUIRE_MODE_DEBUG_VALUE).to.be.a('string');
            this.requestOptions.headers[server.REQUIRE_MODE_HEADER] = server.REQUIRE_MODE_DEBUG_VALUE;
            http.get(this.requestOptions, function(res) {
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    expect(JSON.parse(body)[0].path).to.contain('/async_require.js');
                    expect(JSON.parse(body)[1].path).to.contain('/headers/module.js');
                    done();
                });
            });
        });
    });
});
