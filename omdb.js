const credentials = require('./credentials.js')
const request = require('request')

const omdbMovie = function( title, callback ) {
  const url = 'http://www.omdbapi.com/?t=' + title + 
  '&apikey=' + credentials.apikey
  console.log(url)
  request({ url, json: true }, function(error, response ) {
    if (error) {
      callback('Service unavailable', undefined)
    } else if ( response.body.Response == 'False' ) {
      callback(response.body.Error, undefined)
    } else {
      const data = response.body
      const info = {
        title: data.Title,
        plot: data.Plot,
        rating: data.Ratings[0].Value,
        seasons: data.totalSeasons
      }
      callback(undefined, info)
    }
  })
}

const omdbSeason = function( title, seasonNo, callback ) {
  const url = 'http://www.omdbapi.com/?t=' + title + 
  '&Season=' + seasonNo +
  '&apikey=' + credentials.apikey 
  request({ url, json: true }, function(error, response ) {
    if (error) {
      callback('Service unavailable', undefined)
    } else if ( response.body.Response == 'False' ) {
      callback(response.body.Error, undefined)
    } else {
      const data = response.body
      const info = {
        title: data.Title,
        season: data.Season,
        episodes : []
      }
      for( i in data.Episodes ) {
        info.episodes.push(data.Episodes[i].Title)
      }
      callback(undefined, info)
    }
  })
}


module.exports = {
  omdbMovie: omdbMovie,
  omdbSeason: omdbSeason
}

