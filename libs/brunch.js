var corbu = require('../index');
var run = require('../utils/run')
var copy = require('./copy')
var BRUNCHCONF = require('path').join(__dirname, 'brunch-config.json');
var paths = require('./filepaths');

function brunch(clientfolder, callback){
    run({
        command: corbu.getDependencyBinary('brunch'),
        args: [corbu.watch ? 'watch' : 'build', clientfolder]
    }, callback);
}

module.exports = function(callback){
    brunch(paths.CLIENT, function(err) {
        if( err ) return callback(err);
        copy(paths.CLIENTPUBLIC, paths.BUILDCLIENTPUBLIC, callback)
    });
}
