var path = require('path'),
    config = require('../config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports, module) {\n',
    FOOTER = '});';

module.exports = function(filePath, src) {
    checkName(filePath);
    return DEFINE + makeModuleName(filePath) + HEADER + src + FOOTER;
};

/**
 * @return {String} path to file relative to root config.assetPath
 */
function makeModuleName(filePath) {
    return path.relative(config.assetPath, filePath);
}

/**
 * make sure module name won't break resulting JS
 */
function checkName(moduleName) {
    if (/\"/.test(moduleName)) {
        throw new Error("module name can't contain \"");
    }
}
