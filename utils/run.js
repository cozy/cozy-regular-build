var corbu = require('../index');
var path = require('path')

once = function(fn){
    var called = false
    return function(){
        if(!called){
            called = true;
            fn.apply(this, arguments);
        }
    }
}

module.exports = function(options, callback){
    if(corbu.debug)
        console.log('RUN', options.command, options.args.join(' '), "\n")

    callback = once(callback);

    var env = options.env || process.env
    var localBins = path.join(__dirname, 'node_modules', '.bin')
    env.PATH = localBins + ";" + (env.PATH || "")

    var shouldOutput = corbu.debug || !options.silent
    var node010 = process.version.match(/v0\.10/)
    var stdout = !shouldOutput ? 'ignore' : node010 ? 'pipe' : 'inherit'

    var child = require('child_process').spawn(options.command, options.args, {
        cwd: options.cwd || process.cwd(),
        env: env,
        stdio: [
            'ignore',
             stdout,
            'pipe'
        ]

    })

    if(stdout === 'pipe') child.stdout.pipe(process.stdout)

    var stderr = []
    child.stderr.on('data', stderr.push.bind(stderr))

    child.on('error', function(err){
        callback(err);
    });

    child.on('exit', function(code){
        if(code != 0) {
            var err = new Error( options.command + ' terminated with' +
                ' non-zero code code (' + code + '): ' +
                Buffer.concat(stderr).toString('utf8'));
            err.code = code
            callback(err);
        } else if (stderr.length){
            var err = new Error( options.command + ' wrote to stderr:' +
                Buffer.concat(stderr).toString('utf8'));
            callback(err);
        } else {
            callback(null);
        }
    });

    return child;

}
