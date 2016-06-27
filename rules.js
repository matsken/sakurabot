var config = require("./config");

var rules = [{
	// 記念日
	condition: function(message) {
		var text = message.text;
		return message.type === "message" && (text === "記念日" || text.toLowerCase() === "anniversary");
	},
	action: function(message, bot) {
		var aniv = new Date(config.anniversary);
		var [d, h, m, s, ms] = getNextDiff(new Date(), aniv);
		
		bot.sendMessage("Due in " + d + " days " + h + "h" + m + "m" + s + "s", message.channel);
	}
}, {
	// 誕生日
	condition: function(message) {
		var text = message.text;
		return message.type === "message" && (text === "誕生日" || text.toLowerCase() === "birthday");
	},
	action: function(message) {
		var today = new Date();
		var text = config.birthdays.map(function(obj) {
			var bd = new Date(obj.date);
			
			var [d, h, m, s, ms] = getNextDiff(today, bd);
			return obj.name + ": in " + d + " days";
		}).join("\n");
		
		bot.sendMessage(text, message.channel);
	}
}, {
	// 天気
	condition: function(message) {
		var text = message.text;
		return message.type === "message" && (text === "天気" || text.toLowerCase() === "weather");
	},
	action: function(message) {
		config.weatherRSS.forEach(url => {
			var text, ep = [];
			http.get(url, function(res) {
			res.pipe(new FeedParser({})).on("error", function(e) {
					bot.sendMessage(e.toString(), message.channel);
				}).on("readable", function() {
					var stream = this, item;
					while (item = stream.read()) {
						ep.push(item);
					}
				}).on("end", function() {
					text = ep.map(item => {
						var date = new Date(item.pubDate);
						dateStr = date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
						return item.title + " (" + dateStr + ")";
					}).join("\n");
					bot.sendMessage(text, message.channel);
				});
			});
		});
	}
}, {
	// 疲れた
	condition: function(message) {
		var text = message.text;
		return message.type === "message" && text === "疲れた";
	},
	action: function(message) {
		bot.sendMessage("@matsken: お疲れの方がいるようです", message.channel);
	}
}, {
	condition: function(message) {
		return message.type === "message" && message.attachments && message.attachments[0] && message.attachments[0].pretext.indexOf("[sakurabot:master]") > -1;
	},
	action: function(message, bot) {
		bot.sendMessage("Update detected on Github, executing update - brb.", message.channel);
		updateBot();
	}
}];

var currentProcess = null;

function updateBot() {
	spawn("git", ["pull"]).on("close", function() {
		spawn("npm", ["install"]).on("close", function() {
			if (currentProcess) {
				currentProcess.kill();
			}
			currentProcess = child_process.spawn("node", ["app.js"]);
		});
	});
}

function dhms(ts) {
	var ms = ts % 1000;
	ts = parseInt(ts / 1000);	// secs
	var s = ts % 60;
	ts = parseInt(ts / 60);	// mins
	var m = ts % 60;
	ts = parseInt(ts / 60);	// hours
	var h = ts % 24;
	var d = parseInt(ts / 24);	// days
	return [d, h, m, s, ms];
}

function getNextDiff(ref, target) {
	var y = target.getYear() - 0;
	while (target < ref) {
		target.setYear(y++);
	}
	return dhms(target - ref);
}

module.exports = rules;