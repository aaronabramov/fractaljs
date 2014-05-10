async-require
=============

```javascript
// app.js
// require_lib
// require .submodule.js

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

##### Proxy requests from clj app
```clojure
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
