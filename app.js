var restify = require("restify");
var builder = require("botbuilder");

var bot = new builder.BotConnectorBot({ appid: "myBot", appSecret: "mySecret" });
bot.add("/", function(session) { session.send("Hello world!"); });

var server = restify.createServer("Bot Server");
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function() { console.log("%s listening to %s", server.name, server.url)});