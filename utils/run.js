var corbu = require('../index');
var path = require('path');
var log = require('printit')({ prefix: 'utils/run', date: true });
var childprocess = require('child_process');

function once(fn) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    };
}

module.exports = function (options, callback) {
    var env = options.env || process.env;
    var localBins = path.join(__dirname, 'node_modules', '.bin');

    var shouldOutput = corbu.debug || !options.silent;
    var node010 = process.version.match(/v0\.10/);
    var pipeMode = node010 ? 'pipe' : 'inherit';
    var stdout = !shouldOutput ? 'ignore' : pipeMode;
    var stderr = [];

    var child = null;
    if (corbu.debug) {
        log.info('RUN', options.command, options.args.join(' '), '\n');
    }
    env.PATH = localBins + ';' + (env.PATH || '');
    callback = once(callback);
    child = childprocess.spawn(options.command, options.args, {
        cwd: options.cwd || process.cwd(),
        env: env,
        stdio: [
            'ignore',
            stdout,
            'pipe',
        ],

    });
    if (stdout === 'pipe') child.stdout.pipe(process.stdout);
    child.stderr.on('data', stderr.push.bind(stderr));
    child.on('error', function (err) {
        callback(err);
    });
    child.on('exit', function (code) {
        var err;
        if (code !== 0) {
            err = new Error(options.command + ' terminated with' +
                ' non-zero code code (' + code + '): ' +
                Buffer.concat(stderr).toString('utf8'));
            err.code = code;
            callback(err);
        } else if (stderr.length) {
            err = new Error(options.command + ' wrote to stderr:' +
                Buffer.concat(stderr).toString('utf8'));
            callback(err);
        } else {
            callback(null);
        }
    });

    return child;
};
