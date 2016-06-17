var corbu = require('../index');
var async = require('async');
var paths = require('./filepaths');
var david = require('david')

function lintDependencies(packageJSON, callback){
    if(corbu.hasOption('--offline')) return callback(null);
    var manifest = require(packageJSON);
    var opts = {stable: true}
    david.getUpdatedDependencies(manifest, opts, function(err, deps){
        callback(null, deps);
    });
}

module.exports = function(callback){

    var packages = {
        server: path.join(paths.ROOT, 'package.json'),
        client: path.join(paths.CLIENT, 'package.json')
    }

    async.mapSeries(packages, lintDependencies, function(err, results){
        console.log("\n\n#### NPM UPDATES AVAILABLES ###");
        console.log("\n# SERVER")
        Object.keys(results.server).forEach(function(dep){
            console.log(dep + ": " + results.server[dep].required + " -> " +
                results.server[dep].stable);
        });
        console.log("\n# CLIENT")
        Object.keys(results.client).forEach(function(dep){
            console.log(dep + ": " + results.client[dep].required + " -> " +
                results.client[dep].stable);
        });
        console.log("\n")
        callback(null)
    });
}
