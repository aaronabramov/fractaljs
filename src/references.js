var Promise = require('es6-promise').Promise,
    FN_OPEN = '\nrequire.loadReferences(',
    FN_CLOSE = ');\n';

module.exports = {
    /**
     * return string containing javascript function that
     * will register all references
     * @param assetList {Array} list of {AssetNode}s
     */
    makeReferencesFunction: function(assetList) {
        var _this = this;
        // TODO: write function that will add resulting map
        // to internal `require` data structure to keep track
        // of modules
        var promises = assetList.map(function(assetNode) {
            return assetNode.directives.getReferencedNodes();
        });
        return new Promise(function(resolve, reject) {
            Promise.all(promises).then(function(maps) {
                var func = FN_OPEN +
                    JSON.stringify(_this._mergeRefMaps(maps)) +
                    FN_CLOSE;
                resolve(func);
            }).catch(reject);
        });
    },
    /**
     * merge multiple reference maps into one
     *
     * @param maps {Array} of maps
     *      {
     *          "module1.js": ["bundle1.js", "bundle2.js"]
     *      }
     */
    _mergeRefMaps: function(maps) {
        var result = {};
        maps.forEach(function(map) {
            for (var module in map) {
                if (result[module]) {
                    result[module].concat(map[module]);
                } else {
                    result[module] = map[module];
                }
            }
        });
        return result;
    }
};
