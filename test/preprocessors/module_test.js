var path = require('path'),
    config = require('../../src/config.js'),
    expect = require('chai').expect,
    modulePreprocessor = require('../../src/preprocessors/module.js');

describe('preprocessors/module.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = '/tmp/test';
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    it('wraps file in module', function() {
        var filePath = '/tmp/test/test.js',
            src = '1',
            result = modulePreprocessor(filePath, src);
        result.should.equal(
            "define(\"test.js\", function (exports, module) {\n1});"
        );
    });

    it('throws error if module path is invalid', function() {
        var filePath = '/tmp/"test/test.js',
            src = '1';
            expect(function() {
                modulePreprocessor(filePath, src);
            }).to.throw('module name');
    });

    describe('module names', function() {

        it('makes path relative if it is in root dir', function() {
            var filePath = '/tmp/test/test.js',
                src = '1',
                result = modulePreprocessor(filePath, src);
            result.should.contain("define(\"test.js\"");
        });

        it('makes path relative if it is in sub dir', function() {
            var filePath = '/tmp/test/subdir/test.js',
                src = '1',
                result = modulePreprocessor(filePath, src);
            result.should.contain("define(\"subdir/test.js\"");
        });

        it('makes path relative if it is in parent dir', function() {
            var filePath = '/tmp/test.js',
                src = '1',
                result = modulePreprocessor(filePath, src);
            result.should.contain("define(\"../test.js\"");
        });
    });
});
