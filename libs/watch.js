var corbu = require('../index');
var run = require('../utils/run');
var paths = require('./filepaths');
var ds = require('./travis-env');
var http = require('http');
var log = require('printit')({ prefix: 'libs/watch', date: true });
var nocallback = function () {};


function nodemon(files, callback) {
    run({
        command: corbu.getDependencyBinary('nodemon'),
        args: ['--debug', '--ignore', 'client/', 'server.coffee',
               '--ext', 'js,coffee,jade,json'],
    }, callback);
}

function ensureDS(callback) {
    http.get('http://localhost:9101/', function (res) {
        res.resume();
        callback(null);
    })
    .on('error', function () { // cant reach DS, start it
        log.info('Data-system unreachable, starting one');
        ds.startDS(callback);
    });
}

module.exports = function (callback) {
    if (!process.env.PORT) process.env.PORT = 9117;
    corbu.doeswatch = true;
    ensureDS(function (err) {
        if (err) {
            callback(err);
        } else {
            corbu.buildClient(nocallback);
            nodemon(paths.SERVER, nocallback);
        }
    });
};
