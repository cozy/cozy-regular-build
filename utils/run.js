var corbu = require('../index');

module.exports = function(options, callback){
    if(corbu.debug)
        console.log('RUN', options.command, options.args.join(' '), "\n")

    var child = require('child_process').spawn(options.command, options.args, {
        cwd: options.cwd || process.cwd(),
        env: options.env || process.env,
        stdio: [
            'ignore',
            options.silent && !corbu.debug ? 'ignore' : 'inherit',
            'pipe'
        ]

    })

    var stderr = []
    child.stderr.on('data', stderr.push.bind(stderr))

    child.on('exit', function(code){
        if(code != 0) {
            var err = new Error( options.command + 'terminated with' +
                'non-zero code code (' + code + '):' +
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
