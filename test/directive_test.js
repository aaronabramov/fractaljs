var Directive = require('../src/directive.js'),
    path = require('path'),
    expect = require('chai').expect;

describe('directive.js', function() {
    beforeEach(function() {
        this.path = path.resolve(__dirname, './fixtures/directive');
    });

    describe('#filesToRequire', function() {
        it('returns the list with {wrap: true} set', function(done) {
            var directive = new Directive(this.path, [
                'require', './file1.js', 'wrap_in_module'
            ]);
            directive.filesToRequire().then(function(list) {
                expect(list).to.eql([{path: './file1.js', wrap: true}]);
                done();
            }).catch(done);
        });

        it('returns the list with', function(done) {
            var directive = new Directive(this.path, [
                'require', './file2.hamlc'
            ]);
            directive.filesToRequire().then(function(list) {
                expect(list).to.eql([{path: './file2.hamlc'}]);
                done();
            }).catch(done);
        });
    });
});
