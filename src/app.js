var argv = require('minimist')(process.argv.slice(2)),
    config = require('./config.js'),
    server = require('./server');

config.configPath = argv.config;
config.assetPath = argv.path;
config.port = '6969';

server.start(config);
