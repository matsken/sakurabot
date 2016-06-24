var slack = require("@slack/client");
var Client = slack.RtmClient;
var EVENTS = slack.RTM_EVENTS;
var config = require("./config");
var Handler = require("./handler");

var apiToken = config.api_token;

var bot = new Client(apiToken);

var handler = Handler(bot);

bot.start();

bot.on(EVENTS.MESSAGE, function(data) {
	var type = data.type;
	if (type === "message") {
		var text = data.text;
		console.log(data);
		if (text === "記念日" || text.toLowerCase() === "anniversary") {
			handler.anniversary(data);
		} else if (text === "誕生日" || text.toLowerCase() === "birthday") {
			handler.birthday(data);
		} else if (text.indexOf("疲れた") > -1) {
			handler.tired(data);
		} else if (text === "天気" || text.toLowerCase() === "weather") {
			handler.weather(data);
		}
	}
});