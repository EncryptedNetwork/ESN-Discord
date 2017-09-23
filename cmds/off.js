const config = require(`../utils/config`)

module.exports = (esndb, params) => {
  const { author, channel, args, message, client } = params

  const { username } = author

  channel.sendEmbed({ color: config.COLOR_CRITICAL, title: "Shutting down processes.."});
  client.destroy();
}