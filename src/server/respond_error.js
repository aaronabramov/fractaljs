module.exports = {
    respondNotFound: function(res, msg) {
        this.respondError(res, {status: 404, msg: msg});
    },

    respondError: function(res, err) {
        res.writeHead(err.status || 500, {
            'Content-Type': 'application/json'
        });
       res.end(JSON.stringify({
            msg: err.msg
        }));
    }
};
