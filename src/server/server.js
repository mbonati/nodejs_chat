console.log("Chat server initializing...");

//Imports
var connect = require("connect"),
    express = require("express"),
	everyauth = require('everyauth');
var cfg = require("./config").config;

// export to global for jade templates
GLOBAL.everyauth = everyauth;

//Create the main server
var app = express.createServer(
 // express.bodyParser()
 //  , express.static(__dirname + "/public")
 //  , express.cookieParser()
 //  , express.session({ secret: "deepp blue",  svc_id: "nodejs_chat_svc", cookie:{maxAge:sessionMaxAge} })
 //  , everyauth.middleware()
);


//Get the config params
var httpPort = cfg.get("http:port");
var useSSL = cfg.get("http:useSSL");
var sessionMaxAge = cfg.get("session:maxAge");
var viewsPath = __dirname + '/views';


//Setup the modules
everyauth.debug = true;
everyauth
  .password
    // .loginWith('email')
    .loginWith('login')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })

    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async Register'
        });
      }, 200);
    })
    .extractExtraRegistrationParams( function (req) {
      return {
          email: req.body.email
      };
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = newUserAttrs;
    })

    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');




//everyauth.helpExpress is being deprecated. helpExpress is now automatically invoked when it detects express.
// WARN: to use this feature it must be an express3 version of the everyauth lib:
// npm install everyauth@git://github.com/bnoguchi/everyauth.git#express3
//everyauth.helpExpress(app);

//Configure environments
app.configure(function(){
	//Setup the app
	app.use(connect.logger());
	app.use(express.cookieParser());
	app.use(everyauth.middleware());
	app.use(express.session({ secret: "deepp blue",  svc_id: "nodejs_chat_svc", cookie:{maxAge:sessionMaxAge} }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('views', viewsPath);
	app.set('view engine', 'jade');
});
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
// app.get('/', function(req, res){
// 	var session = req.session;
// 	if (session.counter){
// 		session.counter++;
// 	} else {
// 		session.counter = 1;
// 	}
// 	console.log(session.counter +" visits for Session: "+ req.session);
//   res.send('hello world ' + session.counter + ". Expires in "+(session.cookie.maxAge / 1000)+" sec.");
// });

var usersByLogin = {
  'jim': {
      login: 'jim',
      email: 'jim@jimpick.com'
    , password: 'jim'
  }
};

app.get('/', function (req, res) {
  res.render('index', { users: JSON.stringify(usersByLogin, null, 2) } );
});

app.get('/private', function(req, res){
    /*console.log(req.session);*/
    if(req.session.auth && req.session.auth.loggedIn){
      res.render('private', {title: 'Protected'});
    }else{
      console.log("The user is NOT logged in");
      /*console.log(req.session);*/
      res.redirect('/');
    }
});


