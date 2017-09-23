const SteamUser = require('steam-user')
const steamTOTP = require('steam-totp')
const client = new SteamUser()
const SteamID = require('steamid')
const config = require('../utils/config')
//twoFactorCode: steamTOTP.generateAuthCode()

const credentials = {
    accountName: process.env.STEAM_ACCOUNT_NAME,
    password: process.env.STEAM_ACCOUNT_PASSWORD,
    twoFactorCode: steamTOTP.generateAuthCode(process.env.STEAM_SECRET)
}

if(!credentials) {
    console.log('SteamAPI Offline. \nProbably due to lack of credentials.')
    return
}

var steamUsersMsg = {}

if(config.CON_STEAM) {
    client.logOn(credentials)
}

client.on('steamGuard', function(domain, callback) {
	console.log("Steam Guard code needed from email ending in " + domain);
	var code = steamTOTP.generateAuthCode(process.env.STEAM_SECRET)
	callback(code);
});

client.on('loggedOn', () => {
    config.STATUS_STEAM = "online"
    console.log("Steam Service Online.")
    client.setPersona(SteamUser.Steam.EPersonaState.Online)
    client.gamesPlayed("Native Gaming Steam Bot")
    steamUsersMsg = {}
})

client.on('friendMessage', (steamid, message) => {
    if(!steamUsersMsg.steamid) {
        client.chatMessage(steamid, "Hey, I see that you're messaging a bot without purpose. Now you see there's a problem with that. Unless you're verifying your Discord account with the Null Reality Network, there should be no need to contact me (yet). If that's exactly what you're trying to do, please click the following link (https://discord.gg/egfNKtv) and type '~verify' in chat. You will be further instructed from there.")
        steamUsersMsg.steamid = "yeet"
    } else {
        client.chatMessage(steamid, "I already told you what to do.")
    }
})

function sendAuthCode (steamId, authCode) {
    client.addFriend(steamId)

    setTimeout(function() {
        client.chatMessage(steamId, "Hey there. You've requested that you verify your Steam Account with the Native Gaming Network. Type '~verify " + authCode + "' to verify your account. If you did not request to verify your account, feel free to ignore this message. Tip top!")
    }, 4000)
}

module.exports = sendAuthCode