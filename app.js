// Require the express module
const express = require('express');
// Create a new web server
const app = express();

const Sass = require('./sass');
const config = require('./config.json');

for (let conf of config.sass) {
  new Sass(conf);
}

// Tell the web server to serve files
// from the www folder
app.use(express.static('www'));
// Start the web server on port 3000
app.listen(3000, () => console.log('Listening on port 3000'));

// Serve the index page everywhere so that the
// frontend router can decide what to do
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './www/index.html'));
});




//HIGHSCORE

let fs = require('fs'); // import the fileSystem library
let bodyParser = require('body-parser'); // import body-parser (to read sent data from clients)
app.use(bodyParser.json()); // use body-parser
app.use(bodyParser.urlencoded({ extended: false })); // use body-parser

let highscores = require('./www/json/highscore.json'); // load the json file - store it in a new variable
//highscores.length = 0;   //un-comment and restart server to reset the json file!
// add a route that the browsers/clients can communicate through
app.post('/add-score', (req, res) => {
  highscores.push(req.body); // add the new score
  highscores.sort(function (a, b) {     // Check MDN js array sort
    return b.score - a.score;
  });

  highscores = highscores.slice(0, 10); // only keep the top 10 in the array
  fs.writeFile('./www/json/highscore.json', JSON.stringify(highscores), function (err) {
    if (err) { console.log('Error writing the highscore file!'); }
  }); // replace the file content with the new array
  res.json(highscores)// respond to the browser, send the new/updated array

});



