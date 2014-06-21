var Directive = require('../src/directive.js'),
    path = require('path'),
    config = require('../src/config.js'),
    expect = require('chai').expect;

describe('directive.js', function() {
    beforeEach(function() {
        this.path = path.resolve(__dirname, './fixtures/directive');
        this._assetPath = config.assetPath;
        config.assetPath = this.path;
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });


    describe('#filesToRequire', function() {
        it('returns assetNodes with {wrap: true} set', function(done) {
            var directive = new Directive(this.path, [
                'require', './file1.js', 'wrap_in_module'
            ]);
            directive.filesToRequire().then(function(list) {
                expect(list[0].relativePath()).to.equal('file1.js');
                expect(list[0].wrap).to.be.ok;
                done();
            }).catch(done);
        });

        it('returns the assetNodes', function(done) {
            var directive = new Directive(this.path, [
                'require', './file2.hamlc'
            ]);
            directive.filesToRequire().then(function(list) {
                expect(list[0].relativePath()).to.eql('file2.hamlc');
                expect(list[0].wrap).to.not.be.ok;
                done();
            }).catch(done);
        });
    });
});
