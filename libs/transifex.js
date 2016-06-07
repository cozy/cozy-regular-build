var path = require('path')
var corbu = require('../index');
var exec = require('child_process').exec
var paths = require('./filepaths')
var run = require('../utils/run')
var copy = require('./copy')

function pull(callback){
    if(corbu.hasOption('--offline')) return callback(null);
    run({
        command: 'tx',
        args: ['pull']
    }, function(){
        callback(null) // tx always write to sderr, bad tx !
    })
}

module.exports = function(callback){
    pull(function(err){
        if (err) return callback(err);
        if(corbu.hasOption('--same-locales')){
            copy(paths.CLIENTLOCALES, paths.SERVERLOCALES, callback)
        }else{
            callback(null);
        }
    })
}
