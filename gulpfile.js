var gulp = require('gulp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

gulp.task('start-emu'), function (callback) {
    //exec('ps $env:LocalAppData\botframework\Update.exe --processStart "botframework-emulator.exe"', function (err, stdout, stderr) {
    //    console.log(stdout);
    //    console.log(stderr);
    //    callback(err);});

   child = spawn("powershell.exe",['$env:LocalAppData\botframework\Update.exe --processStart "botframework-emulator.exe"']);
   child.stdout.on("data",function(data){
    console.log("Powershell Data: " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
    console.log("Powershell Script finished");
});
child.stdin.end(); //end input
}