var Directives = require('../src/directives.js'),
    config = require('../src/config.js'),
    fs = require('fs'),
    path = require('path'),
    expect = require('chai').expect;


describe('directives.js', function() {
    beforeEach(function(done) {
        var _this = this;
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures/directives');
        this.filePath = path.resolve(__dirname, './fixtures/directives/directives.js');
        fs.readFile(this.filePath, function(err, data) {
            _this.subject = new Directives(data.toString());
            done();
        });
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('constructor', function() {
        it('parses directives', function() {
            expect(this.subject.list).to.eql([
                ['require_lib'],
                ['require', './index.js'],
                ['require_self'],
                ['require', './module1.js', 'nowrap'],
                ['require_tree', './tree'],
                ['require_directory', './directory'],
                ['exclude', './exclude_file.js']
            ]);
        });
    });

    describe('#_getDirectivesByType', function() {
        it('returns directives of `require` type', function() {
            this.subject._getDirectivesByType('require').should.eql([
                ['require', './index.js'],
                ['require', './module1.js', 'nowrap'],
            ]);
        });

        it('returns directives of `require_tree` type', function() {
            this.subject._getDirectivesByType('require_tree').should.eql([
                ['require_tree', './tree']
            ]);
        });

        it('returns directives of `require_directory` type', function() {
            this.subject._getDirectivesByType('require_directory').should.eql([
                ['require_directory', './directory']
            ]);
        });

        it('returns directives of `exclude` type', function() {
            this.subject._getDirectivesByType('exclude').should.eql([
                ['exclude', './exclude_file.js']
            ]);
        });

        it('returns directives of `require_self` type', function() {
            this.subject._getDirectivesByType('require_self').should.eql([
                ['require_self']
            ]);
        });

        it('returns directives of `require_lib` type', function() {
            this.subject._getDirectivesByType('require_lib').should.eql([
                ['require_lib']
            ]);
        });
    });
});
