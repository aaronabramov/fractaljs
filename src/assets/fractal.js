(function() {
    // Cache variables
    var modules = {}, // cache of modules
        scriptTags = [],
        references = {}, // cache of reference maps
        EXTENSIONS = ['js'];

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
            callback();
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
        var module = {
            filename: filename, // relative to root assetPath
            fn: fn, // module function that takes (exports, moudle, require)
            alias: alias, // optional
            exports: null // lazily evaluated during `require` step
        };

        // Cache module function in closure var
        modules[filename] = module;
        if (alias) {
            modules[alias] = module;
        }
    }

    /*****************************************************************/
    var DIRNAME_REGEX = /^([\s\S]*?)(?:(?:\.{1,2}|[^\/]+?|)(?:\.[^.\/]*|))(?:[\/]*)$/;

    var dirname = function(path) {
        if (!path) {
            throw new Error('argument should be not empty string');
        }
        var match = DIRNAME_REGEX.exec(path);
        return match[1];
    };

    var splitPath = function(path) {
        var parts = path.split('/');
        var res = [];
        for (var i = 0; i < parts.length; i++) {
            parts[i] || parts.splice(i, 1);
        }
        return parts;
    };

    var resolvePath = function() {
        var paths = Array.prototype.slice.apply(arguments);
        var parts = [];
        var res = [];
        var up = 0;
        paths.forEach(function(path) {
            parts = parts.concat(splitPath(path));
        });
        parts.forEach(function(part) {
            switch (part) {
                case '..':
                    if (res.length) {
                        if (res.length === 1 && res[0] === '.') {
                            res.pop();
                            up++;
                        } else {
                            res.pop();
                        }
                    } else {
                        up++;
                    }
                    break;
                case '.':
                    res.length || res.push('.');
                    break;
                default:
                    res.push(part);
                    // up--;
                    break;

            }
        });
        if (up >= 0) {
            while (up) {
                res.unshift('..');
                up--;
            }
        }
        res = res.join('/');
        return res;
    };
    /*****************************************************************/

    /**
     * resolve module path based on parent if it exists
     * @param request {String} file path relative to current module
     *      or package name (e.g. 'path') which will be resolved to abs filename
     * @param [parentModule] {module} module object
     * @return {String} filename (path relative to root)
     */
    function resolve(request, parentModule) {
        var resolved;
        if (parentModule) {
            var _dirname = dirname(parentModule.filename);
            // hacky way to get normalized path relative to `config.assetpath`
            // TODO: rewrite path resolving
            resolved = resolvePath(_dirname, request);
            console.log('----', _dirname, request, 'res', resolved);
        } else {
            resolved = request;
        }
        return resolved; // TODO
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
        // look for aliased version
        if (!modules[request]) {
            request = resolve(request, __module__);
        }
        var module = modules[request];
        if (!module) {
            for (var i = 0, l = EXTENSIONS.length; i < l; i++) {
                module = modules[request + '.' + EXTENSIONS[i]];
                if (module) {
                    break;
                }
            }
        }
        if (!module) {
            throw new Error('module [' + request + '] not found');
        }
        if (module.exports) {
            return module.exports;
        }
        module.exports = {};
        module.fn(module.exports, module, makeRequireFn(module));
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
     *      has been fetched and loaded.
     * @throws Will throw an error if module is not found in cache or package
     *      files.
     */
    function use(moduleName, callback) {
        if (modules[moduleName]) {
            // If module is already loaded then defer callback invokation
            setTimeout(function() {
                callback();
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

    /****************** exports *******************/
    window.require = makeRequireFn();
    window.require.dirname = dirname;
    window.require.splitPath = splitPath;
    window.require.resolvePath = resolvePath;
    window.require.loadReferences = loadReferences;
    window.require.references = references;
    window.use = use;
})();
