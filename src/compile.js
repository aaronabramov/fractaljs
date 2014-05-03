var fs = require('fs')
    path = require('path'),
    config = require('./config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports) {',
    FOOTER = '});';

function makeModuleName(filePath) {
    return path.relative(config.assetPath, filePath);
};

function compile(filePath) {
    var src = fs.readFileSync(filePath, {encoding: 'UTF-8'});
    return DEFINE + makeModuleName(filePath) + HEADER + src + FOOTER;
}

module.exports = {
    compile: compile,
    makeModuleName: makeModuleName
};
