var corbu = require('../index');
var run = require('../utils/run');
var paths = require('./filepaths');

function coffee(source, dest, callback) {
    var args = ['--bare', '--map', '--output', dest, '--compile', source];
    if (corbu.doeswatch) args.push('--watch');

    run({
        command: corbu.getDependencyBinary('coffee'),
        args: args,
    }, callback);
}

module.exports = function (callback) {
    coffee(paths.SERVER, paths.BUILDSERVER, function (err) {
        if (err) {
            callback(err);
        } else {
            coffee(paths.SERVERFILE, paths.BUILD, callback);
        }
    });
};
