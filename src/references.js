var Promise = require('es6-promise').Promise;

module.exports = {
    /**
     * return string containing javascript function that
     * will register all references
     * @param assetList {Array} list of {AssetNode}s
     */
    makeReferencesFunction: function(assetList) {
        // ---------------- WIP -----------------
        var promises = assetList.map(function(assetNode) {
            return assetNode.directives.getReferencedNodes();
        });
        return new Promise(function(resolve, reject) {
            Promise.all(promises).then(function(map) {
                resolve(map);
                // lists.forEach(function(list) {
                //     list.forEach(function(assetNode) {
                //         assetNodes.push(assetNode);
                //         resolve(assetNodes);
                //         // TODO hashmap package -> module/file
                //     });
                // });
            }).
            catch(reject);
        });
    }
};
