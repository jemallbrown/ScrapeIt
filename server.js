// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Require the models
var db = require("./models")

var port = process.env.PORT || 7770;


// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/dishScraper", { useNewUrlParser: true });

// // Set mongoose to leverage built in JavaScript ES6 Promises
// mongoose.Promise = Promise;




// Routes

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Time to get scraping!!!");
});


app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// ***************** //
//   // Retrieve data from the db
//   app.get("/all", function(req, res) {
//     // Find all results from the scrapedData collection in the db
//     db.scrapedData.find({}, function(error, found) {
//       // Throw any errors to the console
//       if (error) {
//         console.log(error);
//       }
//       // If there are no errors, send the data to the browser as json
//       else {
//         res.json(found);
//       }
//     });
//   });
  
  // Scrape data from one site and place it into the mongodb db
  app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("http://theybf.com").then(function(response) {
      // Load the html body from axios into cheerio
      // console.log(response);
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".story-title").each(function(i, element) {
        var result = {};
        // Save the text and href of each link enclosed in the current element
        result.title = $(element).children("h2").children("a").text();
        result.link = $(element).children("h2").children("a").attr("href");
        console.log(result);

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });

      });
    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// *****************


// // Database configuration
// var databaseUrl = "dishScraper";
// var collections = ["scrapedData"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function() {
//   console.log("Mongoose connection successful.");
// });

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port " + port + "!");
});
