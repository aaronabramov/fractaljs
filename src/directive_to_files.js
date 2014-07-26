/**
 * This module is responsible solely for exctracting list of files
 * that need to be require from directives that are extracted from
 * source code.
 *
 * it has one API method `#getFiles` which takes current file path
 * and directive and it sould return promise that resolves with
 * list of files.
 *
 */
var config = require('./config.js'),
    walk = require('walk'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    Promise = require('es6-promise').Promise,
    walk = require('walk'),
    nodeResolve = require('resolve'),
    // list of directives that are convertible to files
    DIRECTIVES = {
        "require_tree": true,
        "require_directory": true,
        "require": true,
        "require_fractal": true,
        "require_self": true
    };

module.exports = {
    /**
     * @param root {String} path of the file that contains directive
     * @param directiveType {String} (require_tree, require_directory...)
     * @param args {Array} ['./tree', 'module']
     * @return {Q.promise} resolves with file list
     */
    getFiles: function(root, directiveType, args) {
        // try to convert to file list. if not convertible then skip
        if (DIRECTIVES[directiveType]) {
            return this[directiveType](root, args);
        } else {
            return Promise.resolve([]);
        }
    },
    "require_tree": function(root, args) {
        if (!root) {
            throw new Error('root is required');
        }
        var deferred = Q.defer(),
            files = [],
            directory = args[0],
            walker;
        if (!directory) {
            throw new Error('require_directory path should be a directory');
        }
        directory = path.resolve(path.dirname(root), directory);
        walker = walk.walk(directory);
        walker.on('file', function(root, fileStats, next) {
            var fileName = path.resolve(config.assetPath, root + '/' + fileStats.name);
            files.push(fileName);
            next();
        });
        walker.on('end', function() {
            deferred.resolve(files);
        });
        return deferred.promise;
    },
    "require_directory": function(root, args) {
        if (!root) {
            throw new Error('root is required');
        }
        var deferred = Q.defer(),
            files = [],
            directory = args[0];
        if (!directory) {
            throw new Error('require_directory path should be a directory');
        }
        directory = path.resolve(path.dirname(root), directory);
        fs.readdir(directory, function(err, filePaths) {
            if (err) {
                return deferred.reject(err);
            }
            var promises = filePaths.map(function(filePath) {
                var deferred = Q.defer();
                filePath = path.resolve(root, directory, filePath);
                fs.stat(filePath, function(err, stats) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve({
                        path: filePath,
                        isFile: stats.isFile()
                    });
                });
                return deferred.promise;
            });
            Q.all(promises).then(function(files) {
                var list = [];
                files.forEach(function(file) {
                    if (file.isFile) {
                        list.push(file.path);
                    }
                });
                deferred.resolve(list);
            }).fail(function(err) {
                deferred.reject(err);
            });
        });
        return deferred.promise;
    },
    "require": function(root, args) {
        return new Promise(function(resolve, reject) {
            var rootDirname = path.dirname(root);
            nodeResolve(args[0], {basedir: rootDirname}, function(err, res) {
                if (err) {
                    return reject(err);
                }
                resolve([res]);
            });
        });
    },
    "require_fractal": function() {
        var d = Q.defer();
        d.resolve([config.LIB_PATH]);
        return d.promise;
    },
    "require_self": function(root, args) {
        return new Promise(function(resolve, reject) {
            resolve([root]);
        });
    }
};
