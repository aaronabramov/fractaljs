var HEADER_PATTERN = /\/\/\s*=\s*require\s*([\w\.\/]+)\s*$/gm;

module.exports = {
    extractDirectives: function (src) {
        var match, files = [];
        while (match = HEADER_PATTERN.exec(src)) {
            files.push(match[1]);
        }
        return files;
    }
}
