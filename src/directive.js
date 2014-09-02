var config = require('./config.js'),
    path = require('path');

/**
 * Module represents one directive. e.g.
 * ['require', './path/to/file.js', 'module']
 * and provides operations on it
 */
var directiveToFiles = require('./directive_to_files.js'),
    Promise = require('es6-promise').Promise;

/**
 * @param filePath {String} path to the file that contains directive
 * @param directive {Array} parsed directive and it's args
 * e.g. ['require_tree', './tree', 'module']
 */
function Directive(filePath, directive) {
    this.path = filePath;
    this.dirname = path.dirname(this.path);
    this.type = directive[0];
    this.args = directive.slice(1);
    this._makeAssetNode = this._makeAssetNode.bind(this);
}

Directive.prototype = {
    WRAP_IN_MODULE_ARG: 'module',

    /**
     * @return {Promise} resolves with list {AssetNode}s
     */
    filesToRequire: function() {
        var _this = this,
            rootNodeArray = [];
        /* dirty hack start */
        return new Promise(function(resolve, reject) {
            directiveToFiles.getFiles(
                _this.path, _this.type, _this.args
            ).then(function(filePaths) {

                if (_this.type == 'require' &&
                    _this.args[0][0] !== '.') {
                    var rootModule = filePaths.shift(),
                        rootAssetNode = _this._makeAssetNode(rootModule);
                    rootAssetNode.alias = _this.args[0];
                    rootNodeArray.push(rootAssetNode);
                }

                filePaths = filePaths.map(function(filePath) {
                    return path.relative(config.assetPath, filePath);
                });
                resolve(rootNodeArray.concat(
                    filePaths.map(_this._makeAssetNode)));
            }).catch(reject);
            /* dirty hack end */
        });
    },
    /**
     * {AssetNode} factory
     * @param filePath {String}
     * @return {AssetNode}
     */
    _makeAssetNode: function(filePath) {
        var AssetNode = require('./asset_node.js');
        return new AssetNode({
            path: path.resolve(config.assetPath, filePath),
            wrap: this._isWrappedInModule(),
            parse: this._needToParse()
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
    },
    _needToParse: function() {
        return this.type !== 'require_self';
    }
};

module.exports = Directive;
