var exec = require('child_process').exec
var path = require('path')
var assert = require('assert')
var copy = require('../libs/copy')
var fs = require('fs')
var MIN = 60*1000
var TESTAPPINIT = path.join(__dirname, 'testapp-initial')
var TESTAPP = path.join(__dirname, 'testapp')


function assertFile(filename){
    assert(fs.existsSync(filename), filename + ' does not exist');
}

describe('Setup', function(){

    it('When I start with a clean app', function(done){
        copy(TESTAPPINIT, TESTAPP, done)
    })

    it('When corbu is installed globally', function(done){
        this.timeout(10*MIN);
        done(null);
        // exec('npm install --quiet --global .', {
        //     cwd: path.resolve(__dirname, '..')
        // }, function(err, stdout, stderr){
        //     console.log(stdout, stderr);
        //     done(err);
        // })
    })

    it('When corbu setup is invoked on a project.', function(done){
        this.timeout(4000)
        exec('corbu setup', {
            cwd: TESTAPP
        }, done)
    })

    it('Then dotFiles have been created', function(){
        assertFile(path.join(TESTAPP, '.gitignore'))
        assertFile(path.join(TESTAPP, '.npmignore'))
        assertFile(path.join(TESTAPP, '.editorconfig'))
        assertFile(path.join(TESTAPP, '.travis.yml'))
    })

    it('Then package.json has been updated', function(){
        var packageJSON = path.join(TESTAPP, 'package.json')
        packageJSON = JSON.parse(fs.readFileSync(packageJSON, 'utf8'))
        assert(packageJSON.dependencies['pug-runtime'], 'no pug-runtime dep')
        assert(packageJSON.scripts['start'], 'no start script')
        assert(packageJSON.scripts['build'], 'no build script')
        assert(packageJSON.scripts['lint'], 'no lint script')
        assert(packageJSON.scripts['watch'], 'no watch script')
    })

})
