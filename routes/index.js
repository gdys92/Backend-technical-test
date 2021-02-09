const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  let movies
    try {
      movies = await movie.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
      movies = []
    }
    res.render('index', { movies: movies }) 
    res.render('index')
  })
  
  module.exports = router