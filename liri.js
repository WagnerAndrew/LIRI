require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
moment().format();


// CHOICE WRAPPER START
inquirer.prompt([

    {
        type: "list",
        name: "choice",
        message: "What do you want to search for?",
        choices: ["Concert", "Song", "Movie", "Something Else"],
    }

]).then(function (user) {

    // CHOICE IS CONCERT START
    if (user.choice === "Concert") {
        inquirer.prompt([
            {
                type: "input",
                name: "concert",
                message: "What concert do you want to look for?"
            }

        ]).then(function (userConcert) {

            var concert = userConcert.concert;
            console.log("Concert is: " + concert);
            var concertQueryURL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp&date=upcoming";

            axios.get(concertQueryURL)
                .then(
                    function (concertResponse) {
                        console.log(`Venue: ${concertResponse.data[0].venue.name}\nVenue Location: ${concertResponse.data[0].venue.city}, ${concertResponse.data[0].venue.region}\nDate: ${concertResponse.data[0].datetime}`);
                    }
                );
        });
    }
// CHOICE IS CONCERT END



    // CHOICE IS SONG START
    if (user.choice === "Song") {

        inquirer.prompt([

            {
                type: "input",
                name: "song",
                message: "What song do you want to look for?"
            }

        ]).then(function (userSong) {

            var spotify = new Spotify(keys.spotify);
            var song = userSong.song;
            console.log("The song is: " + song);

            spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(JSON.stringify(data, null, 1));
                debugger;
            });

        });
    }
// CHOICE IS SONG END


    // CHOICE IS MOVIE START
    if (user.choice === "Movie") {

        inquirer.prompt([

            {
                type: "input",
                name: "movie",
                message: "What movie do you want to look for?"
            }

        ]).then(function (userMovie) {

            var movie = userMovie.movie;
            // console.log("Movie is: " + movie);
            var movieQueryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&y=&plot=short";

            if (movie) {
                axios.get(movieQueryURL)
                    .then(
                        function (movieResponse) {
                            console.log(`Title: ${movieResponse.data.Title}\nYear: ${movieResponse.data.Year}\nIMDB Rating: ${movieResponse.data.imdbRating}\nRotten Tomatoes Rating: ${movieResponse.data.Ratings[1].Value}\nProduction Country: ${movieResponse.data.Country}\nLanguage: ${movieResponse.data.Language}\nPlot: ${movieResponse.data.Plot}\nActors: ${movieResponse.data.Actors}`);
                        }
                    );
            } else {
                axios.get("http://www.omdbapi.com/?apikey=trilogy&t=Rainman&y=&plot=short")
                    .then(
                        function (movieResponse) {
                            console.log(`Title: ${movieResponse.data.Title}\nYear: ${movieResponse.data.Year}\nIMDB Rating: ${movieResponse.data.imdbRating}\nRotten Tomatoes Rating: ${movieResponse.data.Ratings[1].Value}\nProduction Country: ${movieResponse.data.Country}\nLanguage: ${movieResponse.data.Language}\nPlot: ${movieResponse.data.Plot}\nActors: ${movieResponse.data.Actors}`);
                        }
                    );
            }

        });
    }
// CHOICE IS MOVIE END




});
// CHOICE WRAPPER END




