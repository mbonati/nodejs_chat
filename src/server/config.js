var fs    = require('fs'),
    nconf = require('nconf');

nconf.argv()
       .env()
       .file({ file: './config.json' });



/*
nconf.set('database:host', '127.0.0.1');
nconf.set('database:port', 5984);
nconf.save(function (err) {
    fs.readFile('./config.json', function (err, data) {
      console.dir(JSON.parse(data.toString()))
    });
  });
*/

exports.config = nconf;
