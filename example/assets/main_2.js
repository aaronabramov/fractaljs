define('main_2', function(exports) {
    var main = requireSync('main');
    console.log(main.value);
});

requireSync('main_2');
