exports.generateUID = function() {
  var firstPart = (Math.random() * 46656) | 0
  var secondPart = (Math.random() * 46656) | 0
  firstPart = ('000' + firstPart.toString(16)).slice(-3)
  secondPart = ('000' + secondPart.toString(16)).slice(-3)
  return firstPart + secondPart
}

exports.generateAppUID = function() {
  var firstPart = (Math.random() * 466568) | 0
  var secondPart = (Math.random() * 466568) | 0
  firstPart = ('0000' + firstPart.toString(16)).slice(-4)
  secondPart = ('0000' + secondPart.toString(16)).slice(-4)
  return firstPart + secondPart
}

exports.generateToken = function() {
  var firstPart = (Math.random() * 46656864) | 0
  var secondPart = (Math.random() * 46656864) | 0
  firstPart = ('000000' + firstPart.toString(16)).slice(-6)
  secondPart = ('000000' + secondPart.toString(16)).slice(-6)
  return firstPart + secondPart
}