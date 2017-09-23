const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

class BCryptPromise {
  static compare (input, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(input, hash, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  }

  static hash (input) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return reject(err)
        bcrypt.hash(input, salt, (err, hash) => {
          if (err) return reject(err)
          return resolve(hash)
        })
      })
    })
  }
}

module.exports = BCryptPromise
