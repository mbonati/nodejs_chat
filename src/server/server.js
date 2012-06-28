console.log("Chat server initializing...");

var connect = require("connect");
var app = require("express").createServer();
var cfg = require("./config").config;

var httpPort = cfg.get("http:port");
var useSSL = cfg.get("http:useSSL");

//Setup the app
app.use(connect.logger());

//Start the server
app.listen(httpPort);
console.log("Chat server is listening at port: " + httpPort + " (useSSL="+useSSL+")");




