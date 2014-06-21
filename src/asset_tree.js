var config = require('./config.js'),
    Q = require('q'),
    utils = require('./utils.js'),
    fs = require('fs'),
    glob = require('glob'),
    Directives = require('./directives.js'),
    AssetNode = require('./asset_node.js');

/**
 * Walk through file system recursively and construct asset tree
 * from bottom to the top.
 * @param assetNode {AssetNode} only with path specified which is absolute
 * @return {Q.promise} resolves with {AssetNode} as an argument. @see #recurMakeTree
 */
function makeTree(assetNode) {
    // if path has extension, look for exact match, if not then try to match glob
    if (utils.extractFileType(assetNode.path)) {
        return getPath(assetNode);
    } else {
        return getGlob(assetNode);
    }
}

/**
 * Reads the file with given path. when finished, pass {Q.deferred}
 * into #recurMakeTree along with all the file data
 *
 * @param assetNode {assetNode}
 * @param [deferred] {Q.deferred} optional default to Q.defer()
 * @return {Q.promise}
 */
function getPath(assetNode, deferred) {
    deferred = (deferred || Q.defer());
    assetNode.fetchContent().then(function(content) {
        assetNode.content = content;
        recurMakeTree(assetNode, deferred);
    }).catch(function(e) { deferred.reject(e); });
    return deferred.promise;
}

/**
 * If given path doesn't match any file extensions known, try to
 * match it to any files in file system by globe and then call #getPath
 * with first matching name.
 *
 * @param assetNode {AssetNode}
 * @return {Q.promise}
 */
function getGlob(assetNode) {
    var pattern = assetNode.path + '.*',
        deferred = Q.defer();
    glob(pattern, {
        cwd: config.assetPath
    }, function(err, files) {
        if (err) return deferred.reject(err);
        if (!files.length) {
            return deferred.reject('no files found. path: ' + pattern);
        }
        assetNode.path = files[0];
        getPath(assetNode, deferred);
    });
    return deferred.promise;
}

/**
 * Based on file content, extract all the file paths that are requiref
 * within this file and recursivelly call #makeTree for every file.
 * when all of required files are resolved, construct {AssetNode} with given
 * file content, append children nodes and resolve given promise.
 *
 * @param assetNode {AssetNode}
 * @param deferred {Q.deferred}
 */
function recurMakeTree(assetNode, deferred) {
    var branches, filesToRequire;
    assetNode.directives = new Directives(assetNode);
    filesToRequire = assetNode.directives.filesToRequire();

    filesToRequire.then(function(list) {
        // Create branch for every sub file
        branches = list.map(function(subNode) {
            return makeTree(subNode); // Recur
        });
        Q.all(branches).then(function(assetNodes) {
            // Recursion base case. when there are no files to require it
            // resolves itself with `children: []` and tree starts to fill
            // itself from bottom to top.
            assetNode.children = assetNodes;
            deferred.resolve(assetNode);
        }).fail(function(err) {
            deferred.reject(err);
        });
    }).fail(function(err) {
        deferred.reject(err);
    });

}

module.exports.makeTree = makeTree;
