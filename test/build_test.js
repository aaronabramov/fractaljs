var build = require('../src/build.js'),
    config = require('../src/config.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('build.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures/build');
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#makeNodeList', function() {
        it('returns asset list', function(done) {
            build.makeNodeList('./index.js').then(function(list) {
                expect(list.length).to.equal(5);
                done();
            }).catch(done);
        });
    });
});
