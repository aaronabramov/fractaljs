var regexpCache = {};

module.exports = {
    routes: {
        '\\/assets\\/(.*)':        require('./routes/get_asset.js'),
        '\\/getAssetList\\/(.*)':  require('./routes/get_asset_list.js'),
        '\\/getBuild\\/(.*)':      require('./routes/get_build.js')
    },
    /**
     * looks up the function to execute and returns it with captured
     * arguments.
     *
     * @return [Object] {fn: {Function}, args: {Array}}
     */
    lookup: function(path) {
        var keys = Object.keys(this.routes),
            length = keys.length,
            i, regexp, matches, key;
        for (i = 0; i < length; i++) {
            key = keys[i];
            regexp = regexpCache[key] || (regexpCache[key] = new RegExp(key));
            if (matches = path.match(regexp)) {
                return {
                    fn: this.routes[key],
                    args: matches.slice(1)
                };
            }
        }
    },
    /**
     * lookup the route by regexp and pass [req, res, matches]
     * as an arguments to corresponding function
     *
     * @param path {String} requested path
     * @param req {Object} request obj
     * @param res {Object} response obj
     */
    exec: function(path, req, res) {
        var result = this.lookup(path);
        if (!result) {
            return this.respondNotFound(res, 'route not found: [' + path + ']');
        }
        return result.fn.apply(this, [req, res].concat(result.args));
    },

    respondNotFound: function(res, msg) {
        this.respondError(res, {status: 404, msg: msg});
    },

    respondError: function(res, err) {
        res.writeHead(err.status, {
            'Content-Type': 'application/json'
        });
       res.end(JSON.stringify({
            msg: err.msg
        }));
    }
};
