var corbu = require('../index');
var paths = require('./filepaths');
var run = require('../utils/run')

function mocha(tests, callback){

    var env = {}
    for(var key in process.env) env[key] = process.env[key];
    if(!env['NODE_ENV']) env['NODE_ENV'] = 'test'
    if(!env['NAME']) env['NAME'] = corbu.appServerPackage.name
    if(!env['TOKEN']) env['TOKEN'] = 'apptoken'

    var args = [tests, '--reporter', 'spec', '--colors', '--bail',
                '--globals', 'setImmediate,clearImmediate',
                '--compilers', 'coffee:coffee-script/register',
                '--require', require.resolve('should')]

    run({
        command: corbu.getDependencyBinary('mocha'),
        args: args,
        env: env
    }, callback);

}

module.exports = function(callback){
    mocha(paths.TESTSFOLDER, callback);
}
