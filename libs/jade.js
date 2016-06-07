var path = require('path')
var paths = require('./filepaths')
var corbu = require('../index');
var run = require('../utils/run')

function jade(source, dest, callback){
    //  jade2commonjs needs relative path
    dest = path.relative(process.cwd(), dest);
    run({
        command: corbu.getDependencyBinary('jade2commonjs'),
        args: ['--no-debug', source, '--out', dest],
        silent: !corbu.debug
    }, callback)
}

module.exports = function(callback){
    jade(paths.SERVERVIEWS, paths.BUILDSERVERVIEWS, callback)
}
