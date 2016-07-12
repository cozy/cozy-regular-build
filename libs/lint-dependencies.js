var corbu = require('../index');
var async = require('async');
var path = require('./path');
var paths = require('./filepaths');
var david = require('david');
var fs = require('fs');
var log = require('printit')({ prefix: 'libs/deps', date: true });

function lintDependencies(packageJSON, callback) {
    var manifest = JSON.parse(fs.readFileSync(packageJSON));
    var opts = { stable: true };
    if (corbu.hasOption('--offline')) {
        callback(null);
    } else {
        david.getUpdatedDependencies(manifest, opts, function (err, deps) {
            callback(null, deps);
        });
    }
}

module.exports = function (callback) {
    var packages = {
        server: path.join(paths.ROOT, 'package.json'),
        client: path.join(paths.CLIENT, 'package.json'),
    };

    async.mapSeries(packages, lintDependencies, function (err, results) {
        log.info('\n\n#### NPM UPDATES AVAILABLES ###');
        log.info('\n# SERVER');
        Object.keys(results.server).forEach(function (dep) {
            log.info(dep + ': ' + results.server[dep].required + ' -> ' +
                results.server[dep].stable);
        });
        log.info('\n# CLIENT');
        Object.keys(results.client).forEach(function (dep) {
            log.info(dep + ': ' + results.client[dep].required + ' -> ' +
                results.client[dep].stable);
        });
        log.info('\n');
        callback(null);
    });
};
