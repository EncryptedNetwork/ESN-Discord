const utils = require('../utils/config')
const db = require('../services/db.service')
const uid = require('../utils/uid')

module.exports = (ngdb, params) => {
	const {author, args, channel, client} = params
    const {username, id} = author

	author.send({ embed: { color: utils.COLOR_ERROR, description: "This command is deprecated and will be removed in future updates." }})

	// const users = ngdb.child('users')

	// users.orderByChild('discordid').equalTo(id).once("value", function(snapshot) {
	// 	let user = snapshot.val()

	// 	if(user) {
	// 		channel.send({ embed: { color: utils.COLOR_ERROR, description: "You already have an account, " + username + ". Type ``~profile`` to look at your statistics." }})
	// 	} else {
	// 		channel.send({ embed: { color: utils.COLOR_WARNING, description: "Creating your account, " + username + ".." }})

	// 		let ngid = uid.generateAppUID()
	// 		const newUser = {username: username, discordid: id, ngid: ngid, level: 0, exp: 0, expup: 100, totalexp: 0, credits: 100, rank: "user", achievements: "*None yet*", profilebarcolor: "9807270", creationdate: new Date().toString()}
	// 		db.newUser(ngid, newUser)

	// 		channel.send({ embed: { color: utils.COLOR_SUCCESS, description: "Account created. Welcome to the network, " + username + "!" }})

	// 		// const newLog = {log: "Created new user account " + username + " with ID " + id + " successfully.", logtype: "information", timestamp: new Date().toString()};
	// 		// logs.push(newLog);
	// 	}
	// })
}