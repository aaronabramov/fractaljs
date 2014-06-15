var config = require('./config.js'),
    Q = require('q'),
    utils = require('./utils.js'),
    fs = require('fs'),
    glob = require('glob'),
    directives = require('./directives.js'),
    AssetNode = require('./asset_node.js');

/**
 * Walk through file system recursively and construct asset tree
 * from bottom to the top.
 * @param filePath {String} path of the root file
 * @return {Q.promise} resolves with {AssetNode} as an argument. @see #recurMakeTree
 */
function makeTree(filePath) {
    filePath = utils.resolveAssetPath(filePath);
    // if path has extension, look for exact match, if not then try to match glob
    if (utils.extractFileType(filePath)) {
        return getPath(filePath);
    } else {
        return getGlob(filePath);
    }
}

/**
 * Reads the file with given path. when finished, pass {Q.deferred}
 * into #recurMakeTree along with all the file data
 *
 * @param filePath {String}
 * @param [deferred] {Q.deferred} optional default to Q.defer()
 * @return {Q.promise}
 */
function getPath(filePath, deferred) {
    deferred = (deferred || Q.defer());
    fs.readFile(filePath, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            recurMakeTree(filePath, data, deferred);
        }
    });
    return deferred.promise;
}

/**
 * If given path doesn't match any file extensions known, try to
 * match it to any files in file system by globe and then call #getPath
 * with first matching name.
 *
 * @param filePath {String} path
 * @return {Q.promise}
 */
function getGlob(filePath) {
    var pattern = filePath + '.*';
    glob(pattern, {
        cwd: config.assetPath
    }, function(err, files) {
        if (err) return deferred.reject(err);
        if (!files.length) {
            return deferred.reject('no files found. path: ' + pattern);
        }
        getPath(files[0], deferred);
    });
    return deferred.promise;
}

/**
 * Based on file content, extract all the file paths that are requiref
 * within this file and recursivelly call #makeTree for every file.
 * when all of required files are resolved, construct {AssetNode} with given
 * file data, append children nodes and resolve given promise.
 *
 * @param filePath {String} current file path
 * @param data {String} file content
 * @param deferred {Q.deferred}
 */
function recurMakeTree(filePath, data, deferred) {
    var extractedDirectives = directives.extract(data),
        filesToRequire = directives.extractFilesToRequire(extractedDirectives),
        // Create branch for every sub file
        branches = filesToRequire.map(function(path) {
            return makeTree(path); // Recur
        });

    Q.all(branches).then(function(assetNodes) {
        // Recursion base case. when there are no files to require it
        // resolves itself with `children: []` and tree starts to fill
        // itself from bottom to top.
        deferred.resolve(new AssetNode({
            path: filePath,
            content: data.toString(),
            children: assetNodes,
            directives: extractedDirectives
        }));
    }).fail(function(err) {
        deferred.reject(err);
    });
}

module.exports.makeTree = makeTree;
