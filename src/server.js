var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2)),
    configPath = argv.config,
    assetPath = argv.path,
    ASYNC_REQUIRE_PATH = './assets/async_require.js';

if (!configPath || !assetPath) throw new Error('config and path must be present');

var config = require(configPath);

/**
 * @param packageName {String} name of the package, will be looked up in
 *      `config` map
 * @return {String} string containing concatenated source code of all files
 *      included in the pcakage
 */
function compilePackage(packageName) {
    var srcs = config[packageName].map(function (fileName) {
        return fs.readFileSync(
            path.resolve(assetPath, fileName),
            {encoding: 'UTF-8'});
    });
    return srcs.join("\n");
}


/**
 * @return {String} concatenated javascript for main package including
 *      lib files and whatever was specified in config.main
 */
function compileMainPackage() {
    var src, asyncRequireSrc;
    asyncRequireSrc = fs.readFileSync(ASYNC_REQUIRE_PATH, {encoding: 'UTF-8'});
    srcs = compilePackage('main');
    return asyncRequireSrc + "\n" + srcs;
}

http.createServer(function (req, res) {
    var url = req.url;
    url = url.replace(/\.js/, '').replace(/^\//, '');
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    res.end(compileMainPackage());
}).listen(6969);

console.log('Server is listening on 6969');
