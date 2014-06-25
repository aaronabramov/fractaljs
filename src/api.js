var build = require('./build.js'),
    Promise = require('es6-promise').Promise,
    config = require('./config.js');

module.exports = {
    getAsset: function(path) {
        return new Promise(function(resolve, reject) {
            build.makeSingleNode(path).then(function(assetNode) {
                resolve(assetNode.content);
            }).catch(reject);
        });
    },
    getAssetList: function(path) {
        return new Promise(function(resolve, reject) {
            build.makeNodeList(path).then(function(list) {
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
