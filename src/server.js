var http = require('http'),
    argv = require('minimist')(process.argv.slice(2)),
    config = require('./config.js'),
    compile = require('./compile.js');

function start(config) {

    if (!config.assetPath) throw new Error('path must be present');
    if (!config.port) throw new Error('port must be present');

    http.createServer(function (req, res) {
        console.log('requested :::: ' + req.url);
        var filePath = '.' + req.url,
            promise = compile.compile(filePath),
            mode = req.headers.requiremode;
        promise.then(function (src) {
            res.writeHead(200, {'Content-Type': 'application/javascript'});

            if (mode === 'debug') {
                res.end('debug\n')
            } else {
                res.end('default\n')
                // res.end(src)
            };
        }).fail(function (err) {
            console.log(err)
            console.log(err && err.stack);
            res.writeHead(404, {'Content-Type': 'application/javascript'});
            res.end();
        });
    }).listen(config.port);

    console.log('Server is listening on ' + config.port);
}

module.exports = {
    start: start
};
