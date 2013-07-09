var fs = require ('fs');
var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
	fs.readFile('index.html', 'utf8', function (err,data) {
	  if (err) {
            response.write("Error occured...");
	    return console.log(err);
	  }
	  response.write(data);
	});
  response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
