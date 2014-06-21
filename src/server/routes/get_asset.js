var build = require('../../build.js'),
    respondError = require('../respond_error.js');

module.exports = function(req, res, path) {
    build.makeSingleNode(path).then(function(assetNode) {
        res.writeHead(200, {
            'Content-Type': 'application/javascript'
        });
        res.end(JSON.stringify(assetNode.content));
    }).catch(function(err) {
        respondError.respondError(res, {msg: JSON.stringify(err)});
    });
};
