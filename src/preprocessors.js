var utils = require('./utils.js'),
    config = require('./config.js'),
    PREPROCESSORS = {
        'hamlc': require('./preprocessors/hamlc.js'),
        'coffee': require('./preprocessors/coffee.js'),
        'module': require('./preprocessors/module.js'),
        'jsx': require('./preprocessors/jsx.js')
    },
    TYPE_TO_PREPROCESSOR_MAP = {
        'hamlc': 'hamlc',
        'coffee': 'coffee',
        'jsx': 'jsx'
    };

/**
 * invoke preprocessor chain
 *
 * @param assetNode {AssetNode}
 */
function preprocess(assetNode) {
    compile(assetNode);
    assetNode.wrap && wrap(assetNode);
    return assetNode;
}

/**
 * Compile file source if needed
 */
function compile(assetNode) {
    var fileType = utils.extractFileType(assetNode.path),
        preprocessorName = TYPE_TO_PREPROCESSOR_MAP[fileType],
        preprocessor = PREPROCESSORS[preprocessorName];

    if (preprocessor) {
        preprocessor(assetNode);
    }
    return assetNode;
}

/**
 * Wrap file in module if needed
 */
function wrap(assetNode) {
    if (needsToBeWrapped(assetNode)) {
        assetNode.content = PREPROCESSORS['module'](assetNode);
    }
    return assetNode;
}

/**
 * @return {Boolean} whether file needs to be wrapped in a module
 */
function needsToBeWrapped(assetNode) {
    return assetNode.path !== config.LIB_PATH;
}

module.exports.preprocess = preprocess;
