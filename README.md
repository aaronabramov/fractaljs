async-require
=============
[![Build Status](https://travis-ci.org/dmitriiabramov/async-require.svg?branch=master)](https://travis-ci.org/dmitriiabramov/async-require)

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

### run all tests
```shell
make test
```

### watch mocha test
```shell
make watch_test
```

### run karma tests
```shell
brew install phantomjs
make karma
```

##### Features TODO
- Q => ES-6 Promises
- get rid of mutable config
- `require ./file.js nowrap` to avoid wraping in module
- parse directives differently for different file types
- throw error in main thread (main app) on compile error (coffee/hamlc)
- production build
- generate layered build config file automatically (which package cantains required module)
- heartbeat
- ~~make module names relative paths~~
- ~~compile coffee/hamlc~~
- ~~'require_tree' && 'require_directory' directives~~


##### Building process TODO:
- Step 1: Create hash-map with key being the file path relative to fixed location (/ or asset_root) and value being the file content string
- Step 2: Read the first required file and store it's content into hash map
- Step 3: Extract directive list and store inside directives data structure
- Step 4: Recursively go through files that were in first file directives and store them in hash-map data structure the same way
- Step 5: Based on stored directives, order included files and exclude them if any of the excluding directives are present in files
- Step 6: Run files content through preprocessors (compile hamlc, coffee or wrap in commonjs modules) resulting
- Step 7: Return resulting hash map where keys are required file_names (e.g. tmpl/template.hamlc.js, app.coffee.js [append .js at the end to allaw two different files with the same base name to be in one loctation 'layout.coffee' and 'layout.hamlc']) which can be served as separate files (debug mode) ore joined in one string and streamed altogether


##### Fetching files from client app TODO:
two modes exist: `combined` and `debug`
if file is issued from the client app by http, response should always look like a list of file paths with their content
e.g.
JSON request
```
    GET /application.js
    Accept-Type: 'application/json'
    _Require-Mode: 'Debug'
```

response:
```
    HTTP/1.1 200 OK
    Content-Type: 'application/json'

    {
        "application.coffee.js": "function a() { return 'stuff' }",
        "required_template.hamlc.js": "<h1>stuff</h1>"
    }
```

- Option 1: Compined mode. all files that are erquired from within `application.coffee.js` are concatenated in it's content. response contains just one key/val pair that is then transformed into one \<script> tag in the client app
- Option 2: Debug mode. all the files that are required from withi `application.coffee.js` returned in separate key/val pairs. this will result in multiple \<script> tags per file in client app
