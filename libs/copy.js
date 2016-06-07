var path = require('path')
var corbu = require('../index');
var exec = require('child_process').exec



ensureNoDest = function(dest, callback){
    if(!fs.existsSync(dest)) return callback(null);
    var cmd = 'rm --recursive --force ' + dest;
    if(corbu.debug) console.log('RM   ', dest, cmd);
    exec(cmd, function(err, stdout, stderr){
        if(corbu.debug) console.log(stdout);
        if(!err && stderr && stderr.length > 0) err = new Error(stderr);
        callback(err);
    });
}

module.exports = function(source, dest, callback){
    ensureNoDest(dest, function(err){
        if(err) return callback(err);
        var cmd = 'cp --recursive ';
        cmd += ' ' + source + ' ' + dest;
        if(corbu.debug) console.log('COPY ', source, dest, cmd);
        exec(cmd, function(err, stdout, stderr){
            if(corbu.debug) console.log(stdout);
            if(!err && stderr && stderr.length > 0) err = new Error(stderr);
            callback(err);
        });
    });
}
