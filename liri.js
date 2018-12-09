require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');


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
            var concertQueryURL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp";

            axios.get(concertQueryURL)
                .then(
                    function (response) {

                        var concertResponse = response.data;

                        if (concertResponse.length === 0) {
                            console.log("There are no concerts scheduled for this artist.");

                        } else {

                            concertResponse.forEach(function (concert) {
                                console.log(`Venue: ${concert.venue.name}\nVenue Location: ${concert.venue.city}, ${concert.venue.region}\nDate: ${moment(concert.datetime).format("MM/DD/YYYY")}`);

                            })
                        }
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


            spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
                console.log(`Song Name: ${data.tracks.items[0].name}`);
                console.log(`Spotify Link: ${data.tracks.items[0].preview_url}`);
                console.log(`Album: ${data.tracks.items[0].album.name}`);


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

            var movie;

            if (!userMovie.movie) {
                movie = "Mr. Nobody";
            } else {
                movie = userMovie.movie;
            };

            console.log("Movie is: " + movie);
            var movieQueryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&y=&plot=short";

            axios.get(movieQueryURL)
                .then(
                    function (movieResponse) {
                        console.log(`Title: ${movieResponse.data.Title}\nYear: ${movieResponse.data.Year}\nIMDB Rating: ${movieResponse.data.imdbRating}\nRotten Tomatoes Rating: ${movieResponse.data.Ratings[1].Value}\nProduction Country: ${movieResponse.data.Country}\nLanguage: ${movieResponse.data.Language}\nPlot: ${movieResponse.data.Plot}\nActors: ${movieResponse.data.Actors}`);
                    }
                );
        });
    }
    // CHOICE IS MOVIE END

});
// CHOICE WRAPPER END

