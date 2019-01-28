var express = require("express");
var app = express();
var axios = require("axios");
//scraping library
var cheerio = require("cheerio");


// Require the modelss
var db = require("../models")

// Routes

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "../public/index.html"));
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
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.put("/savearticle/:articleId", function(req, res) {
    console.log(req.body)
    db.Article.findByIdAndUpdate(req.params.articleId, {    $set: { saved: true }
    }).then(function(data) {
        res.json(data);
    });
});

app.get("/displaysaved/", function(req, res) {
    db.Article.find( 
        { saved: true }
    ).then(function(data) {
        res.json(data);
    });
});

app.put("/delete-from-saved/:articleId", function(req, res) {
    db.Article.findByIdAndUpdate(req.params.articleId, {    $set: { saved: false }
    }).then(function(data) {
        res.json(data);
    });
});

app.delete("/delete-note/:noteId", function (req, res) {
  db.Note.findByIdAndRemove(req.params.noteId, (err, note) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send();
  });

});
app.delete("/clearAllArticles", function (req, res) {
    db.articles.drop({})
    });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    console.log("inside post method for saving articles and sending ", req.body)
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  
  module.exports=app;