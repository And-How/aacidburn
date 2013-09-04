// Configuration
var file = 'kate.json',
    name = 'acidburn';

// Load requirements
var Twit = require('twit'),
    fs = require('fs');

// Get our lines and how to get our lines
var lines = JSON.parse(fs.readFileSync(file, 'utf8')),
    len = lines.length;

function getLine() {
    var lineNo = Math.floor(Math.random() * (len + 1));
    return lines[lineNo];
}

// Nodejitsu doesn't give us cheap hosting any more, so Heroku for now.
// Setting up a web server for them.

var express = require("express");
var app = express();
app.use(express.logger());

app.get('/', function (req, res) {
    var body = getLine();
    res.send(body);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(name + " listening on " + port);
});

// Get Twitter Developer API info
var T = new Twit(require('./config.js'));

function postLine() {
    // Post the line
    T.post('statuses/update', {
        status: getLine()
    }, function (err, reply) {});
}

// Post once when we start the bot
postLine();

// Like all great bots, tweet every 15 minutes
setInterval(function () {
    try {
        postLine();
    } catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 15);
