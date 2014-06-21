var assetTree = require('../src/asset_tree.js'),
    AssetNode = require('../src/asset_node.js'),
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
            var assetNode = new AssetNode({path: './module1.js'});
            try {
                assetTree.makeTree(assetNode).then(function(assetNode) {
                    expect(config.LIB_PATH).to.be.a('string');
                    expect(assetNode.children.length).to.equal(3);
                    expect(assetNode.children[0].path).to.equal(config.LIB_PATH);
                    expect(assetNode.children[1].path).to.equal(path.resolve(config.assetPath, './file1.js'));
                    expect(assetNode.children[2].wrap).to.be.true;
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
