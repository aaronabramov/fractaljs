var HEADER_PATTERN = /\/\/\s*=\s*require\s*([\w\.\/]+)\s*$/gm;

module.exports = {
    /**
     * @return {Array} array of parsed filenames "['./main.js', './main2.js']"
     */
    extractDirectives: function (src) {
        var match, fileNames = [];
        while (match = HEADER_PATTERN.exec(src)) {
            fileNames.push(match[1]);
        }
        return fileNames;
    }
}
