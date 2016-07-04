var slack = require("@slack/client");
var Client = slack.RtmClient;
var EVENTS = slack.RTM_EVENTS;
var config = require("./config");
var rules = require("./rules");

var apiToken = config.api_token;

var bot = new Client(apiToken);

bot.on(EVENTS.MESSAGE, function(data) {
	console.log(data);
	rules.forEach(rule => {
		if (rule.condition(data)) {
			rule.action(data, bot);
		}
	});
});

bot.start();
bot.on(slack.CLIENT_EVENTS.RTM.AUTHENTICATED, function(data) {
	console.log("connected");
});
bot.on(slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function(data) {
	bot.sendMessage("Bot started and initialized", "C1KGES7L2");
	console.log("bot started");
});