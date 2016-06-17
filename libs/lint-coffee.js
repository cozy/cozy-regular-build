var corbu = require('../index');
var async = require('async');
var paths = require('./filepaths');
var glob = require('glob');
var run = require('../utils/run')

function lintCoffee(files, callback){
    coffeelintOptions = ['-f', path.join(paths.CONFIGFILES, 'coffeelint.json')]
    run({
        command: corbu.getDependencyBinary('coffeelint'),
        args: coffeelintOptions.concat(files)
    }, callback);
}

module.exports = function(callback){
    async.concat([
        paths.SERVER, paths.TESTSFOLDER
    ], function(folder, next){
        glob(folder + '/**/*.coffee', next);
    }, function(err, files){
        lintCoffee(files, callback);
    });
}
