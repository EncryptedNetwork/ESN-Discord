const config = require(`../utils/config`)

module.exports = (esndb, params) => {
  const { author, channel, args, message } = params

  const { username } = author

  var count = args[0]
  args.shift()
  var filter = args.join(' ')
  purge(count, filter, message, author, channel)
  
}

function purge(count, filter, message, author, channel) {
    
    if(!parseInt(count)) {
			message.delete()
        channel.send({ embed: {
            color: config.COLOR_ERROR,
            title: `Invalid use of command, ` + author.username + `!`,
            description: `Usage: \`\`~purge <count> <filter>\`\``
				}})
					return
    }

    if(count > 100) {
			message.delete()
			channel.send({ embed: {
					color: config.COLOR_ERROR,
					title: `Cannot purge more than 100 messages, ` + author.username + `!`,
					description: `Parameters exceeded maximum limit for purge.`
			}})
			return
    } else {
				message.delete()
				let messagecount = parseInt(count)
			// PURGE W/O FILTER
				if(!filter) {
					channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages))
					return
				}

				if(count < 2) {
					channel.send({ embed: {
            color: config.COLOR_ERROR,
            title: `Cannot purge less than 2 messages, ` + author.username + `!`,
            description: `Parameters did not meet minimal expecations for purge.`
				}})
					return
				}
	
				// PURGE W/ FILTER
				var messagesToDelete = []

        message.channel.fetchMessages({limit: 100, before: message.id}).then((messagescol) => {
					var messages = messagescol.array()
					filter = filter.toLowerCase()
					
            for(i = 0; i < messagescol.size; i++) {
							if(messages[i].content.toLowerCase().includes(filter)) {
								messagesToDelete.push(messages[i])
							}

							if(i === (messagescol.size - 1)) {
								bulkPurge(messagesToDelete, channel)
								return
							}
						}
        })
    }
}

function bulkPurge(messagesToDelete, channel) {
	channel.bulkDelete(messagesToDelete).then((deletedMessages) => {
		channel.send(`Deleted ${deletedMessages.size} messages.`)
		return
	})
}

// let messagecount = parseInt(numberofmessages);
//   message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages))

// [ Message {
//     channel:
//      TextChannel {
//        type: 'text',
//        id: '342168480419938304',
//        name: 'dev',
//        position: 4,
//        permissionOverwrites: [Object],
//        topic: null,
//        lastMessageID: '343200572909813761',
//        guild: [Object],
//        messages: [Object],
//        _typing: [Object],
//        lastMessage: [Object] },
//     id: '343200572909813761',
//     type: 'DEFAULT',
//     content: '~purge 2 ~off',
//     author:
//      User {
//        id: '184873285304057856',
//        username: 'Reality',
//        discriminator: '7399',
//        avatar: 'deb6688f3ae052c46ba3b4b8b33c7fc1',
//        bot: false,
//        lastMessageID: '343200572909813761',
//        lastMessage: [Object] },
//     member:
//      GuildMember {
//        guild: [Object],
//        user: [Object],
//        _roles: [Array],
//        serverDeaf: false,
//        serverMute: false,
//        selfMute: undefined,
//        selfDeaf: undefined,
//        voiceSessionID: undefined,
//        voiceChannelID: undefined,
//        speaking: false,
//        nickname: null,
//        joinedTimestamp: 1498617896938,
//        lastMessageID: '343200572909813761',
//        lastMessage: [Object] },
//     pinned: false,
//     tts: false,
//     nonce: undefined,
//     system: false,
//     embeds: [],
//     attachments: Collection {},
//     createdTimestamp: 1501895792940,
//     editedTimestamp: null,
//     reactions: Collection {},
//     mentions:
//      MessageMentions {
//        everyone: false,
//        users: Collection {},
//        roles: Collection {},
//        _content: '~purge 2 ~off',
//        _client: [Object],
//        _guild: [Object],
//        _members: null,
//        _channels: null },
//     webhookID: null,
//     hit: null,
//     _edits: [] },
//   Message {
//     channel:
//      TextChannel {
//        type: 'text',
//        id: '342168480419938304',
//        name: 'dev',
//        position: 4,
//        permissionOverwrites: [Object],
//        topic: null,
//        lastMessageID: '343200572909813761',
//        guild: [Object],
//        messages: [Object],
//        _typing: [Object],
//        lastMessage: [Object] },
//     id: '343200535618256897',
//     type: 'DEFAULT',
//     content: '~purge 102 ~off',
//     author:
//      User {
//        id: '184873285304057856',
//        username: 'Reality',
//        discriminator: '7399',
//        avatar: 'deb6688f3ae052c46ba3b4b8b33c7fc1',
//        bot: false,
//        lastMessageID: '343200572909813761',
//        lastMessage: [Object] },
//     member:
//      GuildMember {
//        guild: [Object],
//        user: [Object],
//        _roles: [Array],
//        serverDeaf: false,
//        serverMute: false,
//        selfMute: undefined,
//        selfDeaf: undefined,
//        voiceSessionID: undefined,
//        voiceChannelID: undefined,
//        speaking: false,
//        nickname: null,
//        joinedTimestamp: 1498617896938,
//        lastMessageID: '343200572909813761',
//        lastMessage: [Object] },
//     pinned: false,
//     tts: false,
//     nonce: undefined,
//     system: false,
//     embeds: [],
//     attachments: Collection {},
//     createdTimestamp: 1501895784049,
//     editedTimestamp: null,
//     reactions: Collection {},
//     mentions:
//      MessageMentions {
//        everyone: false,
//        users: Collection {},
//        roles: Collection {},
//        _content: '~purge 102 ~off',
//        _client: [Object],
//        _guild: [Object],
//        _members: null,
//        _channels: null },
//     webhookID: null,
//     hit: null,
//     _edits: [] } ]