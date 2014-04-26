(function () {
    var modules = {};

    function define(moduleName, fn) {
        modules[moduleName] = fn;
    }

    function require() {
    }

    function requireSync(moduleName) {
        var exports = {};
        modules[moduleName](exports);
        return exports;
    }

    window.define = define;
    window.require = require;
    window.requireSync = requireSync;
})();
