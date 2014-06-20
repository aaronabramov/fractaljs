var build = require('../src/build.js'),
    config = require('../src/config.js'),
    path = require('path'),
    expect = require('chai').expect;

xdescribe('build.js', function() {
    beforeEach(function() {
        this._assetPath = config.assetPath;
        config.assetPath = path.resolve(__dirname, './fixtures/build');
    });

    afterEach(function() {
        config.assetPath = this._assetPath;
    });

    describe('#build', function() {
        it('builds list of files with their compiled content', function(done) {
            build.build('./index.js').then(function(list) {
                try {
                    expect(list[0].path).to.contain('build/index.js');
                    expect(list[1].path).to.contain('async_require.js');
                    expect(list[2].path).to.contain('module1.js');
                    expect(list[3].path).to.contain('module1.hamlc');
                    expect(list[4].path).to.contain('module1.coffee');
                    list.forEach(function(file) {
                        expect(file.content).to.be.a('string');
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            }).fail(function(err) {
                done(err);
            });
        });
    });
});
