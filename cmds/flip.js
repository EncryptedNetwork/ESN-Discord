const utils = require('../utils/config')

module.exports = (esndb, params) => {
    const {
    	author, 
    	args, 
    	channel, 
    	client, 
    	member
    } = params

    const {
        username,
        id: userId
      } = author

      channel.send(username + " flipped " + coinFlip() + "! :white_circle: :red_circle: :black_circle:")

}

function coinFlip() {
    let flip = Math.floor(Math.random() * (3 - 1)) + 1;
    let result;

    if(flip === 1) {
        result = "heads";
    }

    if(flip === 2) {
        result = "tails";
    }

    return result;
}