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

function Directives(content) {
    this.list = extract(content);
}

Directives.prototype = {
    filesToRequire: function(root) {
        var deferred = Q.defer(),
            filesPaths = [];
        this.list.map(function(directive) {});
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
    _getDirectoryFiles: function(root, directive) {
        return directiveToFiles.getFiles(root, directive);
    },
    /**
     * Get all files from directory reculsively, including files in subdirectories
     */
    _getTreeFiles: function(root, directive) {
        return directiveToFiles.getFiles(root, directive);
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
