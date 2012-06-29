console.log("Chat server initializing...");

//Imports
var connect = require("connect");
var express = require("express");
var everyauth = require('everyauth');
var cfg = require("./config").config;

//Create the main server
var app = express.createServer();


//Get the config params
var httpPort = cfg.get("http:port");
var useSSL = cfg.get("http:useSSL");
var sessionMaxAge = cfg.get("session:maxAge");
var viewsPath = __dirname + '/views';


//Setup the app
app.use(connect.logger());
app.use(express.cookieParser());
app.use(everyauth.middleware());
app.use(express.session({ secret: "deepp blue",  svc_id: "nodejs_chat_svc", cookie:{maxAge:sessionMaxAge} }));
app.use(express.bodyParser());
app.use(app.router);
app.set('views', viewsPath);
app.set('view engine', 'jade');

//Setup the modules
everyauth.debug = true;
//everyauth.helpExpress is being deprecated. helpExpress is now automatically invoked when it detects express.
// WARN: to use this feature it must be an express3 version of the everyauth lib:
// npm install everyauth@git://github.com/bnoguchi/everyauth.git#express3
//everyauth.helpExpress(app);

//Configure environments
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
});


//Start the server
app.listen(httpPort);
console.log("Chat server is listening at port: " + httpPort + " (useSSL="+useSSL+")");
console.log("Views path:"+viewsPath);


//Routing
app.get('/', function(req, res){
	var session = req.session;
	if (session.counter){
		session.counter++;
	} else {
		session.counter = 1;
	}
	console.log(session.counter +" visits for Session: "+ req.session);
  res.send('hello world ' + session.counter + ". Expires in "+(session.cookie.maxAge / 1000)+" sec.");
});

