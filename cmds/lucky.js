const utils = require('../utils/config')

module.exports = (esndb, params) => {
    const {
    	author, 
    	args, 
    	channel, 
    	client, 
        member,
        message
    } = params

    const {
        username,
        id: userId
      } = author

      channel.send(username + " " + luckyFlip())

      function luckyFlip() {
        let flip = Math.floor(Math.random() * (3 - 1)) + 1
        let result

        if(flip === 1) {
            result = "is unlucky! :black_circle:"
        }

        if(flip === 2) {
            result = "is lucky! :white_circle:"
        }

        return result;
      }
}