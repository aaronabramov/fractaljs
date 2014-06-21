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

    describe('#makeSingleNode', function() {
        it('makes and compiles single node', function(done) {
            build.makeSingleNode('./module1.hamlc').then(function(assetNode) {
                expect(assetNode.relativePath()).to.equal('module1.hamlc');
                expect(assetNode.content).to.contain('</h1>');
                done();
            }).catch(done);
        });
    });
});
