var assetTree = require('../src/asset_tree.js'),
    config = require('../src/config.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('asset_tree.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures/asset_tree');
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#makeTree', function() {
        it('requires submodules', function(done) {
            try {
                assetTree.makeTree('./module1.js').then(function(assetNode) {
                    expect(config.LIB_PATH).to.be.a('string');
                    expect(assetNode.children.length).to.equal(2);
                    expect(assetNode.children[0].path).to.equal(config.LIB_PATH);
                    expect(assetNode.children[1].path).to.equal(path.resolve(config.assetPath, './module2.js'));
                    done();
                }).fail(function(err) {
                    done(err);
                });
            } catch (e) {
                done(e);
            }
        });
    });
});
