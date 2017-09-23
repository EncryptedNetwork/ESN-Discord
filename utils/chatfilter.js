const utils = require('./chatcensor');

module.exports = (esndb, params) => {
	const {author, args, channel, client, member, message} = params;

	if (message.author.bot) return;

	var themessage = message.content.toLowerCase();

	if (containsAny(themessage, utils.CENSORED_WORDS)) {
		const theword = containsAny(themessage, utils.CENSORED_WORDS)
		const words = utils.CENSORED_WORDS_RE[theword]

		var randomProperty = function (obj) {
    		var keys = Object.keys(obj)
   			return obj[keys[ keys.length * Math.random() << 0]]
        }
        
        let toReplace = randomProperty(words)
		let finalMessage = toReplace.replace("%user%", author.username)

		message.delete()
		channel.send(finalMessage)
	}
}

function containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i]
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null
}