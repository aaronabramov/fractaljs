var config = require('./config.js'),
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
    this.list = extract(content);
}

Directives.prototype = {
    /**
     * @return {Q.promise} resolves with list of files to require
     */
    filesToRequire: function() {
        var _this = this,
            deferred = Q.defer(),
            filesPaths = [],
            promises = this.list.map(function(directive) {
                return directiveToFiles.getFiles(_this.path, directive);
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
    _getDirectivesByType: function(type) {
        return this.list.filter(function(directive) {
            return directive[0] === type;
        });
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

module.exports = Directives;
