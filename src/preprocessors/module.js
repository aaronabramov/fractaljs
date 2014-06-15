var DEFINE = 'define("',
    HEADER = '", function (exports, module) {\n',
    FOOTER = '});';

module.exports = function(path, src) {
    // TODO: escape path
    return DEFINE + path + HEADER + src + FOOTER;
};

