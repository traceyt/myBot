var botAppID = process.env.BOT_APP_ID || "appID";
var botAppSecret = process.env.BOT_APP_SECRET || 'appSecret';


var restify = require("restify");
var builder = require("botbuilder");

var bot = new builder.BotConnectorBot({ appID: botAppID, appSecret: botAppSecret });
bot.add("/", hello);

var server = restify.createServer({ name:"Bot Server" });
server.use(restify.authorizationParser());
server.use(restify.bodyParser());

// log the url posted and then post the message
server.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url);
    next();
});

server.post('api/messages', bot.verifyBotFramework({ appId: botAppID, appSecret: botAppSecret}), bot.listen());

server.listen(process.env.port || 3978, function() { 
    console.log('api listening at %s', server.url)
});



function hello(session) {
  session.send("Hello world!!!");
}
