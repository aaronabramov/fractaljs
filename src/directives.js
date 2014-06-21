/**
 * module is a container for multiple {Directive}s
 */
var config = require('./config.js'),
    Directive = require('./directive.js'),
    Q = require('q'),
    directiveToFiles = require('./directive_to_files.js'),
    AVAILABLE_DIRECTIVE_TYPES = [
        'require_self',
        'require_lib',
        'require_tree',
        'require_directory',
        'require',
        'exclude'
    ],
    DIRECTIVE_PATTERN = new RegExp("\\/\\/\\s*=\\s*(" + AVAILABLE_DIRECTIVE_TYPES.join('|') + ")(.*)$", "gm");

function Directives(path, content) {
    this.path = path;
    this.directives = this._extract(content);
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
        var match, fileNames = [], _this = this;
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
