require('./setup')

var exec = require('child_process').exec
var path = require('path')
var assert = require('assert')
var fs = require('fs')
var http = require('http')
var MIN = 60*1000
var TESTAPP = path.join(__dirname, 'testapp')


describe('Build', function(){
    it('When `npm run build` is run.', function(done){
        exec('npm run build', {
            cwd: TESTAPP
        }, function(err, stdout, stderr){
            done(err);
        })
    });
})

describe('Lint', function(){
    it('When `npm run lint` is run.', function(done){
        exec('npm run lint', {
            cwd: TESTAPP
        }, function(err, stdout, stderr){
            done(err);
        })
    });
})

describe('Test', function(){
    it('When `npm run test` is run.', function(done){
        exec('npm run test', {
            cwd: TESTAPP
        }, function(err, stdout, stderr){
            done(err);
        })
    });
})

describe('Travis', function(){
    it('When `npm run travis-before` is run.', function(done){
        this.timeout(1*MIN)
        exec('npm run travis-before', {
            cwd: TESTAPP
        }, function(err, stdout, stderr){
            done(err);
        })
    });

    it('Then DS is listenning', function(done){
        http.get('http://localhost:9101/', function(res){
            res.resume()
            done(null);
        })
        .on('error', done);
    })
})
