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
make watch_mocha
```

### run karma tests
```shell
brew install phantomjs
make karma
```

##### Features TODO
- Q => ES-6 Promises
- multiple paths
- get rid of mutable config
- parse directives differently for different file types
- production build
- generate layered build config file automatically (which package cantains required module)
- heartbeat
- ~~throw error in main thread (main app) on compile error (coffee/hamlc)~~
- ~~`require ./file.js wrap_in_module`~~
- ~~make module names relative paths~~
- ~~compile coffee/hamlc~~
- ~~'require_tree' && 'require_directory' directives~~
