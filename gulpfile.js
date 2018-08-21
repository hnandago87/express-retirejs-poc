var gulp = require('gulp');
var watch = require('gulp-watch');
var nodemon = require('gulp-nodemon');
var inject = require('gulp-inject');
var livereload = require('gulp-livereload');
var c = require('ansi-colors');
var beeper = require('beeper');
var log = require('fancy-log');
var spawn = require('child_process').spawn;
var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
gulp.task('serve', ['watch'], function(){
  
  nodemon({
  script: 'index.js', // the app script
  watch: ['src/**/*.js'], // file to watch for reloading
  env: { 'PORT':3000 } })  // any environment variables
  .on('restart', function () {
    setTimeout(function() {livereload.changed();}, 1000);
    console.log('restarted!');
  });
});

gulp.task('watch',['retire'], function() {
  livereload.listen();

  gulp.watch('./src/**/*.js', ['reload']);
});
gulp.task('retire', function() {
    var child = spawn('retire', [], {cwd: process.cwd()});
    var child2  = spawn('nodejsscan',['-d /src -o JSON'],{cwd:process.cwd()});
    child.stdout.setEncoding('utf8');
    child2.stdout.setEncoding('utf8');
    child2.stdout.on('data', function(data){
        log("----------------------->nodejsscan<--------------------------")
        log(data);
    })
    child.stdout.on('data', function (data) {

        log("----------------------->RetireJS output<--------------------------")
        log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        log("----------------------->RetireJS error<--------------------------")
        console.error(c.red(data));
        beeper();
    });
});

gulp.task( 'default', [ 'serve' ] );