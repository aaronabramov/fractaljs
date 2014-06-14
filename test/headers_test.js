var http = require('http'),
    path = require('path'),
    config = require('../src/config.js'),
    server = require('../src/server.js'),
    expect = require('chai').expect;

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

    beforeEach(function () {
        this.requestOptions = {
            hostname: 'localhost',
            port: '6967',
            path:'/headers/index.js'
        }
    });


    describe("when _Require-Mode header is not set", function () {
        it('returns joined file', function (done) {
            http.get(this.requestOptions, function (res) {
                var body = '';
                res.on('data', function (chunk) { body += chunk; });
                res.on('end', function() {
                    expect(JSON.parse(body)[0].path).to.contain('/headers/index.js');
                    expect(JSON.parse(body)[1]).to.be.an('undefined');
                    done();
                });
            });
        });
    });

    describe('when _Require-Mode header is set to Debug', function () {
        it('returns files array', function (done) {
            this.requestOptions.headers = {'_Require-Mode': 'Debug'}
            http.get(this.requestOptions, function (res) {
                var body = '';
                res.on('data', function (chunk) { body += chunk; })
                res.on('end', function() {
                  expect(JSON.parse(body)[0].path).to.contain('/async_require.js');
                  expect(JSON.parse(body)[1].path).to.contain('/headers/module.js');
                  done();
                });
            });
        });
    });
});
