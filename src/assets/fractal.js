(function() {
    // Cache variables
    var modules = {}, // cache of modules
        scriptTags = [],
        references = {}; // cache of reference maps

    /**
     * Load script from the path and bind callback on onload event passing
     *      result of async require of given module.
     *
     * @param path {String} path to containing module script
     * @param moduleName {String} module name
     * @param callback {Function} callback function
     */
    function loadScript(path, moduleName, callback) {
        var scriptTag = document.createElement('script');
        scriptTag.src = path;
        // cache script tag for later cleanup
        scriptTags.push(scriptTag);
        scriptTag.onload = function() {
            callback(window.require(moduleName));
        };
        document.body.appendChild(scriptTag);
    }

    /**
     * Define module by writing its defining function to a cache closure var.
     *
     * @param moduleName {String} module name
     * @param fn {Function} function that defines module
     */
    function define(filename, fn, alias) {
        // Cache module function in closure var
        modules[filename] = {
            filename: filename, // relative to root assetPath
            fn: fn, // module function that takes (exports, moudle, require)
            alias: alias, // optional
            exports: null // lazily evaluated during `require` step
        };
    }

    /**
     * resolve module path based on parent if it exists
     * @param request {String} file path relative to current module
     *      or package name (e.g. 'path') which will be resolved to abs filename
     * @param [parent] {module} module object
     * @return {String} filename (path relative to root)
     */
    function resolve(request, parent) {
        return request; // TODO
    }

    /**
     * create `require` function that will be passed into module definition.
     * this function will capture the current module and will be able
     * to require other files relative to current module
     */
    function makeRequireFn(module) {
        return require.bind(this, module);
    }

    /**
     * Synchronously require module and return populated exports object.
     *
     * @param [__module__] {module} parent module. optional. partialy applied
     *      @see #makeRequireFn
     * @param request {String} relative filepath or module name
     * @throws Will throw error if module is not found in cache.
     */
    function require(__module__, request) {
        console.log(arguments);
        var filename = resolve(request, parent),
            module = modules[filename];
        if (!module) {
            throw new Error('module [' + request + '] not found');
        }
        if (module.exports) {
            return module.exports;
        }
        module.exports = module.fn(module.exports, module, makeRequireFn(module));
        return module.exports;
    }

    /**
     * Try to lookup module in cache, if module has been already loaded
     *      return populated exports object via require function, if
     *      module is not loaded but present in MANIFEST list then initialize
     *      async loading of the script containing this module.
     *
     * @param moduleName {String} module name
     * @param callback {Function} function that will be invoked after module
     *      has been fetched and loaded. module.exports will be passed into
     *      callback function.
     * @throws Will throw an error if module is not found in cache or package
     *      files.
     */
    function use(moduleName, callback) {
        if (modules[moduleName]) {
            // If module is already loaded then defer callback invokation
            setTimeout(function() {
                callback(window.require(moduleName));
            }, 1);
        } else {
            // else try to find module name in the references
            for (var m in references) {
                if (moduleName === m) {
                    // if it's there initialize loading script file
                    var bundlePath = '/assets/' + references[m][0] + '?bundle=true';
                    loadScript(bundlePath, moduleName, callback);
                    return;
                }
            }
            // if module is not found then throw an error
            throw new Error("Can't find module " + moduleName);
        }
    }

    /**
     * register references
     *
     * @param refs {Object} {"module1.js": ["bundle1.js", "bundle2.js"]}
     */
    function loadReferences(refs) {
        for (var module in refs) {
            if (references[module]) {
                for (var i = 0, _length = refs[module].length; i < _length; i++) {
                    references[module].push(refs[module][i]);
                }
            } else {
                references[module] = refs[module];
            }
        }
    }

    window.define = define;
    define.modules = modules;
    define.scriptTags = scriptTags;

    window.require = makeRequireFn();
    window.require.loadReferences = loadReferences;
    window.require.references = references;
    window.use = use;
})();
