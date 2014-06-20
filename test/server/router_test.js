var router = require('../../src/server/router.js'),
    expect = require('chai').expect;

describe('server/router.js', function() {
    describe('#lookup', function() {
        it('looks up `/assets/` route', function() {
            var path = '/assets/my_asset.js',
                result = router.lookup(path);
            expect(result.args).to.eql(['my_asset.js']);
            expect(result.fn).to.be.a('Function');
        });

        it('looks up `/get_asset_list/` route', function() {
            var path = '/get_asset_list/my_asset.js',
                result = router.lookup(path);
            expect(result.args).to.eql(['my_asset.js']);
            expect(result.fn).to.be.a('Function');
        });

        it('looks up `/get_build/` route', function() {
            var path = '/get_build/my_asset.js',
                result = router.lookup(path);
            expect(result.args).to.eql(['my_asset.js']);
            expect(result.fn).to.be.a('Function');
        });
    });

    describe('#exec', function() {
        it('invokes route function', function() {
            var result = {
                fn: this.sandbox.spy(),
                args: 'test'
            };
            this.sandbox.stub(router, 'lookup').returns(result);
            router.exec('/assets/path.js', 'req', 'res');
            expect(result.fn).to.have.been.calledWith('req', 'res', 'test');
        });
    });
});
