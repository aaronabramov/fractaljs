var fs = require('fs')
    path = require('path')
    Q = require('q'),
    directives = require('./directives'),
    config = require('./config.js'),
    DEFINE = 'define("',
    HEADER = '", function (exports, module) {\n',
    FOOTER = '});',
    LIB_PATH = path.resolve(__dirname, './assets/async_require.js');

function makeModuleName(filePath) {
    return path.relative(config.assetPath, filePath);
};

function makeModuleContent(name, src) {
    return DEFINE + name + HEADER + src + FOOTER;
};

/**
 * @param filePath {String} path to the root file
 * @param data {String} it's source code
 * @param wrap {Boolean} if true, wrap root file in a module
 * @param sources {Array} descendant files to append to root file
 */
function joinSources(filePath, data, wrap, sources) {
    var content = '\n// ' +
        filePath +
        '\n';
    if (wrap) {
        content += makeModuleContent(makeModuleName(filePath), data);
    } else { content += data }
    return content + '\n' + sources.join('\n\n');
}

/**
 * Recursively compile file, include all files that are stated in directives
 * example:
 *      //= require_lib
 *      //= require ./main_2.js
 *      //= require ./main_3.js
 *      var sameVar = someFunction();
 *      ... more code ...
 *
 * @param filePath {String} relative path to a file
 * @param wrap {Boolean} if this file needs to be wrapped in a module
 * @return {Q.Promise} when resolved passes compiled module into callback func
 */
function compile(filePath, wrap) {
    typeof wrap === 'undefined' && (wrap = true);
    var deferred = Q.defer();
    filePath = path.resolve(config.assetPath, filePath);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            var directivesList = directives.extract(data.toString()),
                filesToRequire = processDirectives(directivesList),
                promises = filesToRequire.map(function (file) {
                    return compile(file.path, file.wrap);
                });
            Q.all(promises).then(function(sources) {
                var d = joinSources(filePath, data, wrap, sources);
                deferred.resolve(d)
            }).fail(function (err) {
                console.log(err);
            });
        }
    });
    return deferred.promise;
}

/**
 * @param directives {Array} [['require', 'main.js'], ['require_lib']]
 * @return {Array} of objects [{wrap: true, path: './path.js'}]
 */
function processDirectives(directives) {
    var filePaths = [];
    directives.forEach(function (d) {
        filePaths = filePaths.concat(directiveToFiles(d));
    });
    return filePaths;
}

/**
 * Extract filenames that need to be required from directive
 * @param d {Array} [directiveType, directiveValue]
 * @return {Array} of objects:
 *      @return wrap {Boolean} if this file needs to be wrapped in module
 *      @return path {String} path to the file
 */
function directiveToFiles(d) {
    var type = d[0];
    switch (d[0]) {
        case 'require': return [{wrap: true, path: d[1]}];
        case 'require_lib': return [{wrap: false, path: LIB_PATH}];
    }
}

module.exports = {
    compile: compile,
    makeModuleName: makeModuleName
};
