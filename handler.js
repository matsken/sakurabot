var config = require("./config");
var FeedParser = require("feedparser");
var http = require("http");

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

var handler = function(bot) {
	return {
		anniversary: function(message) {
			var aniv = new Date(config.anniversary);
			var [d, h, m, s, ms] = getNextDiff(new Date(), aniv);
			
			bot.sendMessage("Due in " + d + " days " + h + "h" + m + "m" + s + "s", message.channel);
		},
		
		birthday: function(message) {
			var today = new Date();
			
			var text = config.birthdays.map(function(obj) {
				var bd = new Date(obj.date);
				
				var [d, h, m, s, ms] = getNextDiff(today, bd);
				return obj.name + ": in " + d + " days";
			}).join("\n");
			
			bot.sendMessage(text, message.channel);
		},
		
		tired: function(message) {
			bot.sendMessage("@matsken: お疲れの方がいるようです", message.channel);
		},
		
		weather: function(message) {
			var text, ep = [], count = 0;
			http.get("http://rss.weather.yahoo.co.jp/rss/days/12.xml", function(res) {
				res.pipe(new FeedParser({})).on("error", function(e) {
						text = e.toString();
					}).on("readable", function() {
						var stream = this, item;
						while (item = stream.read()) {
							if (item.title.indexOf("北西部") > -1) {
								bot.sendMessage(item.title, message.channel);
								break;
							}
						}
					});
			});
		}
	}
}

module.exports = handler;