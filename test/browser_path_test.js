var expect = require('chai').expect;
var browserPath = require('../src/browser_path.js');

describe.only('./browser_path.js', function() {
    describe('#dirname', function() {
        it('returns dirname of file', function() {
            expect(browserPath.dirname('../abc/a.js')).to.equal('../abc/');
        });

        it('returns dirname of file without ext', function() {
            expect(browserPath.dirname('../abc/a')).to.equal('../abc/');
        });

        it('returns ./ for ./abc ', function() {
            expect(browserPath.dirname('./abc')).to.equal('./');
        });

        it('returns ../ for ../abc ', function() {
            expect(browserPath.dirname('../abc')).to.equal('../');
        });

        it('throws for empty string', function() {
            expect(function() {
                browserPath.dirname('');
            }).to.throw('argument');
        });
    });

    describe('#splitPath', function() {
        it('splits path into parts', function() {
            var res = browserPath.splitPath('./../a/b/./c.js');
            expect(res).to.eql(['.', '..', 'a', 'b', '.', 'c.js']);
        });

    });

    describe('#resolve', function() {
        it('resolves to the given relative root', function() {
            var dirname = './a/b/c/';
            var res = browserPath.resolve(dirname, '../../d.js');
            expect(res).to.equal('./a/d.js');
        });

        it('resolves to relative root', function() {
            var dirname = './a/';
            expect(browserPath.resolve(dirname, '../d.js'))
                .to.equal('./d.js');
        });

        it('resolves to files above the root', function() {
            var dirname = './a/';
            expect(browserPath.resolve(dirname, '../../d.js'))
                .to.equal('../d.js');
            expect(browserPath.resolve(dirname, '../../../d.js'))
                .to.equal('../../d.js');
        });

        it('resolves relative to relative', function() {
            var dirname = './components/';
            expect(browserPath.resolve(dirname, './included_in_nested_bundle2.js'))
                .to.equal('./components/included_in_nested_bundle2.js');
        });

        it('resolves from above root', function() {
            var dirname = '../node_modules/react/';
            expect(browserPath.resolve(dirname, './lib/React'))
                .to.equal('../node_modules/react/lib/React');
        });
    });
});
