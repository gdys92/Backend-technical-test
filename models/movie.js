const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/movieCovers'

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName: {
    type: String,
    required: true
  },
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Rating'
  }
})

movieSchema.virtual('coverImagePath').get(function() {
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model('Movie', movieSchema)
module.exports.coverImageBasePath = coverImageBasePath