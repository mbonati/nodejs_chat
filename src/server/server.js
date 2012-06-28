console.log("Chat server initializing...");

var connect = require("connect");
var express = require("express");
var cfg = require("./config").config;
var app = express.createServer();

var httpPort = cfg.get("http:port");
var useSSL = cfg.get("http:useSSL");

//Setup the app
app.use(connect.logger());
app.use(express.cookieParser());
app.use(express.session({ secret: "deepp blue",  svc_id: "nodejs_chat_svc" }));

//Start the server
app.listen(httpPort);
console.log("Chat server is listening at port: " + httpPort + " (useSSL="+useSSL+")");


//Routing
app.get('/', function(req, res){
	console.log("Session: "+ req.session);
  res.send('hello world');
});


