const config = require(`../utils/config`)

module.exports = (esndb, params) => {
  const { author, channel } = params

  const { username } = author

  channel.send({ embed: {
    color: config.COLOR_SUCCESS,
    title: username + `'s Discord ID:`,
    description: author.id
  }})
}
