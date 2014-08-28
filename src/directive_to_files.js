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
    Promise = require('es6-promise').Promise,
    walk = require('walk'),
    nodeResolve = require('resolve'),
    mdeps = require('module-deps'),
    JSONStream = require('JSONStream'),
    // list of directives that are convertible to files
    DIRECTIVES = {
        "require_tree": true,
        "require_directory": true,
        "require": true,
        "require_fractal": true,
        "require_self": true
    },
    // argument for recursively resolve node `require` deps
    DEPS_ARG = 'deps';

module.exports = {
    /**
     * @param root {String} path of the file that contains directive
     * @param directiveType {String} (require_tree, require_directory...)
     * @param args {Array} ['./tree', 'module']
     * @return {Promise} resolves with file list
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
        return new Promise(function(resolve, reject) {
            var files = [],
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
                resolve(files);
            });
        })
    },
    "require_directory": function(root, args) {
        if (!root) {
            throw new Error('root is required');
        }
        return new Promise(function(resolve, reject) {
            var files = [],
                directory = args[0];
            if (!directory) {
                throw new Error('require_directory path should be a directory');
            }
            directory = path.resolve(path.dirname(root), directory);
            fs.readdir(directory, function(err, filePaths) {
                if (err) {
                    return reject(err);
                }
                var promises = filePaths.map(function(filePath) {
                    return new Promise(function(resolve, reject) {
                        filePath = path.resolve(root, directory, filePath);
                        fs.stat(filePath, function(err, stats) {
                            if (err) {
                                reject(err);
                            }
                            resolve({
                                path: filePath,
                                isFile: stats.isFile()
                            });
                        });
                    });
                });
                Promise.all(promises).then(function(files) {
                    var list = [];
                    files.forEach(function(file) {
                        if (file.isFile) {
                            list.push(file.path);
                        }
                    });
                    resolve(list);
                }).catch(function(err) {
                    reject(err);
                });
            });
        });
    },
    "require": function(root, args) {
        // if `DEPS_ARG` argument is present then resolve dependency
        // tree of given node module and return the list of all required files
        if (!!~args.indexOf(DEPS_ARG)) {
            return new Promise(function(resolve, reject) {
                var paths = [];
                var dirname = path.dirname(root);
                console.log('args0', args[0]);
                nodeResolve(args[0], {basedir: dirname}, function(err, res) {
                    md = mdeps();
                    md.on('file', function(file) {
                        paths.push(file);
                        console.log(file);
                    });
                    md.on('end', function() {
                        console.log('done');
                        resolve(paths);
                    });
                    // no idea. some magic of this package. doesn't
                    // trigger `end` event unless data is listened to
                    md.on('data', function() {});
                    md.end({file: res});
                });
            });
        }
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
        return new Promise(function(resolve, reject) {
            resolve([config.LIB_PATH]);
        });
    },
    "require_self": function(root, args) {
        return new Promise(function(resolve, reject) {
            resolve([root]);
        });
    }
};
