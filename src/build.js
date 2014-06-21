var assetTree = require('./asset_tree.js'),
    AssetNode = require('./asset_node.js'),
    preprocessors = require('./preprocessors.js'),
    path = require('path'),
    config = require('./config.js'),
    Q = require('q');

function build(filePath) {
    var deferred = Q.defer(),
        assetNode = new AssetNode({path: filePath});
    assetTree.makeTree(assetNode).then(function(assetNode) {
        var list = makeAssetList(assetNode);
        list.forEach(preprocessors.preprocess);
        deferred.resolve(list.map(function(node) {
            return {
                path: path.relative(config.assetPath, node.path),
                content: node.content,
                wrap: node.wrap
            };
        }));
    }).fail(function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * Flatten the node structure.
 * TODO: done this way because in future there will be directives like `exclude ./file/path.js`
 * and first, we'll need complete tree with files, their directives and content, and then
 * we'll cut off excluded branches.
 *
 * @param assetNode {AssetNode} root node with subnodes returned by
 * assetTree#makeTree()
 * @return {Array} of {AssetNode} objects
 */
function makeAssetList(assetNode, list) {
    list = (list || []);
    list.push(assetNode);
    assetNode.children.forEach(function(child) {
        makeAssetList(child, list);
    });
    return list;
}

module.exports.build = build;
