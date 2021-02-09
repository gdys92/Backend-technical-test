const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Rating', ratingSchema)