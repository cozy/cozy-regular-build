var async = require('async');
var corbu = exports;
var path = require('path');
var fs = require('fs');
var paths = require('./libs/filepaths');
var extendJSON = require('./libs/extend_json');
var rimraf = require('rimraf');
var copy = require('./libs/copy');
var log = require('printit')({ prefix: 'corbu:index', date: true });


corbu.setup = require('./libs/setup');
corbu.makeFolders = require('./libs/mkdirs');
corbu.pullLocales = require('./libs/transifex');
corbu.buildServerCoffee = require('./libs/coffee');
corbu.buildServerViews = require('./libs/jade');
corbu.buildClientBrunch = require('./libs/brunch');
corbu.buildClientWebpack = require('./libs/webpack');
corbu.lintCoffee = require('./libs/lint-coffee');
corbu.lintJS = require('./libs/lint-js');
corbu.test = require('./libs/mocha');
corbu.watch = require('./libs/watch');
corbu.travisBefore = require('./libs/travis-env').beforeTravis;
corbu.stopDS = require('./libs/travis-env').stopDS;
corbu.david = require('./libs/lint-dependencies');

try {
    /* eslint global-require: "off"*/
    corbu.appServerPackage = require(paths.SERVERPACKAGE);
} catch (err) {
    throw new Error('Cannot load ' + paths.SERVERPACKAGE + '\n' + err.stack);
}

corbu.extendServerPackage = function (changes) {
    corbu.appServerPackage = extendJSON(paths.SERVERPACKAGE, changes,
                                                        paths.SERVERPACKAGE);
};

corbu.getDependencyBinary = function (which) {
    var folders = [path.join(__dirname, 'node_modules', '.bin')]
    .concat(process.env.PATH.split(':'));
    var i = 0;
    var l = folders.length;
    var err;
    for (; i < l; i++) {
        if (fs.existsSync(path.join(folders[i], which))) {
            return path.join(folders[i], which);
        }
    }

    err = 'Binary not found: ' + which;
    err += 'From corbu at ' + __dirname;
    err += 'Searched in ' + folders.join(', ');
    try {
        err += 'require.resolve = ' + require.resolve(which);
    } catch (error) {
        err += 'require.resolve failed';
    }

    throw new Error(err);
};

corbu.clean = function (callback) {
    async.series([
        function (callback) { rimraf(paths.BUILD, callback); },
        function (callback) { rimraf(paths.CLIENTPUBLIC, callback); },
    ], callback);
};

corbu.buildClient = function (callback) {
    if (corbu.hasOption('--brunch')) corbu.buildClientBrunch(callback);
    else corbu.buildClientWebpack(callback);
};

corbu.copyAssets = function (callback) {
    if (!fs.existsSync(paths.SERVERASSETS)) {
        callback(null);
    } else {
        copy(paths.SERVERASSETS, paths.BUILDSERVERASSETS, callback);
    }
};
corbu.copyLocales = function (callback) {
    var err;
    if (!fs.existsSync(paths.SERVERLOCALES)) {
        err = 'There is no server locales. ';
        if (!corbu.hasOption('--same-locales')) err += 'Try --same-locales.';
        callback(new Error(err));
    } else {
        copy(paths.SERVERLOCALES, paths.BUILDSERVERLOCALES, callback);
    }
};
corbu.copyJavascript = function (callback) {
    copy(paths.SERVER + '/**/*.js', paths.BUILDSERVER, callback);
};


corbu.buildServer = function (callback) {
    async.series([
        corbu.buildServerCoffee,
        corbu.buildServerViews,
    ], callback);
};

corbu.build = function (callback) {
    async.series([
        corbu.clean,
        corbu.makeFolders,
        corbu.copyAssets,
        corbu.pullLocales,
        corbu.copyLocales,
        corbu.buildClient,
        corbu.buildServer,
    ], callback);
};

corbu.lint = function (callback) {
    async.series([
        corbu.clean,
        corbu.makeFolders,
        corbu.lintCoffee,
        corbu.buildClient,
        corbu.buildServer,
        corbu.lintJS,
        corbu.david,
        corbu.clean,
    ], callback);
};

corbu.prepublish = function (callback) {
    async.series([
        corbu.lint,
        corbu.build,
    ], callback);
};


corbu.postinstallprepublish = function (callback) {
    log.info('NPM triggers a prepublish after npm install' +
    ', corbu ignores it');
    callback(null);
};
