var build = require('../../build.js'),
    respondError = require('../respond_error.js');

module.exports = function(req, res, path) {
    promise = build.build(path);

    promise.then(function(list) {
        list = list.map(function(file) {
            return {
                path: file.path,
                wrap: file.wrap
            };
        });
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(list));
    }).fail(function(err) {
        respondError.respondError(res, {msg: JSON.stringify(err)});
    });
};
