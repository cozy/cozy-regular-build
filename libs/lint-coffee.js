var corbu = require('../index');
var async = require('async');
var paths = require('./filepaths');
var glob = require('glob');
var run = require('../utils/run');
var path = require('path');

function lintCoffee(files, callback) {
    var configFile = path.join(paths.CONFIGFILES, 'coffeelint.json');
    var coffeelintOptions = ['-f', configFile];
    run({
        command: corbu.getDependencyBinary('coffeelint'),
        args: coffeelintOptions.concat(files),
    }, callback);
}

module.exports = function (callback) {
    async.concat([
        paths.SERVER, paths.TESTSFOLDER,
    ], function (folder, next) {
        glob(folder + '/**/*.coffee', next);
    }, function (err, files) {
        lintCoffee(files, callback);
    });
};
