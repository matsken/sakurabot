var config = require("./config");

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
		}
	}
}

module.exports = handler;