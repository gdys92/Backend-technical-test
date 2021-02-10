const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');


const Movie = require('./models/Movie');

const app = express();

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];


// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/movies', {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }).then(db => console.log('Connected to MongoDB'))
    .catch(err => console.log('error: ', err))


// MIDDLEWARE
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// ROUTES
app.get("/", async (req, res, next) => {
  try{
    const movie  = await Movie.find();
    res.render("index", {
      movie
    });
  }catch (err){
    console.log("err: "+ err); 
  }
});

app.post('/add', async ( req, res, next)=>{
  const {name, type, img} = req.body;
  const movie = new Movie({
    name,
    type
  });

  // SETTING IMAGE AND IMAGE TYPES
  saveImage(movie, img);
  try{
    const newMovie = await movie.save();
    console.log(newMovie);  
    res.redirect('/')  ;
  }catch (err){
    console.log(err);    
  }
});


function saveImage(movie, imgEncoded) {
  if (imgEncoded == null) return;

  const img = JSON.parse(imgEncoded);
  console.log( "JSON parse: "+ img);
  
  if (img != null && imageMimeTypes.includes(img.type)) {

    movie.img = new Buffer.from(img.data, "base64");
    movie.imgType = img.type;
  }
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server is running on: " + port));
