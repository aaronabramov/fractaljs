/**
 * Module represents one directive. e.g.
 * ['require', './path/to/file.js', 'wrap_in_module']
 * and provides operations on it
 */
var directiveToFiles = require('./directive_to_files.js'),
    Promise = require('es6-promise').Promise;

/**
 * @param path {String} path to the file that contains directive
 * @param directive {Array} parsed directive and it's args
 * e.g. ['require_tree', './tree', 'wrap_in_module']
 */
function Directive(path, directive) {
    this.path = path;
    this.type = directive[0];
    this.args = directive.slice(1);
    this._processRequiredFiles = this._processRequiredFiles.bind(this);
}

Directive.prototype = {
    WRAP_IN_MODULE_ARG: 'wrap_in_module',

    /**
     * @return {Promise} resolves with list of files
     * {path: './path/to/file.js', wrap: [true,false]}
     */
    filesToRequire: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            directiveToFiles.getFiles(
                _this.path, _this.type, _this.args
            ).then(function(files) {
                resolve(files.map(_this._processRequiredFiles));
            }).catch(reject);
        });
    },
    /**
     * process and modify exctacted file list before returning it
     * @param filePath {String}
     */
    _processRequiredFiles: function(filePath) {
        var result = {path: filePath};
        if (this._isWrappedInModule()) {
            result.wrap = true;
        }
        return result;
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
