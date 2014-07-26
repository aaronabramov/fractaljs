var fs = require('fs'),
    config = require('./config.js'),
    Directives = require('./directives.js'),
    path = require('path'),
    Promise = require('es6-promise').Promise;

/**
 * @param options.path {String} asset path
 * @param [options.wrap] {Boolean} whether to wrap file in module
 * @param [options.content] {String} content
 * @param [option.directives] {Array}
 */
function AssetNode(options) {
    if (!options.path) {
        throw new Error('path is required');
    }
    this.path = options.path;
    // this.path = path.resolve(config.assetPath, options.path);
    this.content = options.content;
    this.wrap = options.wrap;
    this.children = options.children || [];
    // whether node has to be parsed and it's directives need to be
    // processed.
    this.parse = true;
    if (options.parse != null) {
        this.parse = options.parse;
    }
    // flag to indicate whether node will be ignored during
    // the build step.
    this.ignore = false;
}

AssetNode.prototype = {
    initDirectives: function() {
        this.directives = new Directives(this);
        if (this.directives._getDirectivesByType('require_self').length) {
            this.ignore = true;
        }
    },
    relativePath: function() {
        var relativePath = path.relative(config.assetPath, this.path);
        if (relativePath.length && relativePath[0] !== '.') {
            // make it relative to current asset path
            relativePath = './' + relativePath;
        }
        return relativePath;
    },
    absolutePath: function() {
        return path.resolve(config.assetPath, this.path);
    },
    /**
     * readFile `this.path` and resolve promise with it's content
     * @return {Promise}
     */
    fetchContent: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            fs.readFile(_this.absolutePath(), function(err, content) {
                if (err) {
                    reject(err);
                } else {
                    resolve(content.toString());
                }
            });
        });
    }
};

module.exports = AssetNode;
