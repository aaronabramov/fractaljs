/**
 * module is a container for multiple {Directive}s
 */
var config = require('./config.js'),
    Directive = require('./directive.js'),
    Q = require('q'),
    Promise = require('es6-promise').Promise,
    directiveToFiles = require('./directive_to_files.js'),
    build = require('./build.js'),
    path = require('path'),
    AVAILABLE_DIRECTIVE_TYPES = [
        'require_self',
        'require_lib',
        'require_tree',
        'require_directory',
        'require',
        'exclude',
        'reference'
    ],
    DIRECTIVE_PATTERN = new RegExp("\\/\\/\\s*=\\s*(" + AVAILABLE_DIRECTIVE_TYPES.join('|') + ")(.*)$", "gm");

/**
 * @param file {Object} {path: '', content: ''...}
 */
function Directives(file) {
    this.path = file.path;
    this.directives = this._extract(file.content);
}

Directives.prototype = {
    /**
     * @return {Q.promise} resolves with list of files to require
     */
    filesToRequire: function() {
        var _this = this,
            deferred = Q.defer(),
            filesPaths = [],
            promises = this.directives.map(function(directive) {
                return directive.filesToRequire();
            });
        Q.all(promises).then(function(fileLists) {
            var files = [];
            fileLists.forEach(function(list) {
                files = files.concat(list);
            });
            deferred.resolve(files);
        }).fail(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    /**
     * get asset lists for all referenced nodes (only for reference
     * directive) TODO: move it out and separate logic for diffrent
     * directives.
     * resolves with list of {AssetNode}s
     */
    getReferencedNodes: function() {
        var refs = this._getDirectivesByType('reference'),
            paths = [];
        refs.forEach(function(directive) {
            paths = paths.concat(directive.args);
        });
        paths = paths.map(function(filePath) {
            return path.resolve(config.assetPath, filePath);
        });
        var relativePaths = paths.map(function(filePath) {
            return path.relative(config.assetPath, filePath);
        });

        var promises = paths.map(function(filePath) {
            return build.makeNodeList(filePath);
        });

        return new Promise(function(resolve, reject) {
            Promise.all(promises).then(function(lists) {
                var map = {},
                    moduleList;
                // create a map relativePath -> list of assetNodes
                for (var i = 0, length = lists.length; i < length; i++) {
                    moduleList = lists[i].map(function(assetNode) {
                        return assetNode.relativePath();
                    });
                    map[relativePaths[i]] = moduleList;
                }
                resolve(map);
            }).catch(reject);
        });
    },
    /**
     * @param type {String}
     * return directives of given type
     */
    _getDirectivesByType: function(type) {
        return this.directives.filter(function(directive) {
            return directive.type === type;
        });
    },
    /**
     * @return {Array} array of {Directive}
     */
    _extract: function(content) {
        var match, fileNames = [],
            _this = this;
        while (match = DIRECTIVE_PATTERN.exec(content)) {
            var directive = match[1],
                args = match[2],
                result = [directive];
            args && (result = result.concat(args.trim().split(/\s+/)));
            result = new Directive(_this.path, result);
            fileNames.push(result);
        }
        return fileNames;
    }
};

module.exports = Directives;
