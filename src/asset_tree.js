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
 * @param file {Object} {path: './path.js'[, wrap: [true,false]]}
 * @return {Q.promise} resolves with {AssetNode} as an argument. @see #recurMakeTree
 */
function makeTree(file) {
    file.path = utils.resolveAssetPath(file.path);
    // if path has extension, look for exact match, if not then try to match glob
    if (utils.extractFileType(file.path)) {
        return getPath(file);
    } else {
        return getGlob(file);
    }
}

/**
 * Reads the file with given path. when finished, pass {Q.deferred}
 * into #recurMakeTree along with all the file data
 *
 * @param file {Object} {path: './path.js'[, wrap: [true,false]]}
 * @param [deferred] {Q.deferred} optional default to Q.defer()
 * @return {Q.promise}
 */
function getPath(file, deferred) {
    deferred = (deferred || Q.defer());
    fs.readFile(file.path, function(err, content) {
        if (err) {
            deferred.reject(err);
        } else {
            file.content = content.toString();
            recurMakeTree(file, deferred);
        }
    });
    return deferred.promise;
}

/**
 * If given path doesn't match any file extensions known, try to
 * match it to any files in file system by globe and then call #getPath
 * with first matching name.
 *
 * @param file {Object} {path: './path.js'[, wrap: [true,false]]}
 * @return {Q.promise}
 */
function getGlob(file) {
    var pattern = file.path + '.*',
        deferred = Q.defer();
    glob(pattern, {
        cwd: config.assetPath
    }, function(err, files) {
        if (err) return deferred.reject(err);
        if (!files.length) {
            return deferred.reject('no files found. path: ' + pattern);
        }
        file.path = files[0];
        getPath(file, deferred);
    });
    return deferred.promise;
}

/**
 * Based on file content, extract all the file paths that are requiref
 * within this file and recursivelly call #makeTree for every file.
 * when all of required files are resolved, construct {AssetNode} with given
 * file content, append children nodes and resolve given promise.
 *
 * @param file {Object} {path: './path.js'[, wrap: [true,false], content: '']}
 * @param deferred {Q.deferred}
 */
function recurMakeTree(file, deferred) {
    var branches,
        directives = new Directives(file),
        filesToRequire = directives.filesToRequire();

    filesToRequire.then(function(list) {
        // Create branch for every sub file
        branches = list.map(function(file) {
            return makeTree(file); // Recur
        });
        Q.all(branches).then(function(assetNodes) {
            // Recursion base case. when there are no files to require it
            // resolves itself with `children: []` and tree starts to fill
            // itself from bottom to top.
            deferred.resolve(new AssetNode({
                path: file.path,
                wrap: file.wrap,
                content: file.content.toString(),
                children: assetNodes,
                directives: directives
            }));
        }).fail(function(err) {
            deferred.reject(err);
        });
    }).fail(function(err) {
        deferred.reject(err);
    });

}

module.exports.makeTree = makeTree;
