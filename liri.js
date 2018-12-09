require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

// CHOICE IS CONCERT START
function concertSearch() {
    inquirer.prompt([
        {
            type: "input",
            name: "concert",
            message: "What concert do you want to look for?"
        }
    ]).then(function (userConcert) {
        var concert;

        if (!userConcert.concert) {
            console.log("You need to enter an Artist or Band name! I don't know who to search for.");
            return;
        } else {
            concert = userConcert.concert;
        };
        var concertQueryURL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp";

        axios.get(concertQueryURL)
            .then(
                function (response) {
                    var concertResponse = response.data;

                    if (concertResponse.length === 0) {
                        console.log("There are no concerts scheduled for this artist.");
                    } else {
                        concertResponse.forEach(function (concert) {
                            console.log("*********************************************\n");
                            console.log(`Venue: ${concert.venue.name}\nVenue Location: ${concert.venue.city}, ${concert.venue.region}\nDate: ${moment(concert.datetime).format("MM/DD/YYYY")}\n`);
                        })
                    }
                }
            );
    });
}
// CHOICE IS CONCERT END

// CHOICE IS SONG START
function songSearch() {
    inquirer.prompt([
        {
            type: "input",
            name: "song",
            message: "What song do you want to look for?"
        }
    ]).then(function (userSong) {

        var spotify = new Spotify(keys.spotify);
        var song;

        if (!userSong.song) {
            song = "The Sign - Ace of Base";
        } else {
            song = userSong.song;
        };

        spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Song Name: ${data.tracks.items[0].name}`);
            console.log(`Spotify Preview: ${data.tracks.items[0].preview_url}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
        });
    });
}
// CHOICE IS SONG END

// CHOICE IS MOVIE START
function movieSearch() {
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

        var movieQueryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&y=&plot=short";

        axios.get(movieQueryURL)
            .then(
                function (movieResponse) {
                    console.log(`Title: ${movieResponse.data.Title}\nYear Released: ${movieResponse.data.Year}\nIMDB Rating: ${movieResponse.data.imdbRating}\nRotten Tomatoes Rating: ${movieResponse.data.Ratings[1].Value}\nProduction Country: ${movieResponse.data.Country}\nLanguage: ${movieResponse.data.Language}\nPlot: ${movieResponse.data.Plot}\nActors: ${movieResponse.data.Actors}`);
                }
            );
    });
}
// CHOICE IS MOVIE END

// CHOICE DO WHAT IT SAYS START
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");

        if (error) {
            return console.log(error);
        }

        // START SONG DO-WHAT-IT-SAYS
        else if (dataArr[0] == "spotify-this-song") {

            spotify = new Spotify(keys.spotify);
            song = dataArr[1].split('"').join('');

            spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
                console.log(`Song Name: ${data.tracks.items[0].name}`);
                console.log(`Spotify Preview: ${data.tracks.items[0].preview_url}`);
                console.log(`Album: ${data.tracks.items[0].album.name}`);
            });
        }
        // END SONG DO-WHAT-IT-SAYS

        // START CONCERT DO-WHAT-IT-SAYS
        else if (dataArr[0] == "concert-this") {
            console.log("Data Array 1 Is:"+ dataArr);
            concert = dataArr[1].split(' "').join('').split('"').join('');
            console.log("CONCERT IS:"+ concert);
            
            concertQueryURL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp";

            axios.get(concertQueryURL)
            .then(
                function (response) {
                    concertResponse = response.data;

                    if (concertResponse.length === 0) {
                        console.log("There are no concerts scheduled for this artist.");
                    } else {
                        concertResponse.forEach(function (concert) {
                            console.log("*********************************************\n");
                            console.log(`Venue: ${concert.venue.name}\nVenue Location: ${concert.venue.city}, ${concert.venue.region}\nDate: ${moment(concert.datetime).format("MM/DD/YYYY")}\n`);
                        })
                        }
                    }
                );
        }
        // END CONCERT DO-WHAT-IT-SAYS

        // START MOVIE DO-WHAT-IT-SAYS

        else if (dataArr[0] == "movie-this") {

            movie = dataArr[1].split('"').join('');

            movieQueryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&y=&plot=short";

            axios.get(movieQueryURL)
                .then(
                    function (movieResponse) {
                        console.log(`Title: ${movieResponse.data.Title}\nYear Released: ${movieResponse.data.Year}\nIMDB Rating: ${movieResponse.data.imdbRating}\nRotten Tomatoes Rating: ${movieResponse.data.Ratings[1].Value}\nProduction Country: ${movieResponse.data.Country}\nLanguage: ${movieResponse.data.Language}\nPlot: ${movieResponse.data.Plot}\nActors: ${movieResponse.data.Actors}`);
                    }
                );
        }
        // END MOVIE DO-WHAT-IT-SAYS
    });
}
// CHOICE DO WHAT IT SAYS END

// FIRST PROMPT START
inquirer.prompt([
    {
        type: "list",
        name: "choice",
        message: "What do you want to search for?",
        choices: ["Concert", "Song", "Movie", "Do What It Says"],
    }
]).then(function (user) {
    if (user.choice === "Concert") {
        concertSearch();
    }
    else if (user.choice === "Song") {
        songSearch();
    }
    else if (user.choice === "Movie") {
        movieSearch();
    }
    else if (user.choice === "Do What It Says") {
        doWhatItSays();
    }
});
// FIRST PROMPT END
