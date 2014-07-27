Fractaljs
=============
[![Build Status](https://travis-ci.org/dmitriiabramov/fractaljs.svg?branch=master)](https://travis-ci.org/dmitriiabramov/async-require)

Bundle javascript modules + lazy load in browser

```javascript
// app.js
//= require_fractal
//= require ./jquery.js
//= require ./submodule.js module
//= reference ./lazy_loaded_bundle.js

exports.f = function () { return 'app'; };
```

```javascript
// submodule.js
module.exports = 'submodule';
```

```javascript
// lazy_loaded_bundle.js
//= require ./react.js module
```



```html
<script src="/assets/app.js"></script>
<script>
    var submodule = require('submodule.js'); // require synchonously
    console.log(submodule) // => 'submodule'
    use('./react.js', function() { // load 'lazy_loaded_bundle.js' first
      var react = require('./react.js'); // then require module when it's available
    });
</script>
```

### Express middleware
```javascript
var fractal = require('fractaljs');
fractal.config().assetPath = path.resolve(__dirname, './client');
app.use('/assets/*', fractal.middleware);
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
- get rid of mutable config
- bulding bundles for prod
