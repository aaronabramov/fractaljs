var build = require('../src/build.js'),
    config = require('../src/config.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('build.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures');
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#makeTree', function() {
        it('requires submodules', function(done) {
            build.makeTree('./module1.js').then(function(assetNode) {
                try {
                    expect(config.LIB_PATH).to.be.a('string');
                    expect(assetNode.children.length).to.equal(2);
                    expect(assetNode.children[0].path).to.equal(config.LIB_PATH);
                    expect(assetNode.children[1].path).to.equal(path.resolve(config.assetPath, './module2.js'));
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
