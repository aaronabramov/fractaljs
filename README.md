async-require
=============

```javascript
// app.js
//= require_lib
//= require ./submodule.js

exports.f = function () { return 'app'; };
```

```javascript
// submodule.js
exports.f = function () { return 'submodule'; };
```

```html
<script src="http://localhost:6969/app.js></script>
<script>
    var app = require('app.js'),
        submodule = require('submodule.js');
    console.log(app.f());
    console.log(submodule.f());
</script>
```

##### Proxy requests from compojure app
```clojure
(ns my-namespace
  (:require [compojure.core :refer [defroutes GET]]
            [org.httpkit.client :as http]))

(defn proxy-request [path]
  (:body @(http/get (str "http://localhost:6969/" path) {:as :text})))

(defroutes js-routes
  (GET "/js/:path" [path]
       {:status 200
        :headers {"Content-Type" "application/javascript"}
        :body (proxy-request path)}))
```


### development
```shell
make install && make dev
```

### run karma tests
```shell
brew install phantomjs
make unit
```

##### Features TODO
- 'require_tree' directive
- 'require_module' vs. 'require' directives
- throw error in main thread (main app) on compile error
- production build
- generate layered build config file automatically (which package cantains required module)
- ~~compile coffee/hamlc~~
- disable directives for certain types (hamlc)


##### Building process TODO:
Step 1: Create hash-map with key being the file path relative to fixed location (/ or asset_root) and value being the file content string
Step 2: Read the first required file and store it's content into hash map
Step 3: Extract directive list and store inside directives data structure
Step 4: Recursively go through files that were in first file directives and store them in hash-map data structure the same way
Step 5: Based on stored directives, order included files and exclude them if any of the excluding directives are present in files
Step 6: Run files content through preprocessors (compile hamlc, coffee or wrap in commonjs modules) resulting
Step 7: Return resulting hash map where keys are required file_names (e.g. tmpl/template.hamlc.js, app.coffee.js [append .js at the end to allaw two different files with the same base name to be in one loctation 'layout.coffee' and 'layout.hamlc']) which can be served as separate files (debug mode) ore joined in one string and streamed altogether
