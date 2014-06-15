describe('general behavior', function () {
    describe('#define', function () {
        it('defines module', function () {
            define('module-name', function() {});
            define.modules['module-name'].should.be.ok;
        });
    });

    describe('#require', function () {
        it('requires module syncronously', function () {
            define('module-name', function (exports) {
                exports.testVal = 'test';
            });
            require('module-name').testVal.should.equal('test');
        });

        it('throws error if module is not defined', function () {
            expect(function () { require('nod-defined'); })
                .to.throw(/not found/);
        });
    });

    describe('#use', function () {
        it('requires module async if its defined', function (done) {
            define('test-module', function (exports) { exports.a = 'test'; } );
            use('test-module', function(module) {
                module.a.should.equal('test');
                done();
            });
        });
    });
});
