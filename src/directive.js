var AssetNode = require('./asset_node.js'),
    config = require('./config.js'),
    path = require('path');

/**
 * Module represents one directive. e.g.
 * ['require', './path/to/file.js', 'wrap_in_module']
 * and provides operations on it
 */
var directiveToFiles = require('./directive_to_files.js'),
    Promise = require('es6-promise').Promise;

/**
 * @param filePath {String} path to the file that contains directive
 * @param directive {Array} parsed directive and it's args
 * e.g. ['require_tree', './tree', 'wrap_in_module']
 */
function Directive(filePath, directive) {
    this.path = filePath;
    this.dirname = path.dirname(this.path);
    this.type = directive[0];
    this.args = directive.slice(1);
    this._makeAssetNode = this._makeAssetNode.bind(this);
}

Directive.prototype = {
    WRAP_IN_MODULE_ARG: 'wrap_in_module',

    /**
     * @return {Promise} resolves with list {AssetNode}s
     */
    filesToRequire: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            directiveToFiles.getFiles(
                _this.path, _this.type, _this.args
            ).then(function(filePaths) {
                filePaths = filePaths.map(function(filePath) {
                    return path.relative(config.assetPath, filePath);
                });
                resolve(filePaths.map(_this._makeAssetNode));
            }).catch(reject);
        });
    },
    /**
     * {AssetNode} factory
     * @param filePath {String}
     * @return {AssetNode}
     */
    _makeAssetNode: function(filePath) {
        return new AssetNode({
            path: path.resolve(config.assetPath, filePath),
            wrap: this._isWrappedInModule()
        });
    },
    /**
     * @return {Boolean} if files required by this directive need
     * to be wrapped in modules
     */
    _isWrappedInModule: function() {
        var _this = this;
        return this.args.some(function(arg) {
            return arg === _this.WRAP_IN_MODULE_ARG;
        });
    }
};

module.exports = Directive;
