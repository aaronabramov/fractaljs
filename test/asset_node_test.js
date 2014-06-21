var AssetNode = require('../src/asset_node.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('asset_node.js', function() {
    describe('#fetchContent', function() {
        beforeEach(function() {
            this.filePath = path.resolve(__dirname, './fixtures/asset_node/file.coffee');
            this.node = new AssetNode({
                path: this.filePath
            });
        });

        it('fetches file content', function(done) {
            this.node.fetchContent().then(function(content) {
                expect(content).to.equal('content\n');
                done();
            }).catch(done);
        });

        it('does not modify it\'s state', function(done) {
            var _this = this;
            this.node.fetchContent().then(function(content) {
                expect(content).to.equal('content\n');
                expect(_this.node.content).to.not.equal('content\n');
                done();
            }).catch(done);
        });
    });
});
