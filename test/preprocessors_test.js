var AssetNode = require('../src/asset_node.js'),
    preprocessors = require('../src/preprocessors.js'),
    config = require('../src/config.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('preprocessors.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures');
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#preprocess', function() {
        it('wraps file in module if assetNode.wrap == true', function() {
            var assetNode = new AssetNode({
                path: './path.js',
                wrap: true,
                content: 'test'
            });
            preprocessors.preprocess(assetNode);
            expect(assetNode.content).to.contain('define');
        });

        it('does not wrap file in module if assetNode.wrap !== true', function() {
            var assetNode = new AssetNode({
                path: './path.js',
                content: 'test'
            });
            preprocessors.preprocess(assetNode);
            expect(assetNode.content).to.not.contain('define');
        });
    });
});
