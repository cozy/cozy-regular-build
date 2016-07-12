var corbu = require('../index');
var copy = require('./copy');
var join = require('path').join;
var run = require('../utils/run');
var fs = require('fs');
var path = require('path');
var async = require('async');
var paths = require('./filepaths');
var corbuPackage = require('../package.json');
var JADERUNTIME = 'pug-runtime';
var JADERUNTIMEVERSION = corbuPackage.dependencies[JADERUNTIME];
var log = require('printit')({ prefix: 'libs/copy', date: true });

function copyDotFiles(callback) {
    var dotFiles = ['.editorconfig', '.gitignore', '.npmignore', '.travis.yml'];
    async.eachSeries(dotFiles, function (file, next) {
        copy(join(paths.CONFIGFILES, 'std-' + file),
             join(paths.ROOT, file), next);
    }, callback);
}

function extendPackage(callback) {
    var dependencies = {};
    dependencies[JADERUNTIME] = JADERUNTIMEVERSION;
    corbu.extendServerPackage({
        scripts: {
            start: 'node build/server.js',
            lint: 'use corbu',
            build: 'use corbu',
            test: 'use corbu',
            watch: 'use corbu',
            prepublish: 'use corbu',
            'travis-before': 'use corbu',
            'travis-after': 'use corbu',
            tx: 'tx pull --all || true',
        },
        devDependencies: {
            'cozy-regular-build': corbuPackage.version,
        },
        dependencies: dependencies,
    });
    setImmediate(callback);
}

function promptManualSetup(callback) {
    log.warn('Get your NPM API Key from ~/.npmrc and run ',
    '`travis encrypt YOUR_API_KEY --add deploy.api_key` to ',
    'activate autodeploy');
    callback(null);
}

function lineIsAuthToken(line) {
    return line.indexOf('_authToken=') > -1;
}

function setupAutopublish(callback) {
    var token = null;
    var npmrc = path.join(process.env.HOME, '.npmrc');
    var repo = corbu.appServerPackage.repository;

    if (!token || !repo) {
        promptManualSetup(callback);
    } else {
        token = (fs.readFileSync(npmrc, 'utf8')
            .split('\n')
            .find(lineIsAuthToken) || '')
            .split('_authToken=')[1];
        repo = repo.url
            .replace('https://github.com/', '')
            .replace('.git', '');

        run({
            command: 'travis',
            args: ['encrypt', token, '--add', 'deploy.api_key', '--repo', repo],
        }, callback);
    }
}

module.exports = function (callback) {
    async.series([
        corbu.clean,
        copyDotFiles,
        extendPackage,
        setupAutopublish,
    ], callback);
};
