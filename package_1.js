define('package-module-1', function(exports) {
    exports.PACKAGE_1_FUNC = function(val) {
        console.log('log from package 1', val);
    };
});

define('package-module-2', function(exports) {
    exports.PACKAGE_2_FUNC = function(val) {
        console.log('log from package 2', val);
    };
});
