var fs = require('fs')
    path = require('path')
    Q = require('q'),
    config = require('./config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports) {',
    FOOTER = '});';

function makeModuleName(filePath) {
    return path.relative(config.assetPath, filePath);
};

function compile(filePath) {
    var deferred = Q.defer();
    fs.readFile(filePath, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            var src = DEFINE + makeModuleName(filePath) + HEADER + data + FOOTER;
            deferred.resolve(src);
        }
    });
    return deferred.promise;
}

module.exports = {
    compile: compile,
    makeModuleName: makeModuleName
};
