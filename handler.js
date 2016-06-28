var slack = require("@slack/client");
var EVENTS = slack.RTM_EVENTS;
var config = require("./config");

var rules = require("./rules");

var handler = {
	init: function(bot) {
		bot.on(EVENTS.MESSAGE, function(data) {
			console.log(data);
			rules.forEach(rule => {
				if (rule.condition(data)) {
					rule.action(data, bot);
				}
			});
		});
	}
}

module.exports = handler;