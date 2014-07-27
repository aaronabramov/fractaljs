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
    });

    describe('#resolve', function() {
        it('true', function() {
            expect(true).to.be.true;
        });
    });
});
