var http = require('http'),
    path = require('path'),
    config = require('../src/config.js'),
    server = require('../src/server.js');

describe('headers', function () {
    before(function () {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures');
        config.port = '6967';
        server.start(config);
    });

    after(function () {
        config.assetPath = this._assetPath;
    });

    describe("when RequireMode header doesn't set", function () {
        it('returns default', function (done) {
            try {
                http.get({hostname:'localhost', port:config.port, path:'/module1.js'}, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        chunk.should.equal('default\n')
                    })
                    done();
                });
            } catch (e) { done(e); }
        });
    });

    describe('when RequireMode header set to debug', function () {
        it('returns debug', function (done) {
            try {
                http.get({hostname:'localhost', port:config.port, path:'/module1.js', headers: { RequireMode: 'debug'}}, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        chunk.should.equal('debug\n')
                    })
                    done();
                });
            } catch (e) { done(e); }
        });
    });
});
