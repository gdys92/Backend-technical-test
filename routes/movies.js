const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Movie = require('../models/movie')
const Rating = require('../models/rating')
const uploadPath = path.join('public', movie.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All movies Route
router.get('/', async (req, res) => {
  let query = Movie.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const movies = await query.exec()
    res.render('movies/index', {
        movies: movies,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New movie Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Movie())
})

// Create movie Route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const movie = new Movie({
    title: req.body.title,
    rating: req.body.rating,
    publishDate: new Date(req.body.publishDate),
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newMovie = await movie.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`movies`)
  } catch {
    if (movie.coverImageName != null) {
      removeMovieCover(movie.coverImageName)
    }
    renderNewPage(res, movie, true)
  }
})

function removeMovieCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const ratings = await Rating.find({})
    const params = {
        ratings: ratings,
      movie: movie
    }
    if (hasError) params.errorMessage = 'Error Creating Movie'
    res.render('movies/new', params)
  } catch {
    res.redirect('/movies')
  }
}

module.exports = router