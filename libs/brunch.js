var corbu = require('../index');
var run = require('../utils/run');
var copy = require('./copy');
var paths = require('./filepaths');

function brunch(clientfolder, callback) {
    run({
        command: corbu.getDependencyBinary('brunch'),
        args: [corbu.doeswatch ? 'watch' : 'build', clientfolder],
    }, callback);
}

module.exports = function (callback) {
    brunch(paths.CLIENT, function (err) {
        if (err) {
            callback(err);
        } else {
            copy(paths.CLIENTPUBLIC, paths.BUILDCLIENTPUBLIC, callback);
        }
    });
};
