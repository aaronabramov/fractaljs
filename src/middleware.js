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
 * respond with json with error trace
 */
function respondError(res, err) {
    res.writeHead(err.status || 500, {
        'Content-Type': 'application/json'
    });
    var stack = err.stack;
    stack && (stack = stack.split('\n'));
    res.end(JSON.stringify({
        msg: err.msg,
        err: err.toString(),
        stack: stack
    }));
}

/**
 * express middleware
 */
module.exports = function(req, res) {
    var path = req.params[0];
    // request for compiled bundle
    if (req.query.bundle) {
        // return compiled bundle
        api.bundle(path).then(function(content) {
            respondJs(res, content);
        }).
        catch (function(err) {
            respondError(res, err);
        });
    } else { // get single asset
        api.getAsset(path, req.query.wrap).then(function(content) {
            respondJs(res, content);
        }).
        catch (function(err) {
            respondError(res, err);
        });
    }
};
