var mkdirp = require('mkdirp');
var corbu = require('../index')
var async = require('async');
var paths = require('./filepaths')

function mkdirs(dirs, callback){
    async.eachSeries(dirs, function mkdir(dir, next){
        if(corbu.debug) console.log('MKDIR', dir);
        mkdirp(dir, next);
    }, callback);
}

module.exports = function(callback){
    mkdirs([
        paths.CLIENTPUBLIC,
        paths.BUILD,
        paths.BUILDCLIENT,
        paths.BUILDSERVER,
        paths.BUILDSERVERVIEWS,
    ], callback);
}
