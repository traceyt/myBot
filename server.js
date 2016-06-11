var botAppID = process.env.appID || "appID";
var botAppSecret = process.env.appSecret || 'appSecret';

var restify = require("restify");
var builder = require("botbuilder");

var bot = new builder.BotConnectorBot({ appID: botAppID, appSecret: botAppSecret });
bot.add("/", hello);

var server = restify.createServer({ name:"Bot Server" });


// log the url posted and then post the message
server.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url);
    next();
});

server.post('api/messages', bot.verifyBotFramework(), bot.listen());

server.listen(process.env.port || 3978, function() { 
    console.log('api listening at %s', server.url)
});



function hello(session) {
  session.send("Hello world!!!");
}
