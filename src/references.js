var Promise = require('es6-promise').Promise;

module.exports = {
    /**
     * return string containing javascript function that
     * will register all references
     * @param assetList {Array} list of {AssetNode}s
     */
    makeReferencesFunction: function(assetList) {
        // ---------------- WIP -----------------
        // TODO: write function that will add resulting map
        // to internal `require` data structure to keep track
        // of modules
        var promises = assetList.map(function(assetNode) {
            return assetNode.directives.getReferencedNodes();
        });
        return new Promise(function(resolve, reject) {
            Promise.all(promises).then(function(map) {
                resolve(map);
            }).catch(reject);
        });
    }
};
