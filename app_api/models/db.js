var mongoose = require('mongoose');
var readline = require('readline')

var dbURL = 'mongodb://127.0.0.1:27017/Loc8r';

mongoose.connect(dbURL);
mongoose.connection.on('connected',function(){
	console.log('mongoose connected to ' + dbURL);
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

if(process.platform == 'win32'){
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.on('SIGINT',function(){
		process.emit("SIGINT");
	});
}

var gracefulShutdown = function(msg,cb){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through'+msg);
		cb();
	})
}
// For app termination
process.on('SIGINT',function(){
	gracefulShutdown('app termination',function(){
		process.exit(0);
	});
});

process.once("SIGUSR2",function(){
	gracefulShutdown('nodemon restart',function(){
		process.kill(process.pid,'SIGUSR2');
	});
});
// BRING IN YOUR SCHEMAS & MODELS
require('./locations');