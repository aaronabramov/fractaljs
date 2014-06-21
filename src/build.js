var assetTree = require('./asset_tree.js'),
    AssetNode = require('./asset_node.js'),
    preprocessors = require('./preprocessors.js'),
    path = require('path'),
    config = require('./config.js'),
    Promise = require('es6-promise').Promise,
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
 * Gets flat list of {AssetNode}s
 * @param filePath {String}
 * @return {Promise} resolved with flattened asset tree
 */
function makeNodeList(filePath) {
    var assetNode = new AssetNode({path: filePath});
    return new Promise(function(resolve, reject) {
        assetTree.makeTree(assetNode).then(function(assetNode) {
            resolve(_flattenAssetTree(assetNode));
        }).fail(reject);
    });
}

/**
 * Fetch and compile single asset
 *
 * @param filePath {String}
 * @param wrap {Boolean} whether to wrap asset in module
 */
function makeSingleNode(filePath, wrap) {
    return new Promise(function(resolve, reject) {
        var assetNode = new AssetNode({
            path: filePath,
            wrap: wrap
        });
        assetNode.fetchContent().then(function(content) {
            assetNode.content = content;
            preprocessors.preprocess(assetNode);
            resolve(assetNode);
        }).catch(reject);
    });
}

/**
 * Flatten the node structure.
 * TODO: done this way because in future there will be directives like `exclude ./file/path.js`
 * and first, we'll need complete tree with files, their directives and content, and then
 * we'll cut off excluded branches.
 *
 * @param assetNode {AssetNode}
 * @param [_list] {Array} recursivelly pass and modify
 */
function _flattenAssetTree(assetNode, _list) {
    _list = (_list || []);
    _list.push(assetNode);
    assetNode.children.forEach(function(child) {
        _flattenAssetTree(child, _list);
    });
    return _list;
}

module.exports.makeNodeList = makeNodeList;
module.exports.makeSingleNode = makeSingleNode;
