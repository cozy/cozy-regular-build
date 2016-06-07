var corbu = require('../index')
var run = require('../utils/run')
var paths = require('./filepaths')
var ds = require('./travis-env')
var jade = require('./jade')
var glob = require('glob');
var http = require('http');

function nodemon(files, callback){
    run({
        command: corbu.getDependencyBinary('nodemon'),
        args: ['--debug', '--ignore', 'client/', 'server.coffee',
               '--ext', 'js,coffee,jade,json']
    }, callback)
}

function ensureDS(callback){
    http.get('http://localhost:9101/', function(res){
        res.resume()
        callback(null);
    })
    .on('error', function(){ // cant reach DS, start it
        console.log('Data-system unreachable, starting one');
        ds.startDS(callback);
    })
}

var nocallback = function(){}
module.exports = function(callback){
    corbu.watch = true
    ensureDS(function(err){
        if(err) return callback(err);
        corbu.buildClient(nocallback);
        nodemon(paths.SERVER, nocallback);
    })
}
