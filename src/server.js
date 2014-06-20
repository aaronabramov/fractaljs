var http = require('http'),
    config = require('./config.js'),
    router = require('./router.js'),
    build = require('./build.js');

module.exports = {
    DEFAULT_PORT: 6969,
    REQUIRE_MODE_HEADER: '_require-mode',
    REQUIRE_MODE_DEBUG_VALUE: 'debug',

    /**
     * Create instance of {http.Server}
     *
     * @return {http.Server}
     */
    createServer: function() {
        var _this = this,
            server;

        if (!config.assetPath) throw new Error('path must be present');

        server = http.createServer(function(req, res) {
            var filePath = req.url,
                requireMode = req.headers[_this.REQUIRE_MODE_HEADER];
            router.exec(filePath, req, res);
            res.end();
            //     promise = build.build(filePath);
            //
            // promise.then(function(list) {
            //     res.writeHead(200, {
            //         'Content-Type': 'application/json'
            //     });
            //     // TODO: Merge source code in one string if not debug mode
            //     // if (requireMode === _this.REQUIRE_MODE_DEBUG_VALUE) {
            //     //     src.shift();
            //     // } else {
            //     //     src.splice(1);
            //     // }
            //     res.end(JSON.stringify(list));
            // }).fail(function(err) {
            //     _this.log(err);
            //     _this.log(err && err.stack);
            //     res.writeHead(404, {
            //         'Content-Type': 'application/json'
            //     });
            //     res.end();
            // });
        });
        return server;
    },

    /**
     * Start server
     *
     * @param {http.Server}
     */
    start: function(server) {
        server.listen(config.port || this.DEFAULT_PORT);
        this.log('Server is listening on ' + (config.port || this.DEFAULT_PORT));
        return server;
    },
    /**
     * Stop server
     *
     * @param {http.Server}
     */
    stop: function(server) {
        server.close();
        this.log('Server stopped');
        return server;
    },

    /**
     * Proxy to console.log
     */
    log: function() {
        console.log(arguments);
    }
};
