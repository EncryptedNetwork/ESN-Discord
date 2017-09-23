const utils = require('../utils/config');

module.exports = (esndb, params) => {
	const {author, args, channel, client} = params;
    const {id, username} = author;

    if(!args[0]) {
        restartBot(client, channel)
    } else if(args[0] === "-t") {
        terminateBot(client, channel)
    } else if(args[0] === "help") {
        channel.send({ embed:{ color: utils.COLOR_SUCCESS, title: "Command: restart", description: "Usage: ``~restart (-t)`` () = optional. \n-t = Terminate"}});
    }
}

function restartBot(client, channel) {
    channel.send({ embed:{ color: utils.COLOR_CRITICAL, title: "Shutting down processes.."}});
    
    client.destroy();

    setTimeout(function() {
        client.login(process.env.DISCORD_BOT_TOKEN);

        client.on('ready', () => {
            channel.send({ embed:{ color: utils.COLOR_SUCCESS, title: "Encrypted Network Bot successfully restarted."}});
        })
    }, 3000)
}

function terminateBot(client, channel) {
    channel.send({ embed:{ color: utils.COLOR_CRITICAL, title: "Shutting down processes..", description: "Options: __terminate__" }});

    var Heroku = require('heroku.node')
    var hclient = new Heroku({email: process.env.HEROKU_EMAIL, api_key: process.env.HEROKU_API_KEY})
    hclient.app('esn-db').dynos.restart(console.log('Restarting due to Termination Request.'))
}