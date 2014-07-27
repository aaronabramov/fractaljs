var DIRNAME_REGEX = /^([\s\S]*?)(?:(?:\.{1,2}|[^\/]+?|)(?:\.[^.\/]*|))(?:[\/]*)$/;

exports.dirname = function(path) {
    var match = DIRNAME_REGEX.exec(path),
        result;
    if (match) {
        result = match[1];
        result.length && (result.slice(-1) !== '/') && result.unshift('/');
    }
    return (result || '');
};

exports.splitPath = function(path) {
    var parts = path.split('/');
    var res = [];
    for (var i = 0; i < parts.length; i++) {
        parts[i] || parts.splice(i, 1);
    }
    return parts;
};

exports.resolve = function() {
    var paths = Array.prototype.slice.apply(arguments);
    var parts = [];
    var res = [];
    var up = 0;
    paths.forEach(function(path) {
        parts = parts.concat(exports.splitPath(path));
    });
    parts.forEach(function(part) {
        switch (part) {
            case '..':
                up++;
                res.length && res.pop();
                break;
            case '.':
                res.length || res.push('.');
                break;
            default:
                res.push(part);
                up--;
                break;

        }
    });
    if (up >= 0) {
        do {
            res.unshift('..');
            up--;
        } while (up >= 0);
    }
    res = res.join('/');
    return res;
};
