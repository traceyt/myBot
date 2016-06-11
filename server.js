var botAppID = process.env.appID || "appID";
var botAppSecret = process.env.appSecret || 'appSecret';

var restify = require("restify");
var builder = require("botbuilder");

var bot = new builder.BotConnectorBot({ appID: botAppID, appSecret: botAppSecret });
bot.add("/", function(session) { session.send("Hello world!!!"); });

var server = restify.createServer({ name:"Bot Server" });
// server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
// server.listen(process.env.port || 3978, function() { console.log("%s listening to %s", server.name, server.url)});

server.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url);
});

server.use(restify.bodyParser());

server.post('api/messages', bot.verifyBotFramework(), bot.listen());

server.listen(process.env.port || 3978, function() { 
    console.log('api listening at %s', server.url)
});
