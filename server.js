var botAppID = process.env.BOT_APP_ID || "appID";
var botAppSecret = process.env.BOT_APP_SECRET || 'appSecret';

var http = require("http")
var restify = require("restify");
var builder = require("botbuilder");

var bot = new builder.BotConnectorBot({ appID: botAppID, appSecret: botAppSecret });
bot.add("/", hello);

var server = restify.createServer({ name:"Bot Server" });
server.use(restify.bodyParser());

// log the url posted and then post the message
server.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url + ' ' + req.username + ' ' + req.body.text);
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
    var client = restify.createClient( {
        url: "http://quotes.rest"
    });

    client.get("/qod.json?category=inspire", function(err, req) {
        //assert.ifError(err); // connection error
        req.on('result', function(err, res) {
            //assert.ifError(err); // http status code >= 400

            res.body = "";
            res.setEncoding("utf8");
            res.on('data', function(chunk) {
                res.body += chunk;
            });

            res.on('end', function() {
                var jbody = JSON.parse(res.body);
                console.log(res.body);
                session.send(jbody.contents.quotes[0].quote + "\n" + jbody.contents.quotes[0].author + "\n\n" +
                "Famous Quotes. Quotes.net. STANDS4 LLC, 2016. Web. 11 Jun 2016. <http://www.quotes.net/>." );
            });
        });

    });
}

