var http = require('http'),
    config = require('../config.js'),
    router = require('./router.js');

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
        console.log.apply(this, arguments);
    }
};
