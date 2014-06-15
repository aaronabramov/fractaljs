var AssetNode = require('./asset_node.js');

function AssetTree() {
    this.flat = {};
    this.root = null;
}

/**
 * @param assenNode {AssetNode}
 * @return {AssetNode}
 */
AssetTree.prototype.setRoot = function(assetNode) {
    if (!assetNode) { throw new Error('assetNode is not defined'); }
    return (this.root = this.flat[assetNode.path] = assetNode);
};

/**
 * @return {AssetNode}
 */
AssetTree.prototype.append = function(options, parentPath) {
    var node = this.flat[options.path] || (this.flat[options.path] = new AssetNode(options));
    parentNode = this.flat[parentPath];
    if (!parentNode && !this.root) { return this.setRoot(node); }
    if (!parentNode) { throw new Error('parent node is not found'); }
    this.flat[parentPath].children.push(node);
    return node;
};

module.exports = AssetTree;
