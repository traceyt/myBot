var botAppID = process.env.BOT_APP_ID || "appID";
var botAppSecret = process.env.BOT_APP_SECRET || 'appSecret';

var assert = require("assert");
var http = require("http")
var restify = require("restify");
var builder = require("botbuilder");

var senderName = '';

var bot = new builder.BotConnectorBot({ appID: botAppID, appSecret: botAppSecret });
bot.add("/", hello);

var server = restify.createServer({ name:"Bot Server" });
server.use(restify.bodyParser());

// log the url posted and then post the message
server.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url + ' ' + req.username + ' ' + req.body.text);
    console.log(req.params);
    senderName = req.params.from.name;
    next();
});

server.post('api/messages', bot.verifyBotFramework({ appId: botAppID, appSecret: botAppSecret}), bot.listen());

server.listen(process.env.port || 3978, function() { 
    console.log('api listening at %s', server.url)
});



function hello(session) {
  qotd(session);
}

function qotd(session) {
    var client = restify.createJsonClient( {
        url: "http://quotes.rest",
        version: "*"
    });

    client.get("/qod.json?category=inspire", function(err, req, res, jsonObj) {
        if (err) {
            session.send("Sorry " + senderName + "\n" + err.restCode + ' ' + err.message);
            return;
        }

        var today = new Date().toDateString();
        console.log(res.body);
                
        session.send( 'Hello ' + senderName + '! \n' + 
            jsonObj.contents.quotes[0].quote + "\n" + jbody.contents.quotes[0].author + "\n\n" +
            "Famous Quotes. Quotes.net. STANDS4 LLC, 2016. Web. " + today + "\n" + " <http://www.quotes.net/>." );
    });
}