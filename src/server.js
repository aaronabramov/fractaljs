var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2)),
    ASYNC_REQUIRE_PATH = './assets/async_require.js',
    config = require('./config.js'),
    compile = require('./compile.js');

config.configPath = argv.config;
config.assetPath = argv.path;

if (!config.assetPath) throw new Error('path must be present');

http.createServer(function (req, res) {
    var filePath = path.normalize(config.assetPath + req.url),
        str = compile.compile(filePath);
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    res.end(str);
}).listen(6969);

console.log('Server is listening on 6969');
