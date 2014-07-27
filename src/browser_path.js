var DIRNAME_REGEX = /^([\s\S]*?)(?:(?:\.{1,2}|[^\/]+?|)(?:\.[^.\/]*|))(?:[\/]*)$/;

exports.dirname = function(path) {
    return DIRNAME_REGEX.exec(path)[1];
};

exports.resolve = function() {
};
