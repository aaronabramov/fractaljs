var config = require('./config.js'),
    Q = require('q'),
    utils = require('./utils.js'),
    fs = require('fs'),
    glob = require('glob'),
    directives = require('./directives.js'),
    AssetNode = require('./asset_node.js');

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
 * @param filePath {String}
 * @param deferred {Q.deferred} optional default to Q.defer()
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

function recurMakeTree(filePath, data, deferred) {
    var extractedDirectives = directives.extract(data),
        filesToRequire = directives.extractFilesToRequire(extractedDirectives),
        branches = filesToRequire.map(function(path) {
            return makeTree(path);
        });

    Q.all(branches).then(function(assetNodes) {
        // Recursion base case. when there are no files to require it
        // resolves itself with `children: []` and tree starts to fill
        // itself from bottom to top.
        deferred.resolve(new AssetNode({
            path: filePath,
            content: data,
            children: assetNodes,
            directives: extractedDirectives
        }));
    }).fail(function(err) {
        deferred.reject(err);
    });
}

module.exports.makeTree = makeTree;
