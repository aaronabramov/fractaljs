var api = require('./api.js');
var middleware = require('./middleware.js');

module.exports = {
    getAsset: api.getAsset,
    getAssetList: api.getAssetList,
    bundle: api.bundle,
    config: api.config,
    manifest: api.manifest,
    middleware: middleware
};
