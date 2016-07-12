var corbu = require('../index');
var paths = require('./filepaths');
var run = require('../utils/run');
var copy = require('./copy');

function pull(callback) {
    if (corbu.hasOption('--offline')) {
        callback(null);
    } else {
        run({
            command: 'tx',
            args: ['pull'],
        }, function () {
            callback(null); // tx always write to sderr, bad tx !
        });
    }
}

module.exports = function (callback) {
    pull(function (err) {
        if (err) {
            callback(err);
        } else if (corbu.hasOption('--same-locales')) {
            copy(paths.CLIENTLOCALES, paths.SERVERLOCALES, callback);
        } else {
            callback(null);
        }
    });
};
