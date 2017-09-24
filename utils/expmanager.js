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

	const users = esndb.child('users');

	if (author.bot) return;

    UserService.getUserByDiscordID(userId).then((user) => {
        userId = user.esnid

		users.child(userId).once('value').then((userSnapshot) => {
			var user = userSnapshot.val();
			var messagedInServer;
			// if(message.server.id == "255210956668272684") {console.log("yes.")}else{console.log("no.")}
			if(user) {

		  		addExp(DEFAULT_EXP_BONUS, userId, member, userSnapshot);
		  		checkBoostExpire(userId, userSnapshot);

			//ACHIEVEMENTS
				//FIRST TIMER
				if(user.level >= 1 && !user.achievements.includes("__First Timer__")) {
						users.child(userId).update({
						exp: user.exp +10,
						totalexp: user.totalexp +10,
						achievements: "__First Timer__"
					});
					channel.sendEmbed({ color: 3066993, title: username + " unlocked the 'First Timer' achievement!", description: "+10 EXP!"});
				}

				//DEDICATOR
				if(user.level >= 5 && !user.achievements.includes("__Dedicator__")) {
						users.child(userId).update({
						exp: user.exp +40,
						totalexp: user.totalexp +40,
						achievements: user.achievements + ", __Dedicator__"
					});
					channel.sendEmbed({ color: 3066993, title: username + " unlocked the 'Dedicator' achievement!", description: "+40 EXP!"});
				}

				//THE K
				if(user.totalexp >= 1000 && !user.achievements.includes("__The K__")) {
						users.child(userId).update({
						exp: user.exp +150,
						totalexp: user.totalexp +150,
						achievements: user.achievements + ", __The K__"
					});
					channel.sendEmbed({ color: 3066993, title: username + " unlocked the 'The K' achievement!", description: "+150 EXP!"});
				}

				//X
				if(user.level >= 10 && !user.achievements.includes("__X__")) {
						users.child(userId).update({
						exp: user.exp +600,
						totalexp: user.totalexp +600,
						achievements: user.achievements + ", __X__"
					});
					channel.sendEmbed({ color: 3066993, title: username + " unlocked the 'X' achievement!", description: "+600 EXP!"});
				}	

				if(user.totalexp >= 1000000 && !user.achievements.includes("__Sydney__")) {
						users.child(userId).update({
						exp: user.exp +1000,
						totalexp: user.totalexp +1000,
						achievements: user.achievements + ", __Sydney__"
					});
					channel.sendEmbed({ color: 3066993, title: username + " unlocked the 'Sydney' achievement!", description: "+1000 EXP!"});
				}		

				if(user.credits >= 1000000 && !user.achievements.includes("__Millionaire__")) {
						users.child(userId).update({
						exp: user.exp +1000,
						totalexp: user.totalexp +1000,
						achievements: user.achievements + ", __Millionaire__"
					});
					channel.sendEmbed({ color: 3066993, title: username + " unlocked the 'Millionaire' achievement!", description: "+2000 EXP! \n +§50000 Credits!"});
				}
	    
	    		checkIfLevelUp(userId, userSnapshot, channel, author);
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
	if(!member.voiceChannel != null) {
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

function checkIfLevelUp(userId, userSnapshot, channel) {
	var user = userSnapshot.val();

	if(user.exp >= user.expup) {
		levelUp(userId, userSnapshot, channel);
	}
}

function levelUp(userId, userSnapshot, channel, author) {
	var user = userSnapshot.val()

	userSnapshot.ref.update({
		exp: user.exp - user.expup,
		totalexp: user.totalexp,
		expup: user.expup + 100,
		level: user.level + 1
    })

    author.sendEmbed({ color: config.COLOR_SUCCESS, title: "You just reached level " + (user.level + 1), description: "Congratulations! Keep it up!" })
    
    if(isInteger(user.level / 5)) {
        genchan = client.channels.get("359883901990207499")
        channel.sendEmbed({ color: 3066993, title: user.username + " just reached level " + (user.level + 1) + "!", description: "Congratulations!"})
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