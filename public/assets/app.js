// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='panel'><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br /> </p><button class='btn btn-success' data-id='" + data[i]._id + "' id='savearticle' href='/displaysaved/'>Save Article</button></div>");
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    // $("#articles").append("<button data-id='" + data._id + "' id='savearticle'>Save Article</button>");
  }
});

$('#home').click(function() {
  location.reload();
});


$(document).on("click", "#saved_button", function (){
  console.log("saved article button from nav bar clicked");
  //empty both articles divs
  $("#articles").empty();
  
  // change H2 Id from current to saved
  $("#currentOrSaved").text("Saved Articles:")

  //Now make an ajax call to get the saved articles
  $.ajax({
    method: "GET",
    url: "/displaysaved/"
  })
    // With that done, add the note information to the page
    .then(function(data) {  for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='panel'><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br /> </p><button class='btn btn-success' data-id='" + data[i]._id + "' id='deleteFromSaved'>Remove From Saved</button></div>");
    }
    });
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data.title);
      // The title of the article
      $("#notes").append("<h4>" + data.title + "</h4>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save This Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
console.log(thisId)
console.log($("#titleinput").val())
console.log($("#bodyinput").val())

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// When you click the savenote button
$(document).on("click", "#savearticle", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/savearticle/" + thisId
    // data: {
    //   // set value of saved to true
    //   saved: true
    // }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the save button
  $("#savearticle").hide();
});

// When you click the delete saved button
$(document).on("click", "#deleteFromSaved", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/delete-from-saved/" + thisId
    // data: {
    //   // set value of saved to true
    //   saved: true
    // }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    });

});

// When you click the savenote button
$(document).on("click", "#clearAllArticles", function() {
  console.log("clear all articles button clicked")

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "delete",
    url: "/clearAllArticles/"
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });

});