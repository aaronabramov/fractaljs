var fs = require('fs')
    path = require('path')
    Q = require('q'),
    directives = require('./directives'),
    config = require('./config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports, module) {\n',
    FOOTER = '});';

function makeModuleName(filePath) {
    return path.relative(config.assetPath, filePath);
};

function makeModuleContent(name, src) {
    return DEFINE + name + HEADER + src + FOOTER;
};

/**
 * Recursively compile file, include all files that are stated in directives
 * example:
 *      //= require ./main_2.js
 *      //= require ./main_3.js
 *      var sameVar = someFunction();
 *      ... more code ...
 *
 * @param filePath {String} relative path to a file
 * @return {Q.Promise} when resolved passes compiled module into callback func
 */
function compile(filePath) {
    var deferred = Q.defer();
    filePath = path.resolve(config.assetPath, filePath);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            var filesToRequire = directives.extractDirectives(data.toString()),
                promises = filesToRequire.map(compile);
            Q.all(promises).then(function(sources) {
                var content = '\n// ' +
                    filePath +
                    '\n' +
                    makeModuleContent(makeModuleName(filePath), data) +
                    sources.join('\n\n');
                deferred.resolve(content);
            }).fail(function (err) {
                console.log(err);
            });
        }
    });
    return deferred.promise;
}

module.exports = {
    compile: compile,
    makeModuleName: makeModuleName
};
