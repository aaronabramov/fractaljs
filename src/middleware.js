var api = require('./api.js');

/**
 * @param res {response obj}
 * @param content {String} JS source
 */
function respondJs(res, content) {
    res.writeHead(200, {
        'Content-Type': 'application/javascript'
    });
    res.end(content);
}

/**
 * express middleware
 */
module.exports = function(req, res) {
    var path = req.params.path;
    // request for compiled bundle
    if (req.query.bundle) {
        // return compiled bundle
        api.bundle(path).then(function(content) {
            respondJs(res, content);
        }).catch(function(e) {
            res.writeHead(500);
            res.end(JSON.stringify(e.toString()));
        });
    } else { // get single asset
        api.getAsset(path, req.query.wrap).then(function(content) {
            respondJs(res, content);
        }).
        catch (function(e) {
            res.writeHead(500);
            res.end(JSON.stringify(e.toString()));
        });
    }
};
