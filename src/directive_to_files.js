var config = require('./config.js'),
    walk = require('walk'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    walk = require('walk');

module.exports = {
    /**
     * @param root {String} path of the file that contains directive
     */
    getFiles: function(root, directive) {
        var directiveType = directive[0];
        return this[directiveType](root, directive);
    },
    "require_tree": function(root, directive) {
        var deferred = Q.defer(),
            files = [],
            directory = directive[1],
            walker;
        if (!directory) {
            throw new Error('require_directory path should be a directory');
        }
        directory = path.resolve(path.dirname(root), directory);
        walker = walk.walk(directory);
        walker.on('file', function(root, fileStats, next) {
            files.push(root + '/' + fileStats.name);
            next();
        });
        walker.on('end', function() {
            deferred.resolve(files);
        });
        return deferred.promise;
    },
    "require_directory": function(root, directive) {
        var deferred = Q.defer(),
            files = [],
            directory = directive[1];
        if (!directory) {
            throw new Error('require_directory path should be a directory');
        }
        directory = path.resolve(path.dirname(root), directory);
        fs.readdir(directory, function(err, filePaths) {
            if (err) { return deferred.reject(err); }
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
    }
};
