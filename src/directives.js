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
