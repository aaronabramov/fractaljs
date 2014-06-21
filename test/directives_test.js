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
            _this.subject = new Directives({
                path: _this.filePath,
                content: data.toString()
            });
            done();
        });
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('constructor', function() {
        it('parses directives', function() {
            expect(this.subject.directives.length).to.equal(7);
        });
    });

    describe('#filesToRequire', function() {
        it('returns list of files to require', function(done) {
            try {
                this.subject.filesToRequire().then(function(list) {
                    expect(list[0].path).to.contain('async_require.js');
                    expect(list[1].path).to.contain('index.js');
                    expect(list[2].path).to.contain('module1.js');
                    expect(list[3].path).to.contain('tree/file1.js');
                    expect(list[4].path).to.contain('tree/subdir/subdir_file1.hamlc');
                    expect(list[5].path).to.contain('directory/file1.coffee');
                    expect(list[6].path).to.contain('directory/file1.js');
                    done();
                }).fail(function(err) {
                    done(err);
                });
            } catch (err) {
                done(err);
            }
        });
    });

    describe('#_getDirectivesByType', function() {
        it('returns directives of `require` type', function() {
            this.subject._getDirectivesByType('require').forEach(function(d) {
                expect(d.type).to.equal('require');
            });
        });

        it('returns directives of `require_tree` type', function() {
            this.subject._getDirectivesByType('require_tree').forEach(function(d) {
                expect(d.type).to.equal('require_tree');
            });
        });

        it('returns directives of `require_directory` type', function() {
            this.subject._getDirectivesByType('require_directory').forEach(function(d) {
                expect(d.type).to.equal('require_directory');
            });
        });

        it('returns directives of `exclude` type', function() {
            this.subject._getDirectivesByType('exclude').forEach(function(d) {
                expect(d.type).to.equal('exclude');
            });
        });

        it('returns directives of `require_self` type', function() {
            this.subject._getDirectivesByType('require_self').forEach(function(d) {
                expect(d.type).to.equal('require_self');
            });
        });

        it('returns directives of `require_lib` type', function() {
            this.subject._getDirectivesByType('require_lib').forEach(function(d) {
                expect(d.type).to.equal('require_lib');
            });
        });
    });
});
