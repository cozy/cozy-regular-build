var corbu = require('../index');
var copy = require('./copy');
var join = require('path').join
var run = require('../utils/run')
var async = require('async');
var corbuPackage = require('../package.json')
var JADERUNTIME        = 'pug-runtime'
var JADERUNTIMEVERSION = corbuPackage.dependencies[JADERUNTIME];

function copyDotFiles(callback){
    var dotFiles = ['.editorconfig', '.gitignore', '.npmignore', '.travis.yml']
    async.eachSeries(dotFiles, function(file, next){
        copy(join(paths.CONFIGFILES, 'std-' + file),
             join(paths.ROOT, file), next)
    }, callback);
}

function extendPackage(callback){
    var dependencies = {}
    dependencies[JADERUNTIME] = JADERUNTIMEVERSION
    corbu.extendServerPackage({
        "scripts": {
            "start": "node build/server.js",
            "lint": "use corbu",
            "build": "use corbu",
            "test": "use corbu",
            "watch": "use corbu",
            "prepublish": "use corbu",
            "travis-before": "use corbu",
            "travis-after": "use corbu",
            "tx": "tx pull --all || true"
        },
        "dev-dependencies":{
            "cozy-regular-build": require('../package.json').version,
        },
        "dependencies": dependencies
    });
    setImmediate(callback)
}

function promptManualSetup(callback){
    console.log('Get your NPM API Key from ~/.npmrc and run ',
    '`travis encrypt YOUR_API_KEY --add deploy.api_key` to ',
    'activate autodeploy');
    callback(null);
}

function setupAutopublish(callback){
    var npmrc = path.join(process.env.HOME, '.npmrc')
    npmrc = fs.readFileSync(npmrc, 'utf8')
    var token = npmrc.split('\n').filter(function(line){
        return line.indexOf('_authToken=') > -1
    })[0]
    if(!token) return promptManualSetup(callback);
    token = token.split('_authToken=')[1]
    var repo = corbu.appServerPackage.repository
    if(!repo)  return promptManualSetup(callback);
    repo = repo.url.replace('https://github.com/', '').replace('.git', '')

    run({
        command: 'travis',
        args: ['encrypt', token, '--add', 'deploy.api_key', '--repo', repo]
    }, callback)
}

module.exports = function(callback){
    async.series([
        corbu.clean,
        copyDotFiles,
        extendPackage,
        setupAutopublish
    ], function(err){
        if(err) return callback(err)
        console.log('Setup success !')
        callback(null)
    });
}
