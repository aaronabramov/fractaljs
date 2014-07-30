describe('path resolving', function() {
    describe('#dirname', function() {
        var dirname = require.dirname;

        it('returns dirname of file', function() {
            expect(dirname('../abc/a.js')).to.equal('../abc/');
        });

        it('returns dirname of file without ext', function() {
            expect(dirname('../abc/a')).to.equal('../abc/');
        });

        it('returns ./ for ./abc ', function() {
            expect(dirname('./abc')).to.equal('./');
        });

        it('returns ../ for ../abc ', function() {
            expect(dirname('../abc')).to.equal('../');
        });

        it('throws for empty string', function() {
            expect(function() {
                dirname('');
            }).to.throw('argument');
        });
    });

    describe('#splitPath', function() {
        var splitPath = require.splitPath;

        it('splits path into parts', function() {
            var res = splitPath('./../a/b/./c.js');
            expect(res).to.eql(['.', '..', 'a', 'b', '.', 'c.js']);
        });

    });

    describe('#resolvePath', function() {
        var resolvePath = require.resolvePath;

        it('resolves to the given relative root', function() {
            var dirname = './a/b/c/';
            var res = resolvePath(dirname, '../../d.js');
            expect(res).to.equal('./a/d.js');
        });

        it('resolves to relative root', function() {
            var dirname = './a/';
            expect(resolvePath(dirname, '../d.js'))
                .to.equal('./d.js');
        });

        it('resolves to files above the root', function() {
            var dirname = './a/';
            expect(resolvePath(dirname, '../../d.js'))
                .to.equal('../d.js');
            // expect(resolvePath(dirname, '../../../d.js'))
            //     .to.equal('../../d.js');
        });

        it('resolves relative to relative', function() {
            var dirname = './components/';
            expect(resolvePath(dirname, './included_in_nested_bundle2.js'))
                .to.equal('./components/included_in_nested_bundle2.js');
        });

        it('resolves from above root', function() {
            var dirname = '../node_modules/react/';
            expect(resolvePath(dirname, './lib/React'))
                .to.equal('../node_modules/react/lib/React');
        });
    });
});
