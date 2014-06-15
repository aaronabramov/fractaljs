/**
 * @param options.path {String} asset path
 * @param [options.content] {String} content
 * @param [option.directives] {Array}
 */
function AssetNode(options) {
    if (!options.path) { throw new Error('path is required'); }
    this.path = options.path;
    this.content = options.content;
    this.directives = options.directives;
    this.children = options.children || [];
}

module.exports = AssetNode;
