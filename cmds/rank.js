const config = require(`../utils/config`)
const db = require('../services/db.service')

module.exports = (esndb, params) => {
  const {
    author,
    args,
    channel,
    client,
    message
  } = params

  const users = esndb.child('users')
  const ranks = esndb.child('ranks')
  let commandReq = args[0]
  let userProfile = args[1]
  let desiredRank = args[1]

  if (!desiredRank) {
    author.send({ embed: {
      color: config.COLOR_ERROR,
      title: `Error A101`,
      description: `Insufficient arguments. Usage: ` + config.prefix + `rank <set:add> [@user] <rank>`
    }})
    return
  } else {
    commandReq = commandReq.toLowerCase()
    desiredRank = desiredRank.toLowerCase()
  }

  if (!commandReq) {
    author.send({ embed: {
      color: config.COLOR_ERROR,
      title: `Error A102`,
      description: `Insufficient arguments. Usage: ` + config.prefix + `rank <set:add> [@user] <rank>`
    }})
    return
  }

// SET CMD
  if (commandReq === 'set') {
    if (!userProfile) {
      author.send({ embed: {
        color: config.COLOR_ERROR,
        title: `Error A103`,
        description: `Insufficient arguments. Usage: ` + config.prefix + `rank set <@user> <rank>`
      }})
    } else {
      userProfile = trim(userProfile.toString(), `<!@>abcdefghijklmnop`) // Get true Discord ID

      client.fetchUser(userProfile).then(up => {
        let targetUsername = up.username

        message.guild.fetchMember(userProfile).then(fetchedMember => {
          db.getUserByDiscordID(userProfile).then((user) => {

            if(!user) {
                db.newDiscordUser(userProfile, targetUsername)
                ranks.child(desiredRank).once('value').then((rankSnapshot) => {
                    let rank = rankSnapshot.val()
  
                    if (!rank) {
                      author.send({ embed: {
                        color: config.COLOR_ERROR,
                        title: `Error A1051`,
                        description: `That rank does not exist. If you have sufficient permissions, use ` + config.prefix + `rank add <rank name (ONE WORD)> <rank perm level 1-20> <rank display name>`
                      }})
                    } else {
                      users.child(user.esnid).update({
                        rank: desiredRank,
                        name: targetUsername
                      })
  
                      let specrole = rank.display
                      let role = message.guild.roles.find("name", specrole)
                      let member = message.mentions.members.first()
                      member.setRoles([role])
  
                      author.send({ embed: {
                        color: config.COLOR_SUCCESS,
                        title: `Successfully updated rank of user: ` + targetUsername,
                        description: `Rank of ` + targetUsername + ` changed to ` + specrole + `!`
                      }})
                    }
                  })
                return
            }

            if (user) {
              if (user.rank === desiredRank) {
                author.send({ embed: {
                  color: config.COLOR_ERROR,
                  title: `Error A104`,
                  description: `User is already that rank.`
                }})
                return
              } else {
                ranks.child(desiredRank).once('value').then((rankSnapshot) => {
                  let rank = rankSnapshot.val()

                  if (!rank) {
                    author.send({ embed: {
                      color: config.COLOR_ERROR,
                      title: `Error A105`,
                      description: `That rank does not exist. If you have sufficient permissions, use ` + config.prefix + `rank add <rank name (ONE WORD)> <rank perm level 1-20> <rank display name>`
                    }})
                  } else {
                    users.child(user.esnid).update({
                      rank: desiredRank,
                      name: targetUsername
                    })

                    let specrole = rank.display
                    let role = message.guild.roles.find("name", specrole)
                    let member = message.mentions.members.first()
                    member.setRoles([role])

                    author.send({ embed: {
                      color: config.COLOR_SUCCESS,
                      title: `Successfully updated rank of user: ` + targetUsername,
                      description: `Rank of ` + targetUsername + ` changed to ` + specrole + `!`
                    }})
                  }
                })
              }
            } else {
              ranks.child(desiredRank).once('value').then((rankSnapshot) => {
                let rank = rankSnapshot.val()

                if (!rank) {
                  channel.send({ embed: {
                    color: config.COLOR_ERROR,
                    title: `Error A106`,
                    description: `That rank does not exist. If you have sufficient permissions, use ` + config.prefix + `rank add <rank name>`
                  }})
                } else {
                  users.child(user.esnid).update({
                    rank: desiredRank,
                    name: targetUsername
                  })

                    let specrole = rank.display
                    let role = message.guild.roles.find("name", specrole)
                    let member = message.mentions.members.first()
                    member.setRoles([role])

                  channel.send({ embed: {
                    color: config.COLOR_SUCCESS,
                    title: `Successfully updated rank of user: ` + targetUsername,
                    description: `Rank of ` + targetUsername + ` changed to ` + specrole + `!`
                  }})
                }
              })
            }
          })
        })
      })
    }
  }

// ADD CMD
  if (commandReq === 'add') {
    if (!args[1]) {
      channel.send({ embed: {
        color: config.COLOR_ERROR,
        title: `Error B101`,
        description: `Insufficient arguments. Usage: \`\`` + config.prefix + `rank add\`\` \`\`<rank name (ONE WORD)>\`\` \`\`<power (highest) 1-20 (lowest)\`\` \`\`<appearance name (what the rank is called in discord)>\`\``
      }})
    } else {
      let rankName = args[1]
      let rankPower = args[2]
      rankPower = parseInt(rankPower)

// HAVE TO ADD A CHECK TO SEE IF RANK ALREADY EXISTS

      if (isNaN(rankPower)) {
        author.send({ embed: {
          color: config.COLOR_ERROR,
          title: `Error B102: rankPower cannot be: ` + rankPower + `. Must be a valid integer.`,
          description: `Insufficient arguments. Usage: \`\`` + config.prefix + `rank add\`\` \`\`<rank name (ONE WORD)>\`\` \`\`<power (highest) 1-20 (lowest)\`\` \`\`<appearance name (what the rank is called in discord)>\`\``
        }})
      } else {
        delete args[0]
        delete args[1]
        delete args[2]
        let display = args.join(' ')
        display.replace('  ', '')
        ranks.child(rankName).update({
          display: display,
          power: rankPower
        })
        author.send({ embed: {
          color: config.COLOR_SUCCESS,
          title: `Sucess! New rank added to Database.`,
          description: `Your new rank has been added. You can now set users to have your wonderful new rank. Woot woot.`
        }})
      }
    }
  }
}

// Out

function trim (s, mask) {
  while (~mask.indexOf(s[0])) {
    s = s.slice(1)
  }
  while (~mask.indexOf(s[s.length - 1])) {
    s = s.slice(0, -1)
  }
  return s
}
