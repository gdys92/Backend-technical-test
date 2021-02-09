const express = require('express')
const router = express.Router()
const Rating = require('../models/rating') 

// All ratings Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const ratings = await Rating.find(searchOptions)
    res.render('ratings/index', {
        ratings: ratings,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New rating Route
router.get('/new', (req, res) => {
  res.render('ratings/new', { rating: new Rating() })
})

// Create rating Route
router.post('/', async (req, res) => {
  const rating = new Rating({
    name: req.body.name
  })
  try {
    const newRating = await rating.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`ratings`)
  } catch {
    res.render('ratings/new', {
      rating: rating,
      errorMessage: 'Error creating Rating'
    })
  }
})

module.exports = router