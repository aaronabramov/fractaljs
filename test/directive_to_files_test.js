var Directives = require('../src/directives.js'),
    directiveToFiles = require('../src/directive_to_files.js'),
    config = require('../src/config.js'),
    fs = require('fs'),
    path = require('path'),
    expect = require('chai').expect;


describe('directive_to_files.js', function() {
    beforeEach(function(done) {
        var _this = this;
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures/directives');
        this.filePath = path.resolve(__dirname, './fixtures/directives/directives.js');
        fs.readFile(this.filePath, function(err, data) {
            _this.directives = new Directives(this.filePath, data.toString());
            done();
        });
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#getFiles', function() {
        it('gets list of files for `require_directory`', function(done) {
            var directive = this.directives._getDirectivesByType('require_directory')[0];
            directiveToFiles.getFiles(this.filePath, directive).then(function(files) {
                try {
                    expect(files[0]).to.contain('directory/file1.coffee');
                    expect(files[1]).to.contain('directory/file1.js');
                    expect(files.length).to.equal(2);
                    done();
                } catch (err) { done(err); }
            }).fail(function(err) { done(err); });
        });
    });

    it('gets list of files for `require_tree`', function(done) {
        var directive = this.directives._getDirectivesByType('require_tree')[0];
        directiveToFiles.getFiles(this.filePath, directive).then(function(files) {
            try {
                expect(files[0]).to.contain('tree/file1.js');
                expect(files[1]).to.contain('tree/subdir/subdir_file1.hamlc');
                expect(files.length).to.equal(2);
                done();
            } catch (err) { done(err); }
        });
    });
});

