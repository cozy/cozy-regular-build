var forever = require('forever');
var resolve = require('path').resolve;
var join = require('path').join;
var logs = join(__dirname, '..', 'tmp');
var run = require('../utils/run');
var corbu = require('../index');
var async = require('async');

var ds = join(require.resolve('cozy-data-system'), '../..');
var logFile = resolve(logs, 'forever-ds.log');

exports.startDS = function (callback) {
    forever.startDaemon(ds, {
        silent: true,
        cwd: ds,
        env: { NAME: 'data-system', TOKEN: 'token' },
        isCorbuDS: true,
        logFile: logFile,
        outFile: resolve(logs, 'forever-ds-stdout.log'),
        errFile: resolve(logs, 'forever-ds-stderr.log'),
    });
    setTimeout(callback, 5000); // let DS start
};

exports.stopDS = function (callback) {
    forever.list(false, function (err, processes) {
        if (err) {
            callback(err);
        } else if (!processes) {
            callback(null);
        } else {
            processes.forEach(function (proc, index) {
                if (proc.logFile === logFile) forever.stop(index);
            });
            callback(null);
        }
    });
};

exports.registerTestApp = function (callback) {
    // @TODO make this an HTTP API
    // commands.coffee expect to run from one level down
    var commandsFile = resolve(ds, 'commands.coffee');
    var appname = corbu.appServerPackage.name;
    run({
        command: corbu.getDependencyBinary('coffee'),
        args: [commandsFile, 'test-install', appname, './package.json'],
    }, callback);
};

exports.beforeTravis = function (callback) {
    async.series([
        exports.stopDS,
        exports.startDS,
        exports.registerTestApp,
    ], callback);
};
