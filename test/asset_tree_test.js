var expect = require('chai').expect,
    AssetTree = require('../src/asset_tree.js'),
    AssetNode = require('../src/asset_node.js');

describe('asset_tree.js', function() {
    beforeEach(function() {
        this.subject = new AssetTree();
    });

    describe('constructor', function() {
        it('initializes flat structure', function() {
            this.subject.flat.should.be.an('object');
        });
    });

    describe('#setRoot', function() {
        it('sets root node', function() {
            var node = new AssetNode({
                path: './test.js',
                content: ''
            });
            this.subject.setRoot(node);
            expect(this.subject.root).to.an.instanceOf(AssetNode);
            this.subject.root.path.should.equal('./test.js');
        });
    });

    describe('#append', function() {
        it("sets root node if root is empty and append called without parentPath", function() {
            this.subject.append({path: './test.js', content: ''});
            Object.keys(this.subject.flat).length.should.equal(1);
            expect(this.subject.root).to.be.an.instanceof(AssetNode);
        });

        it("creates node and appends to it's parent looked up by path", function() {
            this.subject.append({path: './test.js', content: ''});
            this.subject.append({path: './sub.js', content: ''}, './test.js');
            Object.keys(this.subject.flat).length.should.equal(2);
            this.subject.root.children.length.should.equal(1);
        });
    });
});
