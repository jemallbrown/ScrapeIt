var express = require("express");
var router = express.Router();
// Requiring our Comment and Article models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

//scraping library
var cheerio = require("cheerio");
var request = require("request");

// // Routes
// // Main route (simple Hello World Message)
// app.get("/", function(req, res) {
//     res.send("Hello world with routes moved");
//   });
  
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
  
//   // Scrape data from one site and place it into the mongodb db
//   app.get("/scrape", function(req, res) {
//     // Make a request via axios for the news section of `ycombinator`
//     axios.get("http://theybf.com").then(function(response) {
//       // Load the html body from axios into cheerio
//       // console.log(response);
//       var $ = cheerio.load(response.data);
//       // For each element with a "title" class
//       $(".story-title").each(function(i, element) {
//         // Save the text and href of each link enclosed in the current element
//         var title = $(element).children("h2").children("a").text();
//         var link = $(element).children("h2").children("a").attr("href");
  
//         // If this found element had both a title and a link
//         if (title && link) {
//           // Insert the data in the scrapedData db
//           db.scrapedData.insert({
//             title: title,
//             link: link
//           },
//           function(err, inserted) {
//             if (err) {
//               // Log the error if one is encountered during the query
//               console.log(err);
//             }
//             else {
//               // Otherwise, log the inserted data
//               console.log(inserted);
//             }
//           });
//         }
//       });
//     });
  
//     // Send a "Scrape Complete" message to the browser
//     res.send("Scrape Complete");
//   });
  
//   module.exports=router;