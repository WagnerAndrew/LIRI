require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");


// var axios = require("axios");

// CHOICE WRAPPER START
inquirer.prompt([

    {
      type: "list",
      name: "choice",
      message: "What do you want to search for?",
      choices: ["Concert", "Song", "Movie", ""], 
    }

  ]).then(function(user) {

      // CHOICE IS SONG START
      if (user.choice === "Song") {

          inquirer.prompt([

              {
                  type: "input",
                  name: "song",
                  message: "What song do you want to look for?"
              }

          ]).then(function (userSong) {

            var spotify = new Spotify (keys.spotify);
            var song = userSong.song;

              spotify.search({ type: 'track', query: song }, function (err, data) {
                  if (err) {
                      return console.log('Error occurred: ' + err);
                  }

                  console.log(data);
              });

          });
      }
      // CHOICE IS SONG END




});
// CHOICE WRAPPER END








