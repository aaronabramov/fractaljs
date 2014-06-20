var argv = require('minimist')(process.argv.slice(2)),
    config = require('./config.js'),
    httpServer = require('./server/http.js');

config.configPath = argv.config;
config.assetPath = argv.path;
config.port = argv.port;

httpServer.start(httpServer.createServer());
