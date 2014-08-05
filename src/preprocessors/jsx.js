var React = require('react-tools');

/**
 * Transform react jsx
 */
module.exports = function(assetNode) {
    assetNode.content = React.transform(assetNode.content);
    return assetNode;
};
