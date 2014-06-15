var path = require('path');

// Dynamic config module. Modifief from outside
module.exports = {
    LIB_PATH: path.resolve(__dirname, './assets/async_require.js')
};
