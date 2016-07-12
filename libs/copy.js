var corbu = require('../index');
var fs = require('fs');
var exec = require('child_process').exec;
var log = require('printit')({ prefix: 'libs/copy', date: true });

function ensureNoDest(dest, callback) {
    var cmd = 'rm --recursive --force ' + dest;

    if (!fs.existsSync(dest)) {
        callback(null);
    } else {
        if (corbu.debug) log.info('RM   ' + dest + ' ' + cmd);
        exec(cmd, function (err, stdout, stderr) {
            if (corbu.debug) log.raw(stdout);
            if (!err && stderr && stderr.length > 0) err = new Error(stderr);
            callback(err);
        });
    }
}

module.exports = function (source, dest, callback) {
    ensureNoDest(dest, function (err) {
        var cmd = 'cp --recursive ';
        if (err) {
            callback(err);
        } else {
            cmd += ' ' + source + ' ' + dest;
            if (corbu.debug) {
                log.info('COPY ' + source + ' ' + dest + ' ' + cmd);
            }

            exec(cmd, function (err, stdout, stderr) {
                if (corbu.debug) log.raw(stdout);
                if (!err && stderr && stderr.length > 0) {
                    err = new Error(stderr);
                }
                callback(err);
            });
        }
    });
};
