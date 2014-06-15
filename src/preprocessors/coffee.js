var coffee = require('coffee-script');

module.exports = function (path, src) {
    return coffee.compile(src);
};
