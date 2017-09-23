const db = require('./db.service')
const ngdb = db.ngdb
const bcryptpromise = require('../utils/bcryptpromise')
const uid = require('../utils/uid')

let posts = ngdb.child('posts')

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]

exports.newPost = function(post) {
    posts.child(post.postid).update(post)
}

exports.editPost = function(post) {
    posts.child(post.postid).update(post)
}

exports.getPost = function(postid) {
    return posts.child(postid).once('value').then((postSnapshot) => {
        post = postSnapshot.val()

        return post
    })
}

exports.getLatestPosts = function() {
    var posts = {}
    var max;
    var i = 1;
    return posts.orderByKey().limitToFirst(5).once('value').then((postsSnapshot) => {
         
        postsSnapshot.forEach(function(childPostSnapshot) {
            max++
        })

        return postsSnapshot.forEach(function(childPostSnapshot) {
            var sub = numbers[i]
            posts[sub] = childPostSnapshot.val()

            if(i === max) {
                resolve (posts)
            }

            i++
        })
    })
}