var config = require('./config.js'),
    HEADER_PATTERN = /\/\/\s*=\s*(require\w*)\s*([\w\.\/]*)\s*$/gm;

/**
 * @return {Array} array of directives and their values
 */
function extract(src) {
    var match, fileNames = [];
    while (match = HEADER_PATTERN.exec(src)) {
        var directive = match[1],
            value = match[2],
            result = [directive];
        value && result.push(value);
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

module.exports.extract = extract;
module.exports.extractFilesToRequire = extractFilesToRequire;
