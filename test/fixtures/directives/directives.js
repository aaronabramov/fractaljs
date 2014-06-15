//= require_lib
//= require ./index.js
//= require_self
//= require ./module1.js nowrap
//= require_tree ./tree
//= require_directory ./directory
//= exclude ./exclude_file.js

(function() {
    console.log('directives');
})();
