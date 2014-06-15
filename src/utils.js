var path = require('path'),
    config = require('./config.js'),
    EXTENSION_TO_FILETYPE_MAP = {
        'js': 'js',
        'hamlc': 'hamlc',
        'coffee': 'coffee'
    };

module.exports = {
    extractFileType: function(filePath) {
        var filename = path.basename(filePath),
            extension = filename.match(/\.(\w+)$/);
        extension = extension && extension[1];
        return EXTENSION_TO_FILETYPE_MAP[extension];
    },
    resolveAssetPath: function(filePath) {
        return path.resolve(config.assetPath, filePath);
    }
};
