const path = require('path')
const express = require('express')
const omdb = require('./omdb.js')

const app = express()

const publicDir = path.join(__dirname, 'public')

// hola.com
// hola.com/about
// hola.com/contactanos

app.use(express.static(publicDir))

// app.get('/', function(req, res) {
//   res.send('<h1>Hola mundo!</h1>')
// })

app.get('/about', function(req, res) {
  res.send({
    dia: "jueves",
    descripcion: "casi viernes"
  })
})

app.get('/contactanos', function(req, res) {
  res.send([
    {
      dia: "jueves",
      descripcion: "casi viernes"
    },
    {
      dia: "viernes",
      descripcion: "chilango"
    }
    ])
})

app.get('/productos/', function(req, res) {
  if( !req.query.search ) {
    return res.send({
      error: 'Debes enviar un search term'
    })
  }
  if ( req.query.color) {
    console.log(req.query.color)
  }
  res.send({
    productos: []
  })
})


app.get('/omdb', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if( !req.query.search ) {
    return res.send({
      error: 'Tienes que dar una peli o serie a buscar'
    })
  }
  omdb.omdbMovie(req.query.search, function(error, response) {
    if(error) {
      return res.send({
        error: error
      })
    }
    const movie = response
    if( req.query.season ) {
      omdb.omdbSeason(response.title, req.query.season, function(error, response) {
        if(error) {
          return res.send({
            error: error
          })
        }
        res.send({
          title: response.title,
          plot: movie.plot,
          rating: movie.rating,
          season: response.season,
          episodes: response.episodes
        })
      })
    } else {
      res.send({
        title: movie.title,
        plot: movie.plot,
        rating: movie.rating
      })
    }
  })
})


app.get('*', function(req, res) {
  res.send({
    error: 'Esta ruta no existe'
  })
})


app.listen(3000, function() {
  console.log('up and running')
})
