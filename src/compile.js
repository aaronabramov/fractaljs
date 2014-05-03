var fs = require('fs')
    path = require('path')
    Q = require('q'),
    directives = require('./directives'),
    config = require('./config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports) {',
    FOOTER = '});';

function makeModuleName(filePath) {
    return path.relative(config.assetPath, filePath);
};

function makeModuleContent(name, src) {
    return DEFINE + name + HEADER + src + FOOTER;
};

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
                var content = '// ' +
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
