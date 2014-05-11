var fs = require('fs')
    path = require('path')
    Q = require('q'),
    directives = require('./directives'),
    config = require('./config.js'),
    glob = require('glob'),
    DEFINE = 'define("',
    HEADER = '", function (exports, module) {\n',
    FOOTER = '});',
    LIB_PATH = path.resolve(__dirname, './assets/async_require.js'),
    NOT_FOUND_ERRNO = 34,
    EXTENSION_TO_FILETYPE_MAP = {
        'js':       'js',
        'hamlc':    'hamlc'
    };

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

function extractFileType(filePath) {
    var filename =  path.basename(filePath),
        extension = filename.match(/\.(\w+)$/);
    extension = extension && extension[1];
    return EXTENSION_TO_FILETYPE_MAP[extension];
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
    filePath = path.resolve(config.assetPath, filePath);
    if (extractFileType(filePath)) {
        return compilePath(filePath, wrap)
    } else {
        return compileGlob(filePath, wrap);
    }
}

/**
 * compiles file from path. Path should exactly match the file
 * @param filePath {String}
 * @param wrap {Boolean} whether file needs to be wrapped in module
 * @param [deferred] {deferred} optional deferred object
 */
function compilePath(filePath, wrap, deferred) {
    deferred || (deferred = Q.defer());
    fs.readFile(filePath, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            recurCompile(filePath, data, wrap, deferred);
        }
    });
    return deferred.promise;
}

/**
 * comiles file from globe pattern. pattern can omit extension, first match
 * will be compiled
 * @param filePath {String} file path [without extension]
 * @param wrap {Boolean} whether file needs to be wrapped in module
 */
function compileGlob(filePath, wrap) {
    var deferred = Q.defer(),
        pattern = filePath + '.*';
    glob(pattern, {cwd: config.assetPath}, function (err, files) {
        console.log(files);
        if (err) return deferred.reject(err);
        if (!files.length) { return deferred.reject('no files found. path: ' + pattern); }
        compilePath(files[0], wrap, deferred);
    });
    return deferred.promise;
}

/**
 * @param filePath {String} file path. used to make module wrapper
 * @param data {String} file source
 * @param wrap {Boolean} whether to wrap file in module
 * @param deferred {deferred} deferred object, which has to be resolved if
 *      all descendant promises are resolved recurlively.
 */
function recurCompile(filePath, data, wrap, deferred) {
    Q.all(compileSubfiles(data)).then(function(sources) {
        deferred.resolve(joinSources(filePath, data, wrap, sources));
    }).fail(function (err) {
        deferred.reject(err);
    });
}

/**
 * @return {Array} of compile promises
 */
function compileSubfiles(src) {
    var directivesList = directives.extract(src),
        filesToRequire = directives.processDirectives(directivesList);
    return filesToRequire.map(function (file) {
        return compile(file.path, file.wrap);
    });
}

module.exports = {
    compile: compile,
    makeModuleName: makeModuleName
};
