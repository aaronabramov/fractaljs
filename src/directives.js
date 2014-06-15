var config = require('./config.js'),
    walk = require('walk'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    walk = require('walk'),
    AVAILABLE_DIRECTIVE_TYPES = [
        'require_self',
        'require_lib',
        'require_tree',
        'require_directory',
        'require',
        'exclude'
    ],
    DIRECTIVE_PATTERN = new RegExp("\\/\\/\\s*=\\s*(" + AVAILABLE_DIRECTIVE_TYPES.join('|') + ")(.*)$", "gm");

function Directives(content) {
    this.list = extract(content);
}

Directives.prototype = {
    filesToRequire: function() {
        var deferred = Q.defer(),
            filesPaths = [];
    },
    _getDirectivesByType: function(type) {
        return this.list.filter(function(directive) {
            return directive[0] === type;
        });
    },
    /**
     * Get files from directory. This is a shallow require. files from
     * subdirectories will not be required
     */
    _getDirectoryFiles: function(directive) {
        var deferred = Q.defer(),
            files = [],
            directory = directive[1];
        if (!directory) {
            throw new Error('require_directory path should be a directory');
        }
        directory = path.resolve(config.assetPath, directory);
        fs.readdir(directory, function(err, filePaths) {
            var promises = filePaths.map(function(filePath) {
                var deferred = Q.defer();
                filePath = path.resolve(config.assetPath, directory, filePath);
                fs.stat(filePath, function(err, stats) {
                    if (err) { deferred.reject(err); }
                    deferred.resolve({path: filePath, isFile: stats.isFile()});
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
    /**
     * Get all files from directory reculsively, including files in subdirectories
     */
    _getTreeFiles: function(directive) {
        var deferred = Q.defer(),
            files = [],
            directory = directive[1],
            walker;
        if (!directory) {
            throw new Error('require_directory path should be a directory');
        }
        directory = path.resolve(config.assetPath, directory);
        walker = walk.walk(directory);
        walker.on('file', function(root, fileStats, next) {
            files.push(root + '/' + fileStats.name);
            next();
        });
        walker.on('end', function() {
            deferred.resolve(files);
        });
        return deferred.promise;
    }
};

/**
 * @return {Array} array of directives and their values
 */
function extract(content) {
    var match, fileNames = [];
    while (match = DIRECTIVE_PATTERN.exec(content)) {
        var directive = match[1],
            args = match[2],
            result = [directive];
        args && (result = result.concat(args.trim().split(/\s+/)));
        fileNames.push(result);
    }
    return fileNames;
}


/**
 * @param directives {Array} [['require', 'main.js'], ['require_lib']]
 * @return {Array} of objects [{wrap: true, path: './path.js'}]
 */
function extractFilesToRequire(directives) {
    var filePaths = [];
    directives.forEach(function(d) {
        filePaths = filePaths.concat(directiveToFiles(d));
    });
    return filePaths;
}

/**
 * Extract filenames that need to be required from directive
 * @param d {Array} [directiveType, directiveValue]
 * @return {Array} of paths
 */
function directiveToFiles(d) {
    var type = d[0];
    switch (d[0]) {
        case 'require':
            return [d[1]];
        case 'require_lib':
            return [config.LIB_PATH];
        default:
            return [];
    }
}

module.exports = Directives;
