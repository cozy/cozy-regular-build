var join = require('path').join
var async = require('async')
var glob = require('glob')
var corbu = exports
var paths = require('./libs/filepaths');


corbu.setup = require('./libs/setup')
corbu.makeFolders = require('./libs/mkdirs')
corbu.pullLocales = require('./libs/transifex')
corbu.buildServerCoffee = require('./libs/coffee')
corbu.buildServerViews = require('./libs/jade')
corbu.buildClientBrunch = require('./libs/brunch')
corbu.buildClientWebpack = require('./libs/webpack')
corbu.lintCoffee = require('./libs/lint-coffee');
corbu.lintJS = require('./libs/lint-js');
corbu.test = require('./libs/mocha')
corbu.watch = require('./libs/watch')
corbu.travisBefore = require('./libs/travis-env').beforeTravis
corbu.stopDS = require('./libs/travis-env').stopDS
corbu.david = require('./libs/lint-dependencies')

try {
    corbu.appServerPackage = require(paths.SERVERPACKAGE)
} catch( err ){
    throw new Error('Cannot load ' + paths.SERVERPACKAGE + "\n" + err.stack)
}

var extendJSON = require('./libs/extend_json')
corbu.extendServerPackage = function(changes){
    corbu.appServerPackage = extendJSON(paths.SERVERPACKAGE, changes,
                                                        paths.SERVERPACKAGE);
}

corbu.getDependencyBinary = function(which){
    var folders = [path.join(__dirname, 'node_modules', '.bin')]
    .concat(process.env.PATH.split(':'))

    for(var i=0, l=folders.length; i<l; i++)
        if(fs.existsSync(path.join(folders[i], which)))
            return path.join(folders[i], which)

    var err = "Binary not found: " + which
    err += "From corbu at " + __dirname;
    err += "Searched in " + folders.join(', ');
    try{
        err += "require.resolve = " + require.resolve(which)
    } catch (error) {
        err += "require.resolve failed"
    }

    throw new Error(err);
}

var rimraf = require('rimraf');
corbu.clean = function(callback){
    async.series([
        function(callback){ rimraf(paths.BUILD, callback);},
        function(callback){ rimraf(paths.CLIENTPUBLIC, callback);}
    ], callback);
}

corbu.buildClient = function(callback){
    if(corbu.hasOption('--brunch')) corbu.buildClientBrunch(callback)
    else corbu.buildClientWebpack(callback);
}

var copy = require('./libs/copy');
corbu.copyAssets = function(callback){
    copy(paths.SERVERASSETS, paths.BUILDSERVERASSETS, callback);
}
corbu.copyLocales = function(callback){
    if(!fs.existsSync(paths.SERVERLOCALES)){
        var err = 'There is no server locales. '
        if(!corbu.hasOption('--same-locales')) err += 'Try --same-locales.'
        return callback(new Error(err));
    }
    copy(paths.SERVERLOCALES, paths.BUILDSERVERLOCALES, callback);
}
corbu.copyJavascript = function(callback){
    copy(paths.SERVER + '/**/*.js', paths.BUILDSERVER, callback);
}


corbu.buildServer = function(callback){
    async.series([
        corbu.buildServerCoffee,
        corbu.buildServerViews
    ], callback)
}

corbu.build = function(callback){
    async.series([
        corbu.clean,
        corbu.makeFolders,
        corbu.copyAssets,
        corbu.pullLocales,
        corbu.copyLocales,
        corbu.buildClient,
        corbu.buildServer
    ], callback)
}

corbu.lint = function(callback){
    async.series([
        corbu.clean,
        corbu.makeFolders,
        corbu.lintCoffee,
        corbu.buildClient,
        corbu.buildServer,
        corbu.lintJS,
        corbu.david,
        corbu.clean
    ], callback)
}

corbu.prepublish = function(callback){
    async.series([
        corbu.lint,
        corbu.build
    ], callback)
}


corbu.postinstallprepublish = function(callback){
    console.log("NPM triggers a prepublish after npm install" +
                ", corbu ignores it");
    callback(null)
}
