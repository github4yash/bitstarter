var fs = require ('fs');
var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
	fs.readFile('./indexe.html', 'utf8', function (err,data) {
	  if (err) {
            response.send(err);
/*
            response.send("Error occured...");
	    return console.log(err);
*/
	  } else {
	    response.send(data);
          }
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
