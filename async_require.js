var MANIFEST = {
    'package-module-1': 'package_1.js',
    'package-module-2': 'package_1.js'
};

(function () {
    var modules = {};

    function loadScript(path, moduleName, callback) {
        var scriptTag = document.createElement('script');

        scriptTag.src = path;

        scriptTag.onload = function () {
            callback(requireSync(moduleName));
        };

        document.body.appendChild(scriptTag);
    }

    function define(moduleName, fn) {
        modules[moduleName] = fn;
    }

    function require(moduleName, callback) {
        if (modules[moduleName]) {
            setTimeout(function () { callback(requireSync(moduleName)); }, 1);
        } else {
            for (var m in MANIFEST) {
                if (moduleName === m) {
                    loadScript(MANIFEST[m], moduleName, callback);
                    return;
                }
            }
            throw new Error("Can't find module " + moduleName);
        }
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
