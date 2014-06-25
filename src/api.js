var build = require('./build.js'),
    Promise = require('es6-promise').Promise,
    path = require('path'),
    config = require('./config.js');

module.exports = {
    getAsset: function(filePath, wrap) {
        console.log(filePath, wrap);
        filePath = path.resolve(config.assetPath, filePath);
        return new Promise(function(resolve, reject) {
            build.makeSingleNode(filePath, wrap).then(function(assetNode) {
                resolve(assetNode.content);
            }).catch(reject);
        });
    },
    getAssetList: function(filePath) {
        filePath = path.resolve(config.assetPath, filePath);
        return new Promise(function(resolve, reject) {
            build.makeNodeList(filePath).then(function(list) {
                list = list.map(function(file) {
                    return {
                        path: file.relativePath(),
                        wrap: file.wrap
                    };
                });
                resolve(list);
            }).catch(reject);
        });
    },
    getBuild: function(path) {
        'stub';
    },
    config: function() {
        return config;
    }
};
