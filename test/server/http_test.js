var http = require('../../src/server/http.js'),
    config = require('../../src/config.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('server/http.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures/asset_tree');
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#createServer', function() {
        it('creates instance of http server', function() {
            expect(http.createServer()).to.be.an('Object');
        });
    });
});
