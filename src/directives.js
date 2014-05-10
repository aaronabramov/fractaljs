var HEADER_PATTERN = /\/\/\s*=\s*(require\w*)\s*([\w\.\/]*)\s*$/gm;

module.exports = {
    /**
     * @return {Array} array of directives and their values
     */
    extract: function (src) {
        var match, fileNames = [];
        while (match = HEADER_PATTERN.exec(src)) {
            var directive = match[1],
                value = match[2]
                result = [directive];
            value && result.push(value);
            fileNames.push(result);
        }
        return fileNames;
    }
}
