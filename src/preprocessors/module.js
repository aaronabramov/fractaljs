var path = require('path'),
    config = require('../config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports, module, require) {\n',
    FOOTER = '});';

module.exports = function(assetNode) {
    var filePath = assetNode.relativePath();
    checkName(filePath);
    return DEFINE + makeModuleName(assetNode) + HEADER + assetNode.content + FOOTER;
};

/**
 * @return {String} path to file relative to root config.assetPath
 */
function makeModuleName(assetNode) {
    return assetNode.relativePath();
}

/**
 * make sure module name won't break resulting JS
 */
function checkName(moduleName) {
    if (/\"/.test(moduleName)) {
        throw new Error("module name can't contain \"");
    }
}
