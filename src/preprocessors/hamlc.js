hamlc = require('haml-coffee');

var PREFIX = 'module.exports = ';

module.exports = function (path, src) {
    throw new Error('todo: implement');
    return PREFIX + hamlc.template(src, null, null, {placement: 'standalone'});
};
