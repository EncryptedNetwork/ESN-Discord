const config = require('../utils/config');
const UserService = require('../services/user.service')

const DEFAULT_EXP_BONUS = 5

const DOUBLE_EXP_BONUS = DEFAULT_EXP_BONUS + 2;
const TRIPLE_EXP_BONUS = DEFAULT_EXP_BONUS + 3;

const DEFAULT_TALK_EXP_BONUS = DEFAULT_EXP_BONUS * 2;

const DOUBLE_TALK_EXP_BONUS = DEFAULT_TALK_EXP_BONUS * 2;
const TRIPLE_TALK_EXP_BONUS = DEFAULT_TALK_EXP_BONUS * 3;

module.exports = (esndb, params) => {
	const {author, args, channel, client, member, message} = params;
	let {username, id: userId} = author;

	const users = esndb.child('users')
	chatchan = client.channels.get("359883901990207499")

	if (author.bot) return

    UserService.getUserByDiscordID(userId).then((user) => {
		if(user.esnid) {
			userId = user.esnid
		} else return

		users.child(userId).once('value').then((userSnapshot) => {
			var user = userSnapshot.val()
			var messagedInServer
			// if(message.server.id == "255210956668272684") {console.log("yes.")}else{console.log("no.")}
			if(user) {

		  		addExp(DEFAULT_EXP_BONUS, userId, member, userSnapshot);
		  		checkBoostExpire(userId, userSnapshot);

			//ACHIEVEMENTS
				//FIRST TIMER
				if(user.level >= 1 && !user.achievements.includes("__First Timer__")) {
						users.child(userId).update({
						credits: user.credits +100,
						achievements: "__First Timer__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__First Timer__' achievement!", description: "+§100 Credits!"});
				}

				//DEDICATOR
				if(user.level >= 5 && !user.achievements.includes("__Regularity__")) {
					users.child(userId).update({
						credits: user.credits +500,
						achievements: user.achievements + ", __Regularity__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__Regularity__' achievement!", description: "+§500 Credits!"});
				}

				//5 WONDERS
				if(user.totalexp >= 5000 && !user.achievements.includes("__5 Wonders__")) {
					users.child(userId).update({
						credits: user.credits +1500,
						achievements: user.achievements + ", __5 Wonders__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__5 Wonders__' achievement!", description: "+§1500 Credits!"});
				}

				//THE K
				if(user.totalexp >= 1000 && !user.achievements.includes("__K__")) {
					users.child(userId).update({
						credits: user.credits +700,
						achievements: user.achievements + ", __K__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__K__' achievement!", description: "+§700 Credits!"});
				}

				//X
				if(user.level >= 10 && !user.achievements.includes("__X__")) {
					users.child(userId).update({
						credits: user.credits +2000,		
						achievements: user.achievements + ", __X__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__X__' achievement!", description: "+§2000 Credits!"});
				}	

				//SYDNEY
				if(user.totalexp >= 10000 && !user.achievements.includes("__Strike__")) {
					users.child(userId).update({
						credits: user.credits +3000,
						achievements: user.achievements + ", __Strike__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__Strike__' achievement!", description: "+§3000 Credits!"});
				}		

				//MILLIONAIRE
				if(user.credits >= 1000000 && !user.achievements.includes("__Millionaire__")) {
					users.child(userId).update({
						exp: user.exp +2000,
						totalexp: user.totalexp +2000,
						credits: user.credits +50000,
						achievements: user.achievements + ", __Millionaire__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__Millionaire__' achievement!", description: "+2000 EXP! \n+§50000 Credits!"});
				}
				
				//Andrew Jackson
				if(user.level >= 20 && !user.achievements.includes("__Andrew Jackson__")) {
					users.child(userId).update({
						credits: user.credits +10000,
						achievements: user.achievements + ", __Andrew Jackson__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__Andrew Jackson__' achievement!", description: "+§10000 Credits!"});
				}

				//Andrew Jackson
				if(user.level >= 30 && !user.achievements.includes("__White Album__")) {
					users.child(userId).update({
						credits: user.credits +20000,
						achievements: user.achievements + ", __White Album__"
					});
					chatchan.sendEmbed({ color: 3066993, title: username + " unlocked the '__White Album__' achievement!", description: "+§20000 Credits!"});
				}


                // LEVEL RANKS
                    // REGULAR
                    if(user.level === 5 && user.rank != "regular" && user.rank != "dev" && user.rank != "founder" && user.rank != "mod") {
                        users.child(userId).update({
                            rank: "regular"
                        })

                        let role = message.guild.roles.find("name", "Regular")
                        member.setRoles([role])

                        author.send({ embed: {
                            color: config.COLOR_SUCCESS,
                            title: `PROMOTION!`,
                            description: `You just got upgraded to the "Regular" role!`
                        }})
                    }
	    
	    		checkIfLevelUp(userId, userSnapshot, channel, author, client);
				}	
            });
        })
}

