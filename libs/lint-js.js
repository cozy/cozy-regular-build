var corbu = require('../index');
var path = require('path');
var glob = require('glob');
var run = require('../utils/run');
var paths = require('./filepaths');
var ESLINTCONF = path.resolve(__dirname, '..', 'configs', '.eslintrc.js');
var ESLINTIGNORE = path.resolve(__dirname, '..', 'configs', 'eslintignore');

var lintJS = function (files, callback) {
    run({
        command: corbu.getDependencyBinary('eslint'),
        args: ['--no-color', '--config', ESLINTCONF,
               '--no-ignore', '--ignore-path', ESLINTIGNORE].concat(files),
    }, callback);
};

module.exports = function (callback) {
    glob(paths.BUILDSERVER + '/**/*.js', function (err, results) {
        if (err) {
            callback(err);
        } else {
            results = results.filter(function (result) {
                return result.indexOf(paths.BUILDSERVERVIEWS) === -1;
            });
            lintJS(results, callback);
        }
    });
};
