const config = require('../utils/config')

module.exports = (esndb, params) => {
  const { channel } = params

  channel.sendEmbed({ color: config.COLOR_, title: 'Version Debugger', description: config.version })
}