function addExp(exp, userId, member, userSnapshot) {
	var user = userSnapshot.val();

	if(user.doubleexp) {
		userSnapshot.ref.update({
			totalexp: user.totalexp + DOUBLE_EXP_BONUS,
			exp: user.exp + DOUBLE_EXP_BONUS
		});
	}
	if(user.tripleexp) {
		userSnapshot.ref.update({
			totalexp: user.totalexp + TRIPLE_EXP_BONUS,
			exp: user.exp + TRIPLE_EXP_BONUS
		});
	}
	if(member.voiceChannel) {
		if(user.doubleexp) {
			userSnapshot.ref.update({
				totalexp: user.totalexp + DOUBLE_TALK_EXP_BONUS,
				exp: user.exp + DOUBLE_TALK_EXP_BONUS
			});
		} else if(user.tripleexp) {
			userSnapshot.ref.update({
				totalexp: user.totalexp + TRIPLE_TALK_EXP_BONUS,
				exp: user.exp + TRIPLE_TALK_EXP_BONUS
			});
		} else {
			userSnapshot.ref.update({
				totalexp: user.totalexp + DOUBLE_EXP_BONUS,
				exp: user.exp + DOUBLE_EXP_BONUS
			});
		}
		
	} else {
		userSnapshot.ref.update({
			totalexp: user.totalexp + exp,
			exp: user.exp + exp
		});
	}
}

function checkIfLevelUp(userId, userSnapshot, channel, author, client) {
	var user = userSnapshot.val();

	if(user.exp >= user.expup) {
		levelUp(userId, userSnapshot, channel, author, client);
	}
}

function levelUp(userId, userSnapshot, channel, author, client) {
	var user = userSnapshot.val()

	userSnapshot.ref.update({
		exp: user.exp - user.expup,
		totalexp: user.totalexp,
		expup: user.expup + 100,
		level: user.level + 1
    })

    author.send({ embed: { color: config.COLOR_SUCCESS, title: "You just reached level " + (user.level + 1) + "!", description: "Congratulations! Keep it up!" }})
    
    if(isInteger((user.level + 1) / 5)) {
        genchan = client.channels.get("359883901990207499")
        genchan.send({ embed: { color: 3066993, title: author.nickname + " just reached level " + (user.level + 1) + "!", description: "Congratulations!"}})
    }
}

function checkBoostExpire(userId, userSnapshot) {
	var user = userSnapshot.val();

	var dateNow = new Date();

	//DOUBLE EXPIRE TIME
	if(user.tripleexptime) {
		var expireDate = new Date(user.tripleexptime);
		if(expireDate.getTime() < dateNow.getTime()) {
			userSnapshot.ref.update({
				tripleexptime: null,
				tripleexp: false
			});
		}
	}

	if(user.tripleexptime) {
		var expireDate = new Date(user.tripleexptime);
		if(expireDate.getTime() < dateNow.getTime()) {
			userSnapshot.ref.update({
				tripleexptime: null,
				tripleexp: false
			});
		}
	}
}

function isFloat(n) {
    return n === +n && n !== (n|0)
}

function isInteger(n) {
    return n === +n && n === (n|0)
}